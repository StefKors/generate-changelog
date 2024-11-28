import { Octokit } from 'octokit';

export const fetchGitHubCommits = async (owner: string, repo: string) => {
  const octokit = new Octokit({});

  const data = await octokit.paginate('GET /repos/{owner}/{repo}/commits', {
    owner: owner,
    repo: repo,
    per_page: 100,
  });

  return data?.map((item) => {
    // add short sha and commit message together
    return `${item.sha.substring(0, 7)} ${item.commit.message}`;
  });
};