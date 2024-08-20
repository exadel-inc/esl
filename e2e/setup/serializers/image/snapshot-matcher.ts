import path from 'path';
import fs from 'fs';
import sharp from 'sharp';
import pixelmatch from 'pixelmatch';

import {DiffImageComposer} from './diff-builder';

export type SnapshotMatcherOptions = pixelmatch.PixelmatchOptions;

export type SharpContext = {data: Buffer, info: sharp.OutputInfo};

export class SnapshotMatcher {
  protected static readonly DIFF_DIR = path.join(process.cwd(), '.diff');
  protected static readonly SNAPSHOT_DIR = path.join(process.cwd(), 'tests', '__image_snapshots__');
  protected static readonly MIN_DIFF_THRESHOLD: number = 0.0001;

  protected static readonly defaultOptions: SnapshotMatcherOptions = {
    diffMask: false,
    alpha: 0,
    diffColorAlt: [255, 255, 0],
    includeAA: true,
    threshold: 0.01
  };

  protected config: SnapshotMatcherOptions;
  protected testName: string;
  protected currentImg: sharp.Sharp;
  protected shouldUpdateImg: boolean;

  constructor(context: jest.MatcherContext, received: Buffer, options: SnapshotMatcherOptions = {}) {
    this.testName = context.currentTestName!.replace(/([^a-z0-9]+)/gi, '-').toLowerCase();
    this.config = Object.assign({}, SnapshotMatcher.defaultOptions, options);
    this.currentImg = sharp(received).webp();
    this.shouldUpdateImg = context.snapshotState._updateSnapshot === 'all';
  }

  public async match(): Promise<jest.CustomMatcherResult> {
    this.createDiffDir(SnapshotMatcher.SNAPSHOT_DIR);
    const prevImgPath = path.join(SnapshotMatcher.SNAPSHOT_DIR, `${this.testName}.webp`);
    if (!fs.existsSync(prevImgPath) || this.shouldUpdateImg) {
      await this.currentImg.toFile(prevImgPath);
      return this.getMatcherResult(true, `New snapshot was created: ${prevImgPath}`);
    }

    const prevImg = await SnapshotMatcher.toRawImage(prevImgPath);
    const currImg = await SnapshotMatcher.toRawImage(await this.currentImg.toBuffer());

    const diff = await this.compareImages(prevImg, currImg);
    if (!diff) return this.getMatcherResult(true, `Image is the same as the snapshot: ${prevImgPath}`);
    if (diff.reason === 'content') return this.getMatcherResult(false, `Image mismatch found: ${diff.path}`);
    return this.getMatcherResult(false, `Error comparing snapshot to image ${prevImgPath}`);
  }

  protected createDiffDir(dirPath: string): void {
    if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, {recursive: true});
  }

  protected getMatcherResult(pass: boolean, message: string): jest.CustomMatcherResult {
    return {pass, message: () => message};
  }

  protected static async toRawImage(input: string | Buffer): Promise<SharpContext> {
    return sharp(input).ensureAlpha().raw().toBuffer({resolveWithObject: true});
  }

  protected async compareImages(prevImg: SharpContext, currImg: SharpContext): Promise<{reason: 'content' | 'error', path?: string} | undefined> {
    const {width, height} = prevImg.info;
    const diffBuffer = Buffer.alloc(width * height * 4);
    try {
      const numDiffPixel = pixelmatch(prevImg.data, currImg.data, diffBuffer, width, height, this.config);
      if (numDiffPixel > width * height * SnapshotMatcher.MIN_DIFF_THRESHOLD) {
        return {reason: 'content', path: await this.saveDiff(prevImg, currImg, diffBuffer)};
      }
    } catch (e) {
      return {reason: 'error'};
    }
  }

  protected async saveDiff(img1: SharpContext, img2: SharpContext, diffBuffer: Buffer): Promise<string> {
    this.createDiffDir(SnapshotMatcher.DIFF_DIR);
    const diffPath = path.join(SnapshotMatcher.DIFF_DIR, `${this.testName}-diff.webp`);
    await new DiffImageComposer({diffPath, img1, img2, diffBuffer}).save();
    return diffPath;
  }
}
