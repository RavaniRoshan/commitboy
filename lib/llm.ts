/**
 * LLM Wrapper - Interface with Anthropic Claude for changelog generation
 */

import Anthropic from '@anthropic-ai/sdk';
import * as fs from 'fs';
import * as path from 'path';
import { ParsedCommit } from './parser';

export interface ChangelogResult {
  markdown: string;
  tweet?: string;
  generatedAt: string;
}

export class LLMClient {
  private anthropic: Anthropic;
  private changelogPrompt: string;
  private tweetPrompt: string;
  
  constructor(apiKey: string) {
    this.anthropic = new Anthropic({ apiKey });
    
    // Load prompts
    const promptsDir = path.join(process.cwd(), 'prompts');
    this.changelogPrompt = fs.readFileSync(
      path.join(promptsDir, 'changelog.txt'),
      'utf-8'
    );
    this.tweetPrompt = fs.readFileSync(
      path.join(promptsDir, 'tweet.txt'),
      'utf-8'
    );
  }
  
  /**
   * Generate a changelog from parsed commits
   */
  async generateChangelog(
    commits: ParsedCommit[],
    options: {
      includeTweet?: boolean;
      repoUrl?: string;
    } = {}
  ): Promise<ChangelogResult> {
    try {
      // Filter out trivial commits before sending to LLM
      const significantCommits = commits.filter(commit => {
        const trivialPatterns = [
          /^(fix|update)?\s*(typo|formatting|lint|style|whitespace)/i,
          /^(chore|deps?).*update/i,
          /^\s*$/,
          /^(merge|update)\s+(branch|from)/i,
          /skip ci/i
        ];
        return !trivialPatterns.some(pattern => pattern.test(commit.message));
      });
      
      if (significantCommits.length === 0) {
        return {
          markdown: `## ${new Date().toISOString().split('T')[0]}\n\nNo significant changes in this release.`,
          generatedAt: new Date().toISOString()
        };
      }
      
      // Prepare the input for Claude
      const today = new Date().toISOString().split('T')[0];
      const userMessage = `Date: ${today}\n\nCommits:\n${JSON.stringify(significantCommits, null, 2)}`;
      
      // Call Claude API
      const response = await this.anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2000,
        temperature: 0.3,
        system: this.changelogPrompt,
        messages: [
          {
            role: 'user',
            content: userMessage
          }
        ]
      });
      
      // Extract markdown from response
      let markdown = response.content[0].type === 'text' 
        ? response.content[0].text 
        : '';
      
      // Clean up the output
      markdown = this.cleanMarkdown(markdown);
      
      // Generate tweet if requested
      let tweet: string | undefined;
      if (options.includeTweet) {
        tweet = await this.generateTweetSummary(commits, options.repoUrl);
      }
      
      return {
        markdown,
        tweet,
        generatedAt: new Date().toISOString()
      };
      
    } catch (error) {
      console.error('Error generating changelog:', error);
      throw error;
    }
  }
  
  /**
   * Generate a tweet summary of the changes
   */
  async generateTweetSummary(
    commits: ParsedCommit[],
    repoUrl?: string
  ): Promise<string> {
    try {
      // Get commit messages
      const commitMessages = commits.map(c => c.message);
      const changelogUrl = repoUrl 
        ? `${repoUrl}/blob/main/CHANGELOG.md`
        : 'https://github.com/your-org/your-repo/blob/main/CHANGELOG.md';
      
      const userMessage = `Commits: ${JSON.stringify(commitMessages)}\n\nChangelog URL: ${changelogUrl}`;
      
      const response = await this.anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 300,
        temperature: 0.5,
        system: this.tweetPrompt,
        messages: [
          {
            role: 'user',
            content: userMessage
          }
        ]
      });
      
      let tweet = response.content[0].type === 'text' 
        ? response.content[0].text 
        : '';
      
      // Clean up tweet
      tweet = tweet.trim();
      
      // Ensure it's under 240 characters
      if (tweet.length > 240) {
        tweet = tweet.slice(0, 237) + '...';
      }
      
      return tweet;
      
    } catch (error) {
      console.error('Error generating tweet:', error);
      return '🚀 New release just shipped! Check out the latest changes.';
    }
  }
  
  /**
   * Clean up markdown output from LLM
   */
  private cleanMarkdown(markdown: string): string {
    // Remove any preamble the LLM might add
    let cleaned = markdown
      .replace(/^(Here is|Below is|I've generated).*/i, '')
      .replace(/^```markdown\n?/, '')
      .replace(/\n?```$/, '')
      .trim();
    
    // Ensure date header exists
    if (!cleaned.startsWith('## ')) {
      const today = new Date().toISOString().split('T')[0];
      cleaned = `## ${today}\n\n${cleaned}`;
    }
    
    // Ensure proper line endings
    cleaned = cleaned.replace(/\r\n/g, '\n');
    
    return cleaned;
  }
  
  /**
   * Validate the generated changelog
   */
  validateChangelog(markdown: string): { valid: boolean; issues: string[] } {
    const issues: string[] = [];
    
    // Check for required sections
    const hasDateHeader = /^## \d{4}-\d{2}-\d{2}/m.test(markdown);
    if (!hasDateHeader) {
      issues.push('Missing date header');
    }
    
    // Check for at least one section
    const hasSections = /### (✨|🐛|⚠️|📝)/.test(markdown);
    if (!hasSections) {
      issues.push('No valid changelog sections found');
    }
    
    // Check for commit hashes (should be present)
    const hasHashes = /\([a-f0-9]{7}\)/.test(markdown);
    if (!hasHashes) {
      issues.push('No commit hashes found');
    }
    
    return {
      valid: issues.length === 0,
      issues
    };
  }
}

export default LLMClient;