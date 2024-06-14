import path from 'path';
import fs from 'fs';
import sharp from 'sharp';
import looksSame from 'looks-same';

export type SnapshotMatcherOptions = looksSame.LooksSameOptions;

type SnapshotMatcherOptionsDiff = SnapshotMatcherOptions & {createDiffImage: true};

class SnapshotMatcher {
  protected static readonly DIFF_DIR = path.join(process.cwd(), '.diff');
  protected static readonly SNAPSHOT_DIR = path.join(process.cwd(), 'tests', '__image_snapshots__');

  protected static readonly defaultOptions: SnapshotMatcherOptionsDiff = {
    createDiffImage: true,
    ignoreAntialiasing: true,
    ignoreCaret: true,
  };

  protected config: SnapshotMatcherOptionsDiff;
  protected testName: string;
  protected currentImg: sharp.Sharp;

  constructor(context: jest.MatcherContext, received: Buffer, options: SnapshotMatcherOptions = {}) {
    this.testName = context.currentTestName!.replace(/([^a-z0-9]+)/gi, '-').toLowerCase();
    this.config = Object.assign({}, options, SnapshotMatcher.defaultOptions);
    this.currentImg = sharp(received).webp();
  }

  public async match(): Promise<jest.CustomMatcherResult> {
    this.updateDirectory(SnapshotMatcher.SNAPSHOT_DIR);
    const prevImgPath = path.join(SnapshotMatcher.SNAPSHOT_DIR, `${this.testName}.webp`);
    if (!fs.existsSync(prevImgPath)) {
      await this.currentImg.toFile(prevImgPath);
      return this.getMatcherResult(true, `New snapshot was created: ${prevImgPath}`);
    }

    const {equal, diffImage} = await looksSame(prevImgPath, await this.currentImg.toBuffer(), this.config);
    if (!equal) {
      const diffPath = await this.saveDiff(diffImage);
      return this.getMatcherResult(false, `Image mismatch found: ${diffPath}`);
    }

    return this.getMatcherResult(true, `Image is the same as the snapshot: ${prevImgPath}`);
  }

  protected updateDirectory(dirPath: string): void {
    if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, {recursive: true});
  }

  protected getMatcherResult(pass: boolean, message: string): jest.CustomMatcherResult {
    return {pass, message: () => message};
  }

  protected async saveDiff(diffImage: looksSame.DiffImage): Promise<string> {
    this.updateDirectory(SnapshotMatcher.DIFF_DIR);
    const diffPath = path.join(SnapshotMatcher.DIFF_DIR, `${this.testName}-diff.webp`);
    await diffImage.save(diffPath);
    return diffPath;
  }
}

expect.extend({async toMatchImageSnapshot(received: Buffer, options: SnapshotMatcherOptions = {}) {
  return new SnapshotMatcher(this, received, options).match();
}});
