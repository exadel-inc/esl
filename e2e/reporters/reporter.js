const fs = require('fs');
const path = require('path');

const {print} = require('./printers');

const sanitize = (str) => (str || '').replace(/\W+/g, '-').toLowerCase();

class SnapshotAwareReporter {
  constructor(globalConfig, options) {
    this._globalConfig = globalConfig;
    this._options = options;
    this._totalStartTime = performance.now();
  }

  buildStats(results) {
    const totalTime = Math.floor(performance.now() - this._totalStartTime);
    const startTimeStr = new Date(results.startTime).toLocaleString();
    const totalTimeStr = `${(totalTime / 1000).toFixed(2)}s`;

    return {
      numFailedTests: results.numFailedTests,
      numFailedTestSuites: results.numFailedTestSuites,
      numPassedTests: results.numPassedTests,
      numPassedTestSuites: results.numPassedTestSuites,
      numPendingTests: results.numPendingTests,
      numTodoTests: results.numTodoTests,
      numPendingTestSuites: results.numPendingTestSuites,
      numRuntimeErrorTestSuites: results.numRuntimeErrorTestSuites,
      numTotalTests: results.numTotalTests,
      numTotalTestSuites: results.numTotalTestSuites,
      startTime: results.startTime,
      startTimeStr,
      totalTime,
      totalTimeStr
    };
  }

  buildTestStat(test, testPath) {
    const { ancestorTitles, status, title, duration} = test;
    const filename = path.basename(testPath);
    const name = ancestorTitles.join(' > ');
    const statBase = {name, filename, status, title, time: duration};

    if (status === 'passed') return statBase;

    const snapshotParts = [filename, ...ancestorTitles, title, '1-snap', 'diff'];
    const snapshotName = snapshotParts.map(sanitize).join('-') + '.png'
    const snapshotPath = path.join(this._options.diffDir, snapshotName);
    const snapshotExists = fs.existsSync(snapshotPath);

    return Object.assign(statBase, {
      message: test.failureMessages[0],
      messages: test.failureMessages,
      hasSnapshot: snapshotExists,
      snapshot: snapshotExists ? snapshotName : null
    });
  }

  buildTestResults(results) {
    const testResults = [];
    const basePath = path.resolve(this._globalConfig.rootDir);
    for (const result of results.testResults) {
      const filepath = path.relative(basePath, result.testFilePath);
      const tests = result.testResults.map(test => this.buildTestStat(test, filepath));
      testResults.push({filepath, tests});
    }
    return testResults;
  }

  async onRunComplete(contexts, results) {
    const stats = this.buildStats(results);
    const files = this.buildTestResults(results);
    fs.writeFileSync(this._options.outputPath, print({stats, files, basePath: '.'}));

    if (process.env.GITHUB_ACTIONS && process.env.DIFF_REPORT_BRANCH && this._options.outputPublishPath) {
      const serverUrl = process.env.GITHUB_SERVER_URL;
      const repository = process.env.GITHUB_REPOSITORY;
      const branch = process.env.DIFF_REPORT_BRANCH;
      const basePath = `${serverUrl}/${repository}/blob/${branch}/`;
      fs.writeFileSync(this._options.outputPublishPath, print({stats, files, basePath}));
    }
  }
}

module.exports = SnapshotAwareReporter;
module.exports.default = SnapshotAwareReporter;
