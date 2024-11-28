import { execSync } from 'node:child_process';

export const getLocalCommits = () => {
  // Get git log output
  const gitLog = execSync('git log --oneline  --no-color').toString();
  return gitLog.split('\n');
};