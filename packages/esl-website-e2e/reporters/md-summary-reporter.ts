import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import nunjucks from 'nunjucks';
import type {FullConfig, FullResult, Reporter, Suite, TestCase, TestResult} from '@playwright/test/reporter';

type Status = 'passed' | 'failed' | 'flaky' | 'skipped' | 'timedOut' | 'interrupted';

export interface MdSummaryReporterOptions {
  outputPath?: string;
  templatePath?: string;
  maxErrorLength?: number;
}

const writeFileSafe = (filename: string, data: string): void => {
  fs.mkdirSync(path.dirname(filename), {recursive: true});
  fs.writeFileSync(filename, data);
};

const fmtDuration = (ms: number): string => `${(ms / 1000).toFixed(2)}s`;

const shortError = (result: TestResult, maxLen: number): string | null => {
  const msg = result.error?.message ?? result.errors?.[0]?.message ?? result.error?.stack ?? result.errors?.[0]?.stack;
  if (!msg) return null;

  const oneLine = msg.replace(/\r/g, '').split('\n').find(Boolean) ?? msg;
  const trimmed = oneLine.trim();
  if (trimmed.length <= maxLen) return trimmed;
  return `${trimmed.slice(0, Math.max(0, maxLen - 1))}…`;
};

const escapeHtml = (s: string): string => s
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;');

export default class MdSummaryReporter implements Reporter {
  private readonly outputPath: string;
  private readonly templatePath: string;
  private readonly maxErrorLength: number;
  private readonly startTime = Date.now();
  private configDir = process.cwd();
  private readonly reporterDir = path.dirname(fileURLToPath(import.meta.url));

  private counts = {passed: 0, failed: 0, flaky: 0, skipped: 0};
  private tests: {title: string, status: Status, time: number, error?: string | null}[] = [];

  constructor(options: MdSummaryReporterOptions = {}) {
    this.outputPath = options.outputPath ?? './playwright-report/summary.md';
    this.templatePath = options.templatePath ?? './md-summary.njk';
    this.maxErrorLength = options.maxErrorLength ?? 200;
  }

  onBegin(config: FullConfig, _suite: Suite): void {
    // Where Playwright config lives; this aligns with where built-in reporters write output.
    this.configDir = config.configFile ? path.dirname(config.configFile) : process.cwd();

    // Template lives next to reporter, keep it dead-simple and stable.
    nunjucks.configure(this.reporterDir, {autoescape: false});
  }

  onTestEnd(test: TestCase, result: TestResult): void {
    const outcome = test.outcome();

    const status: Status =
      outcome === 'skipped' ? 'skipped' :
        outcome === 'flaky' ? 'flaky' :
          outcome === 'unexpected' ? 'failed' :
            (result.status as Status) ?? 'passed';

    if (status === 'passed') this.counts.passed++;
    else if (status === 'failed' || status === 'timedOut' || status === 'interrupted') this.counts.failed++;
    else if (status === 'flaky') this.counts.flaky++;
    else this.counts.skipped++;

    const title = test.titlePath().filter(Boolean).join(' > ');
    const err = status === 'failed' || status === 'timedOut'
      ? shortError(result, this.maxErrorLength)
      : null;

    this.tests.push({
      title: escapeHtml(title),
      status,
      time: result.duration,
      error: err ? escapeHtml(err) : ''
    });
  }

  async onEnd(_result: FullResult): Promise<void> {
    const totalTimeStr = fmtDuration(Date.now() - this.startTime);
    const stats = {
      ...this.counts,
      totalTimeStr
    };

    const templateName = path.basename(this.templatePath);
    const content = nunjucks.render(templateName, {
      stats,
      tests: this.tests
    });

    const outFile = path.isAbsolute(this.outputPath) ? this.outputPath : path.resolve(this.configDir, this.outputPath);
    writeFileSafe(outFile, content);
  }
}
