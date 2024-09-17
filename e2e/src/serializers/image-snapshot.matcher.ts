import path from 'path';
import pixelmatch from 'pixelmatch';
import {mkDir} from '../utils/directory';
import {DiffImageComposer} from './image-snapshot.composer';

import type {SnapshotData} from './image-snapshot.pocessor';

export type SnapshotMatcherOptions = pixelmatch.PixelmatchOptions;

type ImagesCompareResult = {
  reason: 'content';
} | {
  reason: 'error';
  message: any;
} | undefined;

export class SnapshotMatcher {
  protected static readonly MIN_DIFF_THRESHOLD: number = 0.0001;

  protected static readonly defaultOptions: SnapshotMatcherOptions = {
    diffMask: false,
    alpha: 0,
    diffColorAlt: [255, 255, 0],
    includeAA: true,
    threshold: 0.01
  };

  protected config: SnapshotMatcherOptions;

  constructor(protected received: SnapshotData, options: SnapshotMatcherOptions = {}) {
    this.config = Object.assign({}, SnapshotMatcher.defaultOptions, options);
  }

  public async match(): Promise<jest.CustomMatcherResult> {
    const {current, previous, snapshotPath, diffPath} = this.received;
    if (!previous.buffer) {
      mkDir(path.dirname(snapshotPath));
      current.img.toFile(snapshotPath);
      return this.getMatcherResult(true, `New snapshot was created: ${snapshotPath}`);
    }

    const diff = await this.compareImages();
    if (!diff) return this.getMatcherResult(true, `Image is the same as the snapshot: ${snapshotPath}`);
    if (diff.reason === 'content') return this.getMatcherResult(false, `Image mismatch found: ${diffPath}`);
    return this.getMatcherResult(false, `Error comparing snapshot to image ${snapshotPath}\nMessage: ${diff.message}`);
  }

  protected getMatcherResult(pass: boolean, message: string): jest.CustomMatcherResult {
    return {pass, message: () => message};
  }

  protected async compareImages(): Promise<ImagesCompareResult> {
    const {current, previous, diffPath} = this.received;
    const prevBuffer = previous.buffer!;
    const currBuffer = current.buffer;

    const {width, height} = prevBuffer.info;
    const diffBuffer = Buffer.alloc(width * height * 4);
    try {
      const numDiffPixel = pixelmatch(prevBuffer.data, currBuffer.data, diffBuffer, width, height, this.config);
      if (numDiffPixel > width * height * SnapshotMatcher.MIN_DIFF_THRESHOLD) {
        const diffConfig = Object.assign({}, this.received, {diffBuffer});
        mkDir(path.dirname(diffPath));
        await (await DiffImageComposer.compose(diffConfig)).toFile(diffPath);
        return {reason: 'content'};
      }
    } catch (e) {
      return {reason: 'error', message: e};
    }
  }
}
