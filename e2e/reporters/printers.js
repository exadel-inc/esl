const printSummary = (stats) => {
  let text = '\n';

  text += '| :clock10: Start time | :hourglass: Duration |\n';
  text += '| --- | ---: |\n';
  text += `|${stats.startTimeStr}|${stats.totalTimeStr}s|\n`;
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
  if (basePath.includes('github')) path+= '?raw=true';
  return path.replace(/\\/g, '/');
};

function printFiles(fileStat, basePath) {
  let text = '';
  for (const file of fileStat) {
    text += `### ${file.filepath}\n`;
    text += `<table>\n`;
    text += '<tr><th>Test</th><th>Status</th><th>Time</th></tr>\n';
    for (const test of file.tests) {
      const statusTest = test.status === 'passed' ? ':white_check_mark:' : ':x:';
      const timeStr = test.time < 1 ? `${test.time * 1000}ms` : `${test.time}s`;

      text += `<tr><td>${test.name}:${test.title}</td><td>${statusTest}</td><td>${timeStr}</td></tr>\n`;

      if (test.status !== 'passed' && test.hasSnapshot) {
        text += `<tr><td colspan="3"><img src="${resolveURL(basePath, test.snapshot)}" alt="Test Diff ${test.snapshot}"/></td></tr>`;
      }
      if (test.status !== 'passed' && !test.hasSnapshot) {
        text += `<tr><td colspan="3">\n`;
        text += '```text\n';
        text += test.messages.join('\n');
        text += '\n```\n';
        text += `</td></tr>\n`;
      }
    }
    text += `<table>\n`;
  }
  return text;
}

function print({stats, files, basePath}) {
  return `# Test Results
  ## Summary
  ${printSummary(stats)}

  ---
  ## Tests Details
  ${printFiles(files, basePath)}
`;
}

exports.print = print;
