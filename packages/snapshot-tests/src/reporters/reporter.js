import fs from 'fs';
import path from 'path';
import nunjucks from 'nunjucks';

import {buildSnapshotName, getDiffDir, getDirName} from '../utils/image-snapshot.name.js';
import {mkDir} from '../utils/directory.js';

const writeFileSafe = (filename, data) => {
  const dirname = path.dirname(filename);
  mkDir(dirname);
  fs.writeFileSync(filename, data);
};

export class SnapshotAwareReporter {
  constructor(globalConfig, options) {
    this._globalConfig = globalConfig;
    this._options = options;
    this._totalStartTime = performance.now();
  }

  get baseUrl() {
    if (!process.env.GITHUB_ACTIONS || !process.env.DIFF_REPORT_BRANCH || !this._options.outputPublishPath) return null;
    const serverUrl = process.env.GITHUB_SERVER_URL;
    const repository = process.env.GITHUB_REPOSITORY;
    const branch = process.env.DIFF_REPORT_BRANCH;
    return `${serverUrl}/${repository}/blob/${branch}/`;
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
    const {ancestorTitles, status, title, duration, fullName} = test;
    const filename = path.basename(testPath);
    const name = ancestorTitles.join(' > ');
    const statBase = {name, status, filename, title, time: duration};
    if (status === 'passed') return statBase;
    const snapshotName = buildSnapshotName(fullName, 'diff');
    const snapshotExists = fs.existsSync(path.join(getDiffDir(testPath), snapshotName));
    return Object.assign(statBase, {
      message: test.failureMessages[0],
      messages: test.failureMessages,
      hasSnapshot: snapshotExists,
      dirPath: getDirName(testPath),
      snapshot: snapshotExists ? snapshotName : null
    });
  }

  buildTestResults(results) {
    const testResults = [];
    const basePath = path.resolve(this._globalConfig.rootDir);
    for (const result of results.testResults) {
      const filepath = path.relative(basePath, result.testFilePath);
      const tests = result.testResults.map((test) => this.buildTestStat(test, result.testFilePath));
      testResults.push({filepath, tests});
    }
    return testResults;
  }

  resolveSnapshot(test) {
    const {baseUrl} = this;
    const snapshot = `${test.dirPath}/${test.snapshot}`;
    if (!baseUrl) return snapshot;
    let path = baseUrl + (baseUrl.endsWith('/') ? '' : '/') + snapshot;
    if (baseUrl.includes('github')) path += '?raw=true';
    return path.replace(/\\/g, '/');
  }

  async onRunComplete(contexts, results) {
    const stats = this.buildStats(results);
    const files = this.buildTestResults(results);
    const resolveSnapshot = this.resolveSnapshot.bind(this);
    const content = nunjucks.render(this._options.templatePath, {stats, files, resolveSnapshot});
    writeFileSafe(this._options.outputPath, content);

    if (process.env.GITHUB_ACTIONS && process.env.DIFF_REPORT_BRANCH && this._options.outputPublishPath) {
      const contentDiffBranch = nunjucks.render(this._options.templatePath, {stats, files, resolveSnapshot});
      writeFileSafe(this._options.outputPublishPath, contentDiffBranch);
    }
  }
}

export default SnapshotAwareReporter;
