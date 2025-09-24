import nunjucks from 'nunjucks';

const printSummary = (stats, template) => {
  return nunjucks.render(template[0], stats);
};

const resolveURL = (basePath, snapshot) => {
  if (!basePath) return snapshot;
  let path = basePath + (basePath.endsWith('/') ? '' : '/') + snapshot;
  if (basePath.includes('github')) path += '?raw=true';
  return path.replace(/\\/g, '/');
};

function printFiles(files, basePath, template) {
  return nunjucks.render(template[1], {files, basePath});
}

export function print({stats, files, basePath, template}) {
  return `# Test Results
  ${printSummary(stats, template)}

  ---
  ${printFiles(files, basePath, template)}
`;
}
