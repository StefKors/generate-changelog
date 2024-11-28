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
	  --version 		Print current version
	  --help 				Print help message

	Examples:
        Generate from local repo:
        $ generate-changelog --write 

        Generate from remote repo:
        $ generate-changelog --owner="StefKors" --repo="generate-changelog" 
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
		}
	}
});

generateChangelog(cli.flags);