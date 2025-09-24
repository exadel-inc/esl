import nunjucks from 'nunjucks';

const printSummary = (stats, template) => {
  return nunjucks.render(template, {stats});
};

const resolveURL = (basePath, snapshot) => {
  if (!basePath) return snapshot;
  let path = basePath + (basePath.endsWith('/') ? '' : '/') + snapshot;
  if (basePath.includes('github')) path += '?raw=true';
  return path.replace(/\\/g, '/');
};

function printFiles(files, basePath, template) {
  const env = new nunjucks.Environment();
  env.addFilter('resolveURL', resolveURL);
  return nunjucks.render(template, {files, basePath});
}

export function print({stats, files, basePath, templates}) {
  return `
  ${printSummary(stats, templates[0])}
  ${printFiles(files, basePath, templates[1])}
`;
}
