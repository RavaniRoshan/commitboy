/**
 * Rate Limiter - Manage commit quotas using Vercel KV
 */

// Free tier: 50 commits per month
const FREE_TIER_LIMIT = 50;

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  current: number;
  limit: number;
  plan: 'free' | 'pro';
}

interface InstallationData {
  installed_at: string;
  plan: 'free' | 'pro';
  commits_this_month: number;
  razorpay_customer_id?: string;
}

/**
 * Get current month in YYYY-MM format
 */
function getCurrentMonth(): string {
  return new Date().toISOString().slice(0, 7);
}

/**
 * Check if the repo is within rate limits
 * 
 * In production, this would use Vercel KV:
 * - Check KV for commits:{owner}:{repo}:{YYYY-MM}
 * - Compare against limit based on plan
 */
export async function checkLimit(
  owner: string,
  repo: string
): Promise<RateLimitResult> {
  // TODO: Implement actual KV lookup
  // const kv = require('@vercel/kv');
  // const key = `commits:${owner}:${repo}:${getCurrentMonth()}`;
  // const current = await kv.get(key) || 0;
  // const installationKey = `installation:${owner}:${repo}`;
  // const installation = await kv.get(installationKey);
  // const plan = installation?.plan || 'free';
  
  // Mock implementation for now
  const current = 0; // Would come from KV
  const plan = 'free' as 'free' | 'pro'; // Would come from KV
  const limit = plan === 'pro' ? Infinity : FREE_TIER_LIMIT;
  
  const allowed = plan === 'pro' || current < limit;
  const remaining = plan === 'pro' ? Infinity : Math.max(0, limit - current);
  
  return {
    allowed,
    remaining,
    current,
    limit,
    plan
  };
}

/**
 * Increment the commit counter for a repo
 */
export async function incrementCommits(
  owner: string,
  repo: string,
  amount: number = 1
): Promise<number> {
  // TODO: Implement actual KV increment
  // const kv = require('@vercel/kv');
  // const key = `commits:${owner}:${repo}:${getCurrentMonth()}`;
  // const newCount = await kv.incrby(key, amount);
  
  // Set TTL to end of month
  // const now = new Date();
  // const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  // await kv.expireat(key, Math.floor(endOfMonth.getTime() / 1000));
  
  console.log(`Incremented commits for ${owner}/${repo} by ${amount}`);
  return amount; // Would return newCount
}

/**
 * Get usage stats for a repo
 */
export async function getUsageStats(
  owner: string,
  repo: string
): Promise<{
  current: number;
  limit: number;
  remaining: number;
  plan: 'free' | 'pro';
  resets_at: string;
}> {
  const limitInfo = await checkLimit(owner, repo);
  
  // Calculate reset date (end of month)
  const now = new Date();
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
  
  return {
    current: limitInfo.current,
    limit: limitInfo.plan === 'pro' ? Infinity : FREE_TIER_LIMIT,
    remaining: limitInfo.remaining,
    plan: limitInfo.plan,
    resets_at: endOfMonth.toISOString()
  };
}

/**
 * Check if user has Pro plan
 */
export async function isProPlan(owner: string, repo: string): Promise<boolean> {
  const limitInfo = await checkLimit(owner, repo);
  return limitInfo.plan === 'pro';
}
