import * as fs from 'node:fs';
import { getLocalCommits } from './getLocalCommits.js';
import { fetchGitHubCommits } from './fetchGitHubCommits.js';

export type ChangeType = "Fixed"
  |"Added"
  |"Improved"
  |"Removed"

export interface Change {
    type: ChangeType;
    message: string;
}

export interface ChangelogEntry {
    [version: string]: Change[];
}

export interface Changelog {
    releases: ChangelogEntry;
}

export interface Options {
    write?: boolean;
    repo?: string;
    owner?: string;
}

const generateChangelog = async ({ write, owner, repo }: Options): Promise<Changelog> => {
    try {

        let lines: string[] = []
        if (repo && owner) {
            console.log("fetching from remote", owner, repo)
            lines = await fetchGitHubCommits(owner, repo)
        } else {
            console.log("reading local commits")
            lines = getLocalCommits()
        }

        // Initialize changelog object
        const changelog: Changelog = {
            releases: {},
        };

        let currentVersion: string = "0.0.0";
        const versionRegex =
            /^[0-9a-f]+\s+(\d+\.\d+\.\d+(?:-[a-zA-Z0-9]+(?:\.\d+)?)?)/;
        const prNumberRegex = /#(\d+)/;

        lines.forEach((line) => {
            // Check if line contains a version
            const versionMatch = line.match(versionRegex);
            if (versionMatch?.[1]) {
                currentVersion = versionMatch[1];
                changelog.releases[currentVersion] = [];
            } else if (currentVersion && line.trim()) {
                // Process commit message
                const commitMessage = line.substring(8).trim(); // Remove commit hash
                const prMatch = commitMessage.match(prNumberRegex);

                let formattedMessage = commitMessage;

                // Determine the type of change
                let changeType: ChangeType = 'Fixed';
                if (commitMessage.toLowerCase().includes('add')) {
                    changeType = 'Added';
                } else if (commitMessage.toLowerCase().includes('improve')) {
                    changeType = 'Improved';
                } else if (commitMessage.toLowerCase().includes('remove')) {
                    changeType = 'Removed';
                }

                // Format the message similar to the example
                if (prMatch) {
                    formattedMessage = `${commitMessage} - #${prMatch[1]}`;
                } else {
                    formattedMessage = `${commitMessage}`;
                }

                const isMergeCommit = formattedMessage.includes('Merge branch') || formattedMessage.includes('Merge pull request');
                const isVersionBump = /^\d+\.\d+\.\d+/.test(formattedMessage);

                if (
                    !isMergeCommit &&
                    !isVersionBump &&
                    formattedMessage !== '' &&
                    currentVersion
                ) {
                    if (!changelog.releases[currentVersion]) {
                        changelog.releases[currentVersion] = [];
                    }
                    (changelog.releases[currentVersion] as Change[]).push({
                        type: changeType,
                        message: formattedMessage
                    });
                }
            } else {
                // fallback and defaults
            }
        });

        // check version and if it's still the default, rename it.
        if (currentVersion === '0.0.0') {
            delete Object.assign(changelog.releases, { ['changes']: changelog.releases['0.0.0'] })['0.0.0'];
        }

        // Sort versions using semver comparison
        const sortedReleases: ChangelogEntry = {};
        Object.keys(changelog.releases)
            .sort((a, b) => {
                // Keep 'changes' at the end
                if (a === 'changes') return 1;
                if (b === 'changes') return -1;

                // Split version strings into components and ensure numbers (default to 0)
                const aParts = a.split('.').map(part => Number(part) || 0);
                const bParts = b.split('.').map(part => Number(part) || 0);

                // Compare major, minor, and patch versions
                for (let i = 0; i < 3; i++) {
                    if (aParts[i] !== bParts[i]) {
                        return (bParts?.[i] ?? 0) - (aParts?.[i] ?? 0);
                    }
                }
                return 0;
            })
            .forEach(key => {
                if (changelog.releases[key]) {
                    sortedReleases[key] = changelog.releases[key];
                }
            });

        changelog.releases = sortedReleases;

        if (write) {
            // Write changelog to file
            fs.writeFileSync('changelog.json', JSON.stringify(changelog, null, 2));
        }

        console.log('Changelog has been generated successfully!');
        return changelog
    } catch (error) {
        console.error('Error generating changelog:', error);
        return {} as Changelog;
    }
};

export { generateChangelog }