/**
 * Manual Test Script - Test commit parser and GitHub client without webhooks
 * 
 * Usage: npx tsx scripts/test-local.ts
 */

import * as dotenv from 'dotenv';
dotenv.config();

import { parseCommits, groupCommitsByType, filterTrivialCommits, ParsedCommit } from '../lib/parser';
import { GitHubClient } from '../lib/github';

async function testParser() {
  console.log('🧪 Testing Commit Parser...\n');
  
  // Test data - simulating GitHub API response
  const testCommits = [
    {
      sha: 'abc123def456',
      commit: {
        message: 'feat(api): add user authentication endpoint',
        author: {
          name: 'John Doe',
          date: '2024-01-15T10:30:00Z'
        }
      },
      parents: [{ sha: 'parent1' }]
    },
    {
      sha: 'def789ghi012',
      commit: {
        message: 'fix: resolve memory leak in data processing\n\nDetailed description here',
        author: {
          name: 'Jane Smith',
          date: '2024-01-14T15:20:00Z'
        }
      },
      parents: [{ sha: 'parent2' }]
    },
    {
      sha: 'ghi345jkl678',
      commit: {
        message: 'docs: update README with installation instructions',
        author: {
          name: 'Bob Wilson',
          date: '2024-01-13T09:00:00Z'
        }
      },
      parents: [{ sha: 'parent3' }]
    },
    {
      sha: 'jkl901mno234',
      commit: {
        message: 'feat!: breaking change - remove deprecated API v1',
        author: {
          name: 'Alice Brown',
          date: '2024-01-12T16:45:00Z'
        }
      },
      parents: [{ sha: 'parent4' }]
    },
    {
      sha: 'mno567pqr890',
      commit: {
        message: 'chore(deps): update dependencies to latest versions',
        author: {
          name: 'Charlie Davis',
          date: '2024-01-11T11:00:00Z'
        }
      },
      parents: [{ sha: 'parent5' }]
    },
    {
      sha: 'pqr123stu456',
      commit: {
        message: 'refactor: optimize database queries for better performance',
        author: {
          name: 'Diana Evans',
          date: '2024-01-10T14:30:00Z'
        }
      },
      parents: [{ sha: 'parent6' }]
    },
    {
      sha: 'stu789vwx012',
      commit: {
        message: 'test: add unit tests for authentication module',
        author: {
          name: 'Eve Foster',
          date: '2024-01-09T13:15:00Z'
        }
      },
      parents: [{ sha: 'parent7' }]
    },
    {
      sha: 'vwx345yza678',
      commit: {
        message: 'Just a random commit without conventional format',
        author: {
          name: 'Frank Green',
          date: '2024-01-08T10:00:00Z'
        }
      },
      parents: [{ sha: 'parent8' }]
    },
    // Merge commit (should be filtered out)
    {
      sha: 'merge123abc',
      commit: {
        message: 'Merge branch feature/user-auth',
        author: {
          name: 'GitHub',
          date: '2024-01-07T09:00:00Z'
        }
      },
      parents: [{ sha: 'parent9' }, { sha: 'parent10' }]
    },
    // Revert commit (should be filtered out)
    {
      sha: 'revert456def',
      commit: {
        message: 'Revert "feat: add new feature"',
        author: {
          name: 'Henry Hill',
          date: '2024-01-06T08:00:00Z'
        }
      },
      parents: [{ sha: 'parent11' }]
    }
  ];
  
  // Parse commits
  const parsed = parseCommits(testCommits);
  console.log(`✅ Parsed ${parsed.length} commits (filtered out ${testCommits.length - parsed.length})\n`);
  
  // Display parsed commits
  console.log('📋 Parsed Commits:');
  parsed.forEach(commit => {
    console.log(`  [${commit.type}] ${commit.breaking ? '⚠️ BREAKING ' : ''}${commit.scope ? `(${commit.scope}) ` : ''}${commit.message}`);
    console.log(`      Hash: ${commit.hash} | Author: ${commit.author}`);
    console.log();
  });
  
  // Group by type
  const grouped = groupCommitsByType(parsed);
  console.log('\n📊 Commits by Type:');
  Object.entries(grouped).forEach(([type, commits]) => {
    if (commits.length > 0) {
      console.log(`  ${type}: ${commits.length}`);
    }
  });
  
  // Filter trivial commits
  const filtered = filterTrivialCommits(parsed);
  console.log(`\n🎯 After filtering trivial: ${filtered.length} commits`);
  
  console.log('\n✅ Parser test completed!\n');
  
  return parsed;
}

async function testGitHubClient() {
  console.log('🧪 Testing GitHub Client...\n');
  
  const token = process.env.GITHUB_TOKEN;
  
  if (!token) {
    console.log('⚠️  GITHUB_TOKEN not found in .env file');
    console.log('   Skipping GitHub API tests. Add GITHUB_TOKEN to test with real data.\n');
    return;
  }
  
  const client = new GitHubClient(token);
  
  // Test with a public repository (you can change this)
  const owner = 'facebook';
  const repo = 'react';
  
  console.log(`📡 Testing with ${owner}/${repo}...\n`);
  
  try {
    // Test getting default branch
    const defaultBranch = await client.getDefaultBranch(owner, repo);
    console.log(`✅ Default branch: ${defaultBranch}`);
    
    // Test getting recent commits (last 5)
    const commits = await client.getCommitsSince(owner, repo, undefined, undefined, 5);
    console.log(`✅ Fetched ${commits.length} commits`);
    
    // Parse the real commits
    const parsed = parseCommits(commits);
    console.log(`✅ Parsed ${parsed.length} commits after filtering\n`);
    
    console.log('📋 Sample parsed commits:');
    parsed.slice(0, 3).forEach(commit => {
      console.log(`  [${commit.type}] ${commit.scope ? `(${commit.scope}) ` : ''}${commit.message.slice(0, 60)}${commit.message.length > 60 ? '...' : ''}`);
    });
    
    console.log('\n✅ GitHub Client test completed!\n');
    
  } catch (error) {
    console.error('❌ GitHub API test failed:', error);
  }
}

async function main() {
  console.log('='.repeat(60));
  console.log('🚀 Changelog Automator - Local Test Script');
  console.log('='.repeat(60));
  console.log();
  
  try {
    // Test parser
    await testParser();
    
    // Test GitHub client
    await testGitHubClient();
    
    console.log('='.repeat(60));
    console.log('✅ All tests completed!');
    console.log('='.repeat(60));
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

main();