/**
 * Commit Parser - Extract structured data from Git commit messages
 * Supports conventional commits format: type(scope): message
 */

export interface ParsedCommit {
  type: 'feat' | 'fix' | 'docs' | 'chore' | 'refactor' | 'test' | 'other';
  scope: string | null;
  message: string;
  breaking: boolean;
  hash: string;
  author: string;
  date: string;
  body?: string;
}

interface GitHubCommit {
  sha: string;
  commit: {
    message: string;
    author: {
      name: string;
      date: string;
    };
  };
  parents: Array<{ sha: string }>;
}

const VALID_TYPES = ['feat', 'fix', 'docs', 'chore', 'refactor', 'test'] as const;

/**
 * Extract emojis from text
 * Note: Simplified for ES5 compatibility
 */
function stripEmojis(text: string): string {
  // Match common emoji patterns
  return text
    .replace(/:[\w_]+:/g, '') // Remove :emoji: syntax
    .replace(/[\u{1F600}-\u{1F64F}]/gu, '') // Emoticons
    .replace(/[\u{1F300}-\u{1F5FF}]/gu, '') // Symbols & pictographs  
    .replace(/[\u{1F680}-\u{1F6FF}]/gu, '') // Transport & map
    .replace(/[\u{1F1E0}-\u{1F1FF}]/gu, '') // Flags
    .replace(/[\u{2600}-\u{26FF}]/gu, '') // Misc symbols
    .replace(/[\u{2700}-\u{27BF}]/gu, '') // Dingbats
    .trim();
}

/**
 * Parse a single commit message
 */
export function parseCommitMessage(
  message: string,
  hash: string,
  author: string,
  date: string
): ParsedCommit {
  const cleanMessage = stripEmojis(message);
  const lines = cleanMessage.split('\n');
  const firstLine = lines[0].trim();
  
  // Check for breaking change markers
  const hasBreakingMarker = firstLine.includes('!') || 
                           cleanMessage.includes('BREAKING CHANGE') ||
                           cleanMessage.includes('BREAKING-CHANGE');
  
  // Parse conventional commit format: type(scope): message
  const conventionalMatch = firstLine.match(/^(\w+)(?:\(([^)]+)\))?!?:\s*(.+)$/);
  
  if (conventionalMatch) {
    const [, rawType, scope, msg] = conventionalMatch;
    const type = VALID_TYPES.includes(rawType as any) ? rawType as ParsedCommit['type'] : 'other';
    const breaking = hasBreakingMarker || firstLine.includes(`${rawType}!`);
    
    return {
      type,
      scope: scope || null,
      message: msg.trim(),
      breaking,
      hash: hash.slice(0, 7),
      author,
      date,
      body: lines.slice(1).join('\n').trim() || undefined
    };
  }
  
  // Non-conventional commit
  return {
    type: 'other',
    scope: null,
    message: firstLine,
    breaking: hasBreakingMarker,
    hash: hash.slice(0, 7),
    author,
    date,
    body: lines.slice(1).join('\n').trim() || undefined
  };
}

/**
 * Parse multiple commits from GitHub API response
 */
export function parseCommits(commits: GitHubCommit[]): ParsedCommit[] {
  const seen = new Set<string>();
  const parsed: ParsedCommit[] = [];
  
  for (const commit of commits) {
    // Skip merge commits (has 2+ parents)
    if (commit.parents.length > 1) {
      continue;
    }
    
    // Skip revert commits
    const message = commit.commit.message.toLowerCase();
    if (message.startsWith('revert') || message.startsWith('Revert')) {
      continue;
    }
    
    // Skip trivial commits
    if (message.includes('[skip ci]') || 
        message.includes('wip') ||
        message.includes('WIP')) {
      continue;
    }
    
    // Deduplicate by hash
    if (seen.has(commit.sha)) {
      continue;
    }
    seen.add(commit.sha);
    
    const parsedCommit = parseCommitMessage(
      commit.commit.message,
      commit.sha,
      commit.commit.author.name,
      commit.commit.author.date
    );
    
    parsed.push(parsedCommit);
  }
  
  return parsed;
}

/**
 * Group commits by type for changelog organization
 */
export function groupCommitsByType(commits: ParsedCommit[]): Record<string, ParsedCommit[]> {
  const grouped: Record<string, ParsedCommit[]> = {
    breaking: [],
    feat: [],
    fix: [],
    docs: [],
    chore: [],
    refactor: [],
    test: [],
    other: []
  };
  
  for (const commit of commits) {
    if (commit.breaking) {
      grouped.breaking.push(commit);
    } else {
      grouped[commit.type].push(commit);
    }
  }
  
  // Sort each group by date (newest first)
  for (const key of Object.keys(grouped)) {
    grouped[key].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }
  
  return grouped;
}

/**
 * Filter out trivial commits (formatting, typos, etc.)
 */
export function filterTrivialCommits(commits: ParsedCommit[]): ParsedCommit[] {
  const trivialPatterns = [
    /^(fix|update)?\s*(typo|formatting|lint|style|whitespace)/i,
    /^\s*$/,
    /^(merge|update)\s+(branch|from)/i
  ];
  
  return commits.filter(commit => {
    return !trivialPatterns.some(pattern => pattern.test(commit.message));
  });
}