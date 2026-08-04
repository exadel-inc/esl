# Release Node Utilities

This document describes the Node utilities used to inspect and automate Nx releases. Run all commands from the repository root after `npm ci`.

## Release model

[`nx.json`](../nx.json) is the source of truth. The release contract is:

> **one Nx release group → one git tag → one GitHub Release**

A group with several projects must be fixed and all its projects must have the same version. For example, the `website` group has one `esl-website@<version>` tag and one GitHub Release even though it contains three private projects.

## CI utilities

| Utility | CI workflow | Purpose |
|---|---|---|
| [`scripts/check-release-tags.mjs`](../scripts/check-release-tags.mjs) | [`release-pr.yml`](../.github/workflows/release-pr.yml) | Checks that every release group has a previous matching tag before Nx resolves versions from git tags. |
| [`scripts/get-changed-release-projects.mjs`](../scripts/get-changed-release-projects.mjs) | [`release-pr.yml`](../.github/workflows/release-pr.yml) | Detects groups changed by `nx release` and prepares the release PR title, summary, and changelog project list. |
| [`scripts/update-root-version.mjs`](../scripts/update-root-version.mjs) | [`release-pr.yml`](../.github/workflows/release-pr.yml) | Synchronizes the root package version with the greatest workspace package version. |
| [`scripts/get-changelog.mjs`](../scripts/get-changelog.mjs) | [`release-pr.yml`](../.github/workflows/release-pr.yml), [`release-github.yml`](../.github/workflows/release-github.yml) | Produces notes for selected projects or an entire release group. Fails if notes for any requested project are unavailable. |
| [`scripts/get-public-release-projects.mjs`](../scripts/get-public-release-projects.mjs) | [`release-github.yml`](../.github/workflows/release-github.yml) | Produces the one-entry-per-group JSON matrix used to create GitHub Releases. |
| [`scripts/get-dist-tag.mjs`](../scripts/get-dist-tag.mjs) | [`release-npm.yml`](../.github/workflows/release-npm.yml) | Resolves the npm dist-tag (`latest`, `beta`, `preview`, or `next`) for one public project or all public projects. |

The modules under [`scripts/common/`](../scripts/common/config.mjs) are implementation helpers, not CI entry points.

## Inspect release groups

Use the matrix utility as the primary release-structure check:

```commandline
node scripts/get-public-release-projects.mjs
```

Add `--pretty` for an indented, human-readable JSON output:

```commandline
node scripts/get-public-release-projects.mjs --pretty
```

It writes a JSON array with exactly one object per Nx release group. Its public output is deliberately limited to CI-facing fields:

| Field | Meaning |
|---|---|
| `groupName` | Nx release group key from `nx.json`. |
| `projectNames` | Projects included in the group. |
| `version` | Shared group version. |
| `releaseTag` / `releaseTagGlob` | Exact next/current tag and the pattern used to find an existing base tag. |
| `isPrerelease` | Whether the version contains a prerelease identifier. |
| `changelogProjects` | Comma-separated `project@version` list accepted by `get-changelog.mjs`. |
| `artifacts` | Comma-separated public tarball paths for the GitHub Release; empty for a private-only group. |

Intermediate project metadata and tarball filename calculations stay internal to [`scripts/common/release.mjs`](../scripts/common/release.mjs); they are intentionally not part of this JSON contract.

Check that all configured group tag patterns already have a remote base tag:

```commandline
node scripts/check-release-tags.mjs --remote origin
```

Use another reachable remote or local repository when needed:

```commandline
node scripts/check-release-tags.mjs --remote .
```

After `nx release` has changed manifests and changelogs, inspect the groups that will be described in the release PR:

```commandline
node scripts/get-changed-release-projects.mjs
```

The command reads the current working-tree `git diff`; run it before committing the version bump.

## Extract changelogs

`get-changelog.mjs` writes Markdown to stdout. Redirect it to a file when preparing notes manually.

### One project or module

The positional argument is an Nx project name. Add `@version` to read a specific section; without it, the current package version is used.

```commandline
node scripts/get-changelog.mjs esl
node scripts/get-changelog.mjs esl@6.3.0
```

### Several projects

Pass a comma-separated list. This is the format produced by `changelogProjects`.

```commandline
node scripts/get-changelog.mjs "esl@6.3.0,uip@6.3.0"
```

### One Nx release group

Use `--group` to include every project in a group, including private projects:

```commandline
node scripts/get-changelog.mjs --group website > RELEASE_NOTES.md
node scripts/get-changelog.mjs --group esl
```

### Whole release set

Without arguments, the utility emits notes for all public npm packages. Use `--all` to include every project in every Nx release group, including private website projects.

```commandline
node scripts/get-changelog.mjs
node scripts/get-changelog.mjs --all > RELEASE_NOTES.md
```

The command exits with a non-zero status if any requested project lacks a matching changelog section. This prevents creating a partial GitHub Release.

## Other local checks

```commandline
node scripts/get-version.mjs esl
npm run --silent get:disttag -- esl
npm run --silent get:disttag
npm run version:root
```

`version:root` changes `package.json` and `package-lock.json`; use it only after an Nx version bump.


