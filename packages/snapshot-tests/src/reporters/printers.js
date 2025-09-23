import nunjucks from 'nunjucks';

const printSummary = (stats) => {
  let text = '\n';

  text += '| :clock10: Start time | :hourglass: Duration |\n';
  text += '| --- | ---: |\n';
  text += `|${stats.startTimeStr}|${stats.totalTimeStr}|\n`;
  text += '\n';

  text += '| | :white_check_mark: Passed | :x: Failed | :construction: Todo | :white_circle: Total |\n';
  text += '| --- | ---: | ---: | ---:| ---: |\n';
  text += `|Test Suites|${stats.numPassedTestSuites}|${stats.numFailedTestSuites}|-|${stats.numTotalTestSuites}|\n`;
  text += `|Tests|${stats.numPassedTests}|${stats.numFailedTests}|${stats.numTodoTests}|${stats.numTotalTests}|\n`;
  text += '\n';

  return text;
};

const resolveURL = (basePath, snapshot) => {
  if (!basePath) return snapshot;
  let path = basePath + (basePath.endsWith('/') ? '' : '/') + snapshot;
  if (basePath.includes('github')) path += '?raw=true';
  return path.replace(/\\/g, '/');
};

function printFiles(files, basePath, template) {
  console.log(files);
  return nunjucks.render(template, {files, basePath});
}

export function print({stats, files, basePath, template}) {
  return `# Test Results
  ## Summary
  ${printSummary(stats)}

  ---
  ${printFiles(files, basePath, template)}
`;
}
