import path from 'path';
import fs from 'fs';

import {mkDir} from './utils/directory';
import {SharpService} from './sharp';
import {DiffImageComposer} from './diff-builder';
import {toKebabCase} from './utils/string';

import type {SharpContext} from './sharp';
import type sharp from 'sharp';

export interface SnapshotData {
  snapshotPath: string;
  testName: string;

  current: {
    img: sharp.Sharp;
    buffer: SharpContext;
  };

  previous: {
    buffer: SharpContext | undefined;
  };
}

export class SnapshotDataProcessor {
  protected static readonly DIFF_DIR = path.join(process.cwd(), '.diff');
  protected static readonly SNAPSHOT_DIR = path.join(process.cwd(), 'tests', '__image_snapshots__');

  public static async process(context: jest.MatcherContext, received: Buffer): Promise<SnapshotData> {
    const {testPath, currentTestName} = context;
    mkDir(SnapshotDataProcessor.SNAPSHOT_DIR);
    const testName = toKebabCase(`${testPath!.split('/').pop()} ${currentTestName}`);
    const prevImgPath = path.join(SnapshotDataProcessor.SNAPSHOT_DIR, `${testName}.jpg`);
    const shouldUpdate = !fs.existsSync(prevImgPath) || context.snapshotState._updateSnapshot === 'all';

    const recievedJPG = SharpService.toJPEG(received);
    return {
      testName,
      snapshotPath: prevImgPath,

      current: {
        img: recievedJPG,
        buffer: await (SharpService.toRawBuffered(await recievedJPG.toBuffer()))
      },

      previous: {
        buffer: shouldUpdate ? undefined : await (SharpService.toRawBuffered(prevImgPath))
      }
    };
  }

  public static async saveDiff(list: SnapshotData, diffBuffer: Buffer): Promise<string | undefined> {
    const {current, previous} = list;
    mkDir(SnapshotDataProcessor.DIFF_DIR);
    const diffPath = path.join(SnapshotDataProcessor.DIFF_DIR, `${list.testName}-diff.jpg`);
    await new DiffImageComposer({diffPath, img1: previous.buffer!, img2: current.buffer, diffBuffer}).save();
    return diffPath;
  }
}
