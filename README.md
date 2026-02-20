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
```

### Programmatic

```typescript
import { generateChangelog } from "@kors/generate-changelog"

const changelog = await generateChangelog({ write: true })
// or from a remote repo
const changelog = await generateChangelog({ owner: "StefKors", repo: "generate-changelog" })
```

## CLI Options

| Flag | Short | Description |
|------|-------|-------------|
| `--write` | `-w` | Write output to `changelog.json` |
| `--owner` | `-o` | GitHub repo owner (use with `--repo`) |
| `--repo` | `-r` | GitHub repo name (use with `--owner`) |
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

## Features

- Parses git tags to group commits by version
- Auto-classifies changes by type from commit messages
- Filters out merge commits and version bumps
- Supports local git repos and remote GitHub repos via Octokit
- Outputs structured JSON for use in release notes, changelogs, or UIs

## License

MIT
