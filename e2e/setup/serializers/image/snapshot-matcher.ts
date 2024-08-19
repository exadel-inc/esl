import path from 'path';
import fs from 'fs';
import sharp from 'sharp';
import pixelmatch from 'pixelmatch';

import {DiffBuilder} from './diff-builder';

export type SnapshotMatcherOptions = pixelmatch.PixelmatchOptions;

export type SharpContext = {data: Buffer, info: sharp.OutputInfo};

export class SnapshotMatcher {
  protected static readonly DIFF_DIR = path.join(process.cwd(), '.diff');
  protected static readonly SNAPSHOT_DIR = path.join(process.cwd(), 'tests', '__image_snapshots__');

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
    this.updateDirectory(SnapshotMatcher.SNAPSHOT_DIR);
    const prevImgPath = path.join(SnapshotMatcher.SNAPSHOT_DIR, `${this.testName}.webp`);
    if (!fs.existsSync(prevImgPath) || this.shouldUpdateImg) {
      await this.currentImg.toFile(prevImgPath);
      return this.getMatcherResult(true, `New snapshot was created: ${prevImgPath}`);
    }

    const prevImg = await this.convertToRaw(prevImgPath);
    const currImg = await this.convertToRaw(await this.currentImg.toBuffer());

    let diffPath;
    try {
      diffPath = await this.compareImages(prevImg, currImg);
    } catch (error) {
      return this.getMatcherResult(false, `Error comparing snapshot to image ${prevImgPath}`);
    }

    if (diffPath) return this.getMatcherResult(false, `Image mismatch found: ${diffPath}`);
    return this.getMatcherResult(true, `Image is the same as the snapshot: ${prevImgPath}`);
  }

  protected updateDirectory(dirPath: string): void {
    if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, {recursive: true});
  }

  protected getMatcherResult(pass: boolean, message: string): jest.CustomMatcherResult {
    return {pass, message: () => message};
  }

  protected async convertToRaw(input: string | Buffer): Promise<SharpContext> {
    return sharp(input).ensureAlpha().raw().toBuffer({resolveWithObject: true});
  }

  protected async compareImages(prevImg: SharpContext, currImg: SharpContext): Promise<string | undefined> {
    let diffPath: string | undefined;
    const {width, height} = prevImg.info;
    const diffBuffer = Buffer.alloc(width * height * 4);
    const numDiffPixel = pixelmatch(prevImg.data, currImg.data, diffBuffer, width, height, this.config);
    if (numDiffPixel > width * height * 0.0001) diffPath = await this.saveDiff(prevImg, currImg, diffBuffer);
    return diffPath;
  }

  protected async saveDiff(img1: SharpContext, img2: SharpContext, diffBuffer: Buffer): Promise<string> {
    this.updateDirectory(SnapshotMatcher.DIFF_DIR);
    const diffPath = path.join(SnapshotMatcher.DIFF_DIR, `${this.testName}-diff.webp`);
    await new DiffBuilder({diffPath, img1, img2, diffBuffer}).build();
    return diffPath;
  }
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace jest {
    export interface Matchers<R> {
      toMatchImageSnapshot(options?: SnapshotMatcherOptions): Promise<R>;
    }
  }
}
