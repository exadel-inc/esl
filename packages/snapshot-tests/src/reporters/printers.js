import nunjucks from 'nunjucks';

const printSummary = (stats, template) => nunjucks.render(template, {stats});

const printFiles = (files, basePath, template) => nunjucks.render(template, {files, basePath});

export function print({stats, files, basePath, templates}) {
  return `
  ${printSummary(stats, templates[0])}
  ${printFiles(files, basePath, templates[1])}
`;
}
