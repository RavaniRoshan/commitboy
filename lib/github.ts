/**
 * GitHub Client - Interact with GitHub API for changelog automation
 */

import { Octokit } from '@octokit/rest';

export interface CommitData {
  sha: string;
  commit: {
    message: string;
    author: {
      name: string;
      email: string;
      date: string;
    };
  };
  parents: Array<{ sha: string }>;
}

export class GitHubClient {
  private octokit: Octokit;
  
  constructor(token: string) {
    this.octokit = new Octokit({ auth: token });
  }
  
  /**
   * Fetch commits since a specific date or SHA
   */
  async getCommitsSince(
    owner: string,
    repo: string,
    since?: string | Date,
    sha?: string,
    perPage: number = 100
  ): Promise<CommitData[]> {
    const params: any = {
      owner,
      repo,
      per_page: perPage
    };
    
    if (since) {
      params.since = since instanceof Date ? since.toISOString() : since;
    }
    
    if (sha) {
      params.sha = sha;
    }
    
    try {
      const { data: commits } = await this.octokit.rest.repos.listCommits(params);
      
      // Filter out merge commits (those with 2+ parents)
      return commits.filter(commit => commit.parents.length === 1) as CommitData[];
    } catch (error) {
      console.error('Error fetching commits:', error);
      throw error;
    }
  }
  
  /**
   * Get the default branch for a repository
   */
  async getDefaultBranch(owner: string, repo: string): Promise<string> {
    try {
      const { data: repository } = await this.octokit.rest.repos.get({
        owner,
        repo
      });
      return repository.default_branch;
    } catch (error) {
      console.error('Error fetching repository:', error);
      throw error;
    }
  }
  
  /**
   * Get the current content of CHANGELOG.md
   */
  async getChangelogContent(
    owner: string,
    repo: string,
    path: string = 'CHANGELOG.md'
  ): Promise<{ content: string; sha: string } | null> {
    try {
      const { data: file } = await this.octokit.rest.repos.getContent({
        owner,
        repo,
        path
      });
      
      if ('content' in file && file.content) {
        return {
          content: Buffer.from(file.content, 'base64').toString('utf-8'),
          sha: file.sha
        };
      }
      return null;
    } catch (error: any) {
      if (error.status === 404) {
        return null; // File doesn't exist yet
      }
      console.error('Error fetching changelog:', error);
      throw error;
    }
  }
  
  /**
   * Create or update CHANGELOG.md
   */
  async commitChangelog(
    owner: string,
    repo: string,
    content: string,
    commitMessage: string = 'chore: update changelog [skip ci]',
    path: string = 'CHANGELOG.md'
  ): Promise<void> {
    try {
      // Get current file (if exists) to get the SHA for updating
      let sha: string | undefined;
      try {
        const { data: file } = await this.octokit.rest.repos.getContent({
          owner,
          repo,
          path
        });
        if ('sha' in file) {
          sha = file.sha;
        }
      } catch (error: any) {
        if (error.status !== 404) {
          throw error;
        }
        // File doesn't exist, will create new
      }
      
      // Get default branch
      const defaultBranch = await this.getDefaultBranch(owner, repo);
      
      // Get the current commit SHA
      const { data: ref } = await this.octokit.rest.git.getRef({
        owner,
        repo,
        ref: `heads/${defaultBranch}`
      });
      const currentCommitSha = ref.object.sha;
      
      // Create blob
      const { data: blob } = await this.octokit.rest.git.createBlob({
        owner,
        repo,
        content: Buffer.from(content).toString('base64'),
        encoding: 'base64'
      });
      
      // Get current tree
      const { data: currentCommit } = await this.octokit.rest.git.getCommit({
        owner,
        repo,
        commit_sha: currentCommitSha
      });
      
      // Create new tree
      const { data: newTree } = await this.octokit.rest.git.createTree({
        owner,
        repo,
        base_tree: currentCommit.tree.sha,
        tree: [
          {
            path,
            mode: '100644',
            type: 'blob',
            sha: blob.sha
          }
        ]
      });
      
      // Create commit
      const { data: newCommit } = await this.octokit.rest.git.createCommit({
        owner,
        repo,
        message: commitMessage,
        tree: newTree.sha,
        parents: [currentCommitSha]
      });
      
      // Update reference
      await this.octokit.rest.git.updateRef({
        owner,
        repo,
        ref: `heads/${defaultBranch}`,
        sha: newCommit.sha
      });
      
      console.log(`✅ Successfully committed changelog to ${owner}/${repo}`);
    } catch (error) {
      console.error('Error committing changelog:', error);
      throw error;
    }
  }
  
  /**
   * Create a GitHub issue for errors
   */
  async createIssue(
    owner: string,
    repo: string,
    title: string,
    body: string,
    labels: string[] = ['automation', 'bug']
  ): Promise<void> {
    try {
      await this.octokit.rest.issues.create({
        owner,
        repo,
        title,
        body,
        labels
      });
      console.log(`🐛 Created issue: ${title}`);
    } catch (error) {
      console.error('Error creating issue:', error);
      throw error;
    }
  }
  
  /**
   * Create a commit comment
   */
  async createCommitComment(
    owner: string,
    repo: string,
    commitSha: string,
    body: string
  ): Promise<void> {
    try {
      await this.octokit.rest.repos.createCommitComment({
        owner,
        repo,
        commit_sha: commitSha,
        body
      });
    } catch (error) {
      console.error('Error creating commit comment:', error);
      throw error;
    }
  }
}

export default GitHubClient;