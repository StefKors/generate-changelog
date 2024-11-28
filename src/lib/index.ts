const packageExample = () => {
    console.log('✅ package example using vite')
}

// run with `npx tsx scripts/generate-changelog.ts` or something
import {execSync} from 'child_process';
import * as fs from 'fs';

interface ChangelogEntry {
    [version: string]: string[];
}

interface Changelog {
    releases: ChangelogEntry;
}

export interface Options {
    write?: boolean;
}

const generateChangelog = ({write}: Options) => {
    try {
        // Get git log output
        const gitLog = execSync('git log --oneline  --no-color').toString();
        const lines: string[] = gitLog.split('\n');
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
                let changeType = '[Fixed]';
                if (commitMessage.toLowerCase().includes('add')) {
                    changeType = '[Added]';
                } else if (commitMessage.toLowerCase().includes('improve')) {
                    changeType = '[Improved]';
                } else if (commitMessage.toLowerCase().includes('remove')) {
                    changeType = '[Removed]';
                }

                // Format the message similar to the example
                if (prMatch) {
                    formattedMessage = `${changeType} ${commitMessage} - #${prMatch[1]}`;
                } else {
                    formattedMessage = `${changeType} ${commitMessage}`;
                }

                const isMergeCommit = formattedMessage.includes('Merge branch') || formattedMessage.includes('Merge pull request');
                const isVersionBump = /^\d+\.\d+\.\d+/.test(formattedMessage);

                if (
                    !isMergeCommit &&
                    !isVersionBump &&
                    formattedMessage !== '' &&
                    currentVersion
                ) {
                    if (Array.isArray(changelog.releases[currentVersion]) == false) {
                        changelog.releases[currentVersion] = []
                    }
                    changelog.releases[currentVersion].push(formattedMessage);
                }
            } else {
                // fallback and defaults

            }
        });

        // check version and if it's still the default, rename it.
        if (currentVersion === '0.0.0') {
            delete Object.assign(changelog.releases, {['changes']: changelog.releases['0.0.0'] })['0.0.0'];
        }

        // Sort versions using semver comparison
        const sortedReleases: ChangelogEntry = {};
        Object.keys(changelog.releases)
            .sort((a, b) => {
                // Keep 'changes' at the end
                if (a === 'changes') return 1;
                if (b === 'changes') return -1;

                // Split version strings into components
                const aParts = a.split('.').map(Number);
                const bParts = b.split('.').map(Number);

                // Compare major, minor, and patch versions
                for (let i = 0; i < 3; i++) {
                    if (aParts[i] !== bParts[i]) {
                        return bParts[i] - aParts[i];
                    }
                }
                return 0;
            })
            .forEach(key => {
                sortedReleases[key] = changelog.releases[key];
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
    }
};

export { generateChangelog }