import { NextResponse } from 'next/server';
import { Octokit } from '@octokit/rest';
import Anthropic from '@anthropic-ai/sdk';

/**
 * Health Check Endpoint
 * Monitors system status and dependencies
 * 
 * GET /api/health
 */
export async function GET() {
  const checks = {
    llm: { status: 'unknown', response_time: 0 },
    github: { status: 'unknown', response_time: 0 },
    kv: { status: 'unknown', response_time: 0 },
  };

  const startTime = Date.now();

  // Check Anthropic/Claude API
  try {
    const anthropicStart = Date.now();
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY || '',
    });

    // Simple test call
    await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 10,
      temperature: 0,
      messages: [{ role: 'user', content: 'Hi' }],
    });

    checks.llm = {
      status: 'ok',
      response_time: Date.now() - anthropicStart,
    };
  } catch (error) {
    checks.llm = {
      status: 'error',
      response_time: Date.now() - startTime,
    };
  }

  // Check GitHub API
  try {
    const githubStart = Date.now();
    const octokit = new Octokit({
      auth: process.env.GITHUB_TOKEN,
    });

    // Test with rate limit check
    await octokit.rest.rateLimit.get();

    checks.github = {
      status: 'ok',
      response_time: Date.now() - githubStart,
    };
  } catch (error) {
    checks.github = {
      status: 'error',
      response_time: Date.now() - startTime,
    };
  }

  // Check KV (mock for now)
  try {
    const kvStart = Date.now();
    // TODO: Implement actual KV check when @vercel/kv is installed
    // await kv.ping();
    
    checks.kv = {
      status: 'ok', // Mock - would check real status in production
      response_time: Date.now() - kvStart,
    };
  } catch (error) {
    checks.kv = {
      status: 'error',
      response_time: Date.now() - startTime,
    };
  }

  // Determine overall status
  const allOk = Object.values(checks).every((check) => check.status === 'ok');
  const hasErrors = Object.values(checks).some((check) => check.status === 'error');
  
  const overallStatus = allOk ? 'ok' : hasErrors ? 'error' : 'degraded';

  return NextResponse.json({
    status: overallStatus,
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0',
    checks,
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
  }, {
    status: overallStatus === 'ok' ? 200 : overallStatus === 'degraded' ? 200 : 503,
  });
}