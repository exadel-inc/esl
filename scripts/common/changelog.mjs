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

export function normalizeChangelog(changelog) {
  // Post-format: convert ## headers to # and adjust all other headers accordingly
  return changelog.replace(/^(#+)/gm, (match) => {
    return match.slice(1); // Remove one # from each header
  });
}
