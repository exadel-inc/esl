// Version heading regexp to match version sections - should match ## level headings only
const VERSION_HEADING_REGEXP = /(?=^##? )/gm;

export function extractReleaseNotes(changelog, version) {
  // Split changelog into versions
  const versions = changelog.split(VERSION_HEADING_REGEXP);

  const index = versions.findIndex(section => {
    const firstLine = section.split('\n')[0];
    return firstLine.includes(`[${version}]`) || firstLine.includes(`${version} (`);
  });

  if (index < 0 || index + 1 >= versions.length) {
    throw new Error(`No release notes found for version ${version}`);
  }

  // Extract the release notes for the specified version
  return versions[index].trim();
}

export function normalizeHeadings(changelog) {
  // Post-format: convert ## headers to # and adjust all other headers accordingly
  return changelog.replace(/^#(#+)/gm, (match) => {
    return match.slice(1); // Remove one # from each header
  });
}

export function prependProjectName(changelog, name) {
  // Prepend the project name into the version heading if it exists
  // For example, "# 1.0.0 (2023-10-01)" becomes "# name@1.0.0 (2023-10-01)"
  // Or "## 1.0.0-beta.1" becomes "## name@1.0.0-beta.1"
  // Updates first heading appearing in the changelog
  return changelog.replace(/^(#+\s)(.*)/m, (match, p1, p2) => {
    return `${p1}${name}@${p2}`;
  });
}

export function normalizeChangelog(changelog, name) {
  // Normalize the changelog by removing leading/trailing whitespace and ensuring proper formatting
  let normalized = changelog.trim();
  normalized = normalizeHeadings(normalized);
  normalized = name ? prependProjectName(normalized, name) : normalized;
  return normalized;
}
