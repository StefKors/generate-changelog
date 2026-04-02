#!/usr/bin/env node

import { generateChangelog } from "./lib/index.js";
import meow from 'meow'

const cli = meow(`
	Usage
	  $ generate-changelog <input>

	Options
	  --write, -w 	Write output to changelog.json
	  --owner, -o 	Fetch commits from github owner (used with --repo)
	  --repo, -r 		Fetch commit from github repo (used with --owner)
	  --token, -t 	GitHub token (or set GITHUB_TOKEN in the environment)
	  --version 		Print current version
	  --help 				Print help message

	Examples:
        Generate from local repo:
        $ generate-changelog --write 

        Generate from remote repo:
        $ generate-changelog --owner="StefKors" --repo="generate-changelog"

        With authentication (private repos or higher API rate limits):
        $ generate-changelog --owner="StefKors" --repo="generate-changelog" --token="$GITHUB_TOKEN"
`, {
	importMeta: import.meta,
	flags: {
		write: {
			type: 'boolean',
			shortFlag: 'w'
		},
        owner: {
            type: 'string',
            shortFlag: 'o'
        },
        repo: {
			type: 'string',
			shortFlag: 'r'
		},
        token: {
            type: 'string',
            shortFlag: 't'
        }
	}
});

generateChangelog({
    write: cli.flags.write,
    owner: cli.flags.owner,
    repo: cli.flags.repo,
    githubToken: cli.flags.token ?? process.env['GITHUB_TOKEN'] ?? process.env['GH_TOKEN'],
});