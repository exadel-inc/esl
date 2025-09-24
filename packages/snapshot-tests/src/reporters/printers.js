import nunjucks from 'nunjucks';

const resolveURL = (basePath, snapshot) => {
  if (!basePath) return snapshot;
  let path = basePath + (basePath.endsWith('/') ? '' : '/') + snapshot;
  if (basePath.includes('github')) path += '?raw=true';
  return path.replace(/\\/g, '/');
};

const printSummary = (stats, template) => nunjucks.render(template, {stats});

const printFiles = (files, basePath, template) => nunjucks.render(template, {files, basePath});

export function print({stats, files, basePath, templates}) {
  const env = new nunjucks.Environment();
  env.addFilter('resolveURL', resolveURL);

  return `
  ${printSummary(stats, templates[0])}
  ${printFiles(files, basePath, templates[1])}
`;
}
