---
name: release-notes-digest
description: Use this skill to read CHANGELOG.md, find the section related to the current/last release, and create a short news digest from it in a new file. Use it when after a release you are asked to prepare release notes, announce changes, provide an update digest, or a brief summary for the current version.
---

# ESL Release Notes

## Steps

1. **Go to CHANGELOG.md**
   Locate and open `CHANGELOG.md` in the project root.

2. **Select the entries for the latest release**
    - Identify the most recent release section — a major or minor version bump (ignore patch-only or unreleased/pre-release sections unless explicitly asked).
    - Determine the release version number from the changelog heading (or from `package.json` / the latest git tag if the changelog heading is ambiguous).
    - Only ask the user to confirm the version when there is ambiguity — e.g. the latest section is patch-only or pre-release, several candidate versions exist, or the changelog and `package.json` disagree. If the latest qualifying release is unambiguous, proceed without asking.
    - Extract only the changes listed under that release's section. If the target version has no dedicated changelog heading (e.g. a major release published only through a chain of beta sections), aggregate the relevant features, fixes, and breaking changes from all of that version's beta/pre-release sections instead.

3. **Highlight key changes**
   - Pull out the key changes from that section — new features, fixes, breaking changes — and group them by category.
   - Avoid duplicates: if a change is already listed under Breaking Changes, do not repeat it under Features (or any other category). Each change should appear in exactly one category — Breaking Changes takes priority.

4. **Write the summary**
    - Start with one sentence describing the overall changes and what area they affect.
    - Rewrite each item concisely, in plain language, dropping internal/technical details that aren't relevant to the end user. Keep the summary short, describe changes briefly as a bullet list, prioritizing user-facing impact.

5. **Save the result**
   - Create a new file using an available file-editing/creation tool. If no file-write tool is available in the current context, explicitly state that limitation before finishing, rather than silently completing the task.
   - Save the file at `packages/esl-website/views/blogs`, named `ESL v<version>.md` (using the version number identified in step 2), matching the naming convention of existing posts in that folder.
   - The file must start with frontmatter in the following structure:
```yaml
   ---
   layout: content
   name: ESL v<version>
   title: ESL v<version>
   tags: [news, blogs]
   order: <order>
   date: <YYYY-MM-DD>
   link: https://github.com/exadel-inc/esl/releases/tag/v<version>
   ---
```

- `<version>` — the release version identified in step 2 (e.g. `5.7.0`).
- `<order>` — check the existing files in `packages/esl-website/views/blogs` for their `order` value and set this to one more than the current highest value.
- `<YYYY-MM-DD>` — the release date (from the changelog entry or the git tag date; use today's date if neither is available).
- `link` — must point to the corresponding GitHub release tag.

After the frontmatter, insert the summary in the same general style as existing ESL blog entries.

## Notes
- Do not return the file contents as the final result instead of creating the file.
- Do not overwrite an existing file with the same name without confirmation — append a suffix or ask instead. If creating a suffixed file (e.g. `ESL v<version> (2).md`), also adjust its `name` and `title` frontmatter values so they don't collide with the original file's identifiers.
