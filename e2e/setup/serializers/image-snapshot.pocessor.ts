import path from 'path';
import fs from 'fs';

import {getDiffDir, getSnapshotDir, buildSnapshotName} from '../../utils/image-snapshot.name';
import {SharpService} from './image-snapshot.sharp';

import type sharp from 'sharp';
import type {SharpContext} from './image-snapshot.sharp';

export interface SnapshotData {
  snapshotPath: string;
  diffPath: string;

  current: {
    img: sharp.Sharp;
    buffer: SharpContext;
  };

  previous: {
    buffer: SharpContext | undefined;
  };
}

export class SnapshotDataProcessor {
  public static async process(context: jest.MatcherContext, received: Buffer): Promise<SnapshotData> {
    const {testPath, currentTestName} = context;

    const snapshotDir = getSnapshotDir(testPath!);
    const diffDir = getDiffDir(testPath!);

    const snapshotPath = path.join(snapshotDir, buildSnapshotName(currentTestName!));
    const diffPath = path.join(diffDir, buildSnapshotName(currentTestName!, 'diff'));

    const shouldUpdate = !fs.existsSync(snapshotPath) || context.snapshotState._updateSnapshot === 'all';
    const recievedJPG = SharpService.toJPEG(received);
    return {
      diffPath,
      snapshotPath,

      current: {
        img: recievedJPG,
        buffer: await (SharpService.toRawBuffered(await recievedJPG.toBuffer()))
      },

      previous: {
        buffer: shouldUpdate ? undefined : await (SharpService.toRawBuffered(snapshotPath))
      }
    };
  }
}
