<p align="center">
<h1 align="center">generate-changelog</h1>
</p>

#### Supported Platforms
<img src="https://stefkors.com/api/platform/index.svg?os=terminal,web" />

Generate structured changelog JSON from git commit history. Works with local repos and remote GitHub repositories.

## Install

```bash
npm install @kors/generate-changelog
```

## Usage

### CLI

```bash
# Generate from local repo and write to changelog.json
npx @kors/generate-changelog --write

# Generate from a remote GitHub repo
npx @kors/generate-changelog --owner="StefKors" --repo="generate-changelog"

# Remote repo with a GitHub token (private repos, or to avoid unauthenticated rate limits)
GITHUB_TOKEN=ghp_xxx npx @kors/generate-changelog --owner="StefKors" --repo="my-private-repo"
# or pass the token explicitly
npx @kors/generate-changelog --owner="StefKors" --repo="my-private-repo" --token="ghp_xxx"
```

### Programmatic

```typescript
import { generateChangelog } from "@kors/generate-changelog"

const changelog = await generateChangelog({ write: true })
// or from a remote repo (optional githubToken for private repos / rate limits)
const remote = await generateChangelog({
  owner: "StefKors",
  repo: "generate-changelog",
  githubToken: process.env["GITHUB_TOKEN"],
})
```

## CLI Options

| Flag | Short | Description |
|------|-------|-------------|
| `--write` | `-w` | Write output to `changelog.json` |
| `--owner` | `-o` | GitHub repo owner (use with `--repo`) |
| `--repo` | `-r` | GitHub repo name (use with `--owner`) |
| `--token` | `-t` | GitHub token (optional; also reads `GITHUB_TOKEN` or `GH_TOKEN` if unset) |
| `--version` | | Print current version |
| `--help` | | Print help message |

## Output Format

```json
{
  "releases": {
    "1.2.0": [
      { "type": "Added", "message": "New feature description" },
      { "type": "Fixed", "message": "Bug fix description" }
    ],
    "1.1.0": [
      { "type": "Improved", "message": "Performance improvement" }
    ]
  }
}
```

Change types are auto-detected from commit messages: **Added**, **Fixed**, **Improved**, **Removed**.

## GitHub authentication

When using `--owner` and `--repo`, the GitHub REST API is called without a token by default. That works for public repositories but is subject to [lower rate limits](https://docs.github.com/en/rest/using-the-rest-api/rate-limits-for-the-rest-api). For **private** repositories, or to use authenticated rate limits, provide a token in either of these ways:

- **Environment variable:** set `GITHUB_TOKEN` (or `GH_TOKEN`) before running the CLI. The CLI reads `GITHUB_TOKEN` automatically.
- **CLI flag:** `--token` / `-t` overrides the environment when both are set.

Create a token under GitHub → Settings → Developer settings → Personal access tokens. The token needs read access to repository contents (for private repos, use a classic token with `repo` scope, or a fine-grained token with Contents read access).

## Features

- Parses git tags to group commits by version
- Auto-classifies changes by type from commit messages
- Filters out merge commits and version bumps
- Supports local git repos and remote GitHub repos via Octokit
- Outputs structured JSON for use in release notes, changelogs, or UIs

## License

MIT
