import { NextRequest, NextResponse } from 'next/server';
import { createHmac } from 'crypto';
import { parseCommits } from '@/lib/parser';
import { GitHubClient } from '@/lib/github';
import { LLMClient } from '@/lib/llm';
import { checkLimit, incrementCommits } from '@/lib/limiter';

/**
 * GitHub Webhook Handler
 * Receives push events and auto-generates changelogs
 * 
 * POST /api/webhook
 */
export async function POST(request: NextRequest) {
  try {
    // Get the signature from headers
    const signature = request.headers.get('x-hub-signature-256');
    const event = request.headers.get('x-github-event');
    
    if (!signature) {
      return NextResponse.json(
        { error: 'Missing signature' },
        { status: 401 }
      );
    }

    // Verify webhook signature
    const isValid = await verifySignature(request, signature);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    // Only process push events
    if (event !== 'push') {
      return NextResponse.json(
        { message: 'Event ignored' },
        { status: 200 }
      );
    }

    // Parse the webhook payload
    const payload = await request.json();
    
    // Extract repository info
    const { repository, ref, commits: rawCommits, pusher } = payload;
    
    if (!repository || !ref || !rawCommits) {
      return NextResponse.json(
        { error: 'Invalid payload' },
        { status: 400 }
      );
    }

    // Only process pushes to main/master branch
    if (!ref.includes('main') && !ref.includes('master')) {
      return NextResponse.json(
        { message: 'Branch ignored' },
        { status: 200 }
      );
    }

    const owner = repository.owner.login;
    const repo = repository.name;
    const repoUrl = repository.html_url;

    // Skip if commit message contains [skip ci]
    const lastCommit = rawCommits[rawCommits.length - 1];
    if (lastCommit?.message?.includes('[skip ci]')) {
      return NextResponse.json(
        { message: 'Skipped - [skip ci] detected' },
        { status: 200 }
      );
    }

    // Check rate limits
    const limitCheck = await checkLimit(owner, repo);
    
    if (!limitCheck.allowed) {
      // Create GitHub issue about limit
      const githubToken = process.env.GITHUB_TOKEN;
      if (githubToken) {
        const github = new GitHubClient(githubToken);
        await github.createIssue(
          owner,
          repo,
          '🚀 Upgrade to Pro for Unlimited Changelogs',
          `You've reached the free tier limit (50 commits/month for ${new Date().toLocaleString('default', { month: 'long' })}).

**Current Usage:** ${limitCheck.current}/${limitCheck.limit} commits

Upgrade to Pro for:
- Unlimited commits
- No watermark
- Tweet-ready summaries
- Priority support

[Upgrade now →](${process.env.NEXT_PUBLIC_APP_URL}/pricing?installation_id=${owner}:${repo})`,
          ['automation', 'rate-limit']
        );
      }
      
      return NextResponse.json(
        { 
          error: 'Rate limit exceeded',
          plan: limitCheck.plan,
          limit: limitCheck.limit,
          current: limitCheck.current,
          upgrade_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`
        },
        { status: 402 }
      );
    }

    // Parse commits
    const parsedCommits = parseCommits(rawCommits);
    
    if (parsedCommits.length === 0) {
      return NextResponse.json(
        { message: 'No significant commits to process' },
        { status: 200 }
      );
    }

    // Initialize clients
    const githubToken = process.env.GITHUB_TOKEN;
    const anthropicKey = process.env.ANTHROPIC_API_KEY;
    
    if (!githubToken || !anthropicKey) {
      console.error('Missing environment variables');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    const llm = new LLMClient(anthropicKey);
    const github = new GitHubClient(githubToken);

    // Generate changelog
    const includeTweet = limitCheck.plan === 'pro';
    const result = await llm.generateChangelog(parsedCommits, {
      includeTweet,
      repoUrl
    });

    // Validate the changelog
    const validation = llm.validateChangelog(result.markdown);
    if (!validation.valid) {
      console.warn('Changelog validation warnings:', validation.issues);
    }

    // Read existing changelog
    const existingChangelog = await github.getChangelogContent(owner, repo);
    
    // Combine new and existing content
    let updatedContent = result.markdown;
    if (existingChangelog) {
      updatedContent = result.markdown + '\n\n' + existingChangelog.content;
    } else {
      // Add header for new changelog
      updatedContent = `# Changelog\n\nAll notable changes to this project will be documented in this file.\n\n${result.markdown}`;
    }

    // Commit the changelog
    await github.commitChangelog(
      owner,
      repo,
      updatedContent,
      'chore: update changelog [skip ci]'
    );

    // Increment rate limit counter
    await incrementCommits(owner, repo, parsedCommits.length);

    // Add tweet as commit comment if Pro plan
    if (result.tweet && lastCommit) {
      try {
        await github.createCommitComment(
          owner,
          repo,
          lastCommit.id,
          `📝 Changelog updated!\n\n${result.tweet}\n\n[View full changelog →](${repoUrl}/blob/main/CHANGELOG.md)`
        );
      } catch (error) {
        console.warn('Failed to create commit comment:', error);
      }
    }

    // Calculate new remaining count
    const newRemaining = limitCheck.remaining === Infinity 
      ? Infinity 
      : Math.max(0, limitCheck.remaining - parsedCommits.length);

    return NextResponse.json({
      success: true,
      message: 'Changelog updated successfully',
      commits_processed: parsedCommits.length,
      plan: limitCheck.plan,
      remaining: newRemaining,
      includes_tweet: !!result.tweet
    });

  } catch (error: any) {
    console.error('Webhook error:', error);
    
    // Try to create error issue if we have repo info
    try {
      const payload = await request.clone().json();
      if (payload?.repository) {
        const githubToken = process.env.GITHUB_TOKEN;
        if (githubToken) {
          const github = new GitHubClient(githubToken);
          await github.createIssue(
            payload.repository.owner.login,
            payload.repository.name,
            '🤖 Changelog automation failed',
            `The changelog could not be generated:\n\n\`\`\`${error.message}\`\`\`\n\nPlease check the [Vercel logs](https://vercel.com/dashboard) for more details.`,
            ['automation', 'bug']
          );
        }
      }
    } catch (issueError) {
      console.error('Failed to create error issue:', issueError);
    }

    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    );
  }
}

/**
 * Verify GitHub webhook signature
 */
async function verifySignature(request: NextRequest, signature: string): Promise<boolean> {
  const secret = process.env.GITHUB_WEBHOOK_SECRET;
  
  if (!secret) {
    console.warn('GITHUB_WEBHOOK_SECRET not set, skipping signature verification');
    return true;
  }

  try {
    const body = await request.clone().text();
    const hmac = createHmac('sha256', secret);
    hmac.update(body);
    const digest = 'sha256=' + hmac.digest('hex');
    
    return signature === digest;
  } catch (error) {
    console.error('Signature verification error:', error);
    return false;
  }
}