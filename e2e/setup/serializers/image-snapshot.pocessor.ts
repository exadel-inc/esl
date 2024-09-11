import path from 'path';
import fs from 'fs';
import sharp from 'sharp';

import {mkDir} from '../../utils/directory';
import {getDiffDir, getSnapshotDir, buildSnapshotName} from '../../utils/image-snapshot.name';
import {SharpService} from './image-snapshot.sharp';

import type {SharpContext} from './image-snapshot.sharp';

export interface SnapshotData {
  snapshotPath: string;
  diffPath: string;
  diffDir: string;

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
    mkDir(snapshotDir);

    const snapshotPath = path.join(snapshotDir, buildSnapshotName(currentTestName!));
    const diffPath = path.join(diffDir, buildSnapshotName(currentTestName!, 'diff'));

    const shouldUpdate = !fs.existsSync(snapshotPath) || context.snapshotState._updateSnapshot === 'all';
    const recievedJPG = SharpService.toJPEG(received);
    return {
      diffPath,
      snapshotPath,
      diffDir,

      current: {
        img: recievedJPG,
        buffer: await (SharpService.toRawBuffered(await recievedJPG.toBuffer()))
      },

      previous: {
        buffer: shouldUpdate ? undefined : await (SharpService.toRawBuffered(snapshotPath))
      }
    };
  }

  public static async saveDiffImage(data: SnapshotData, diffBuffer: Buffer): Promise<string | undefined> {
    const {current, previous, diffDir, diffPath} = data;
    const {width, height} = previous.buffer!.info;
    mkDir(diffDir);

    const rawOptions = {raw: {width, height, channels: 4}};
    await sharp({
      create: {
        width: width * 3,
        height,
        channels: 4,
        background: {r: 0, g: 0, b: 0, alpha: 0}
      }
    })
      .composite([
        {input: await SharpService.toJPEGBufferd(previous.buffer!.data, rawOptions), left: 0, top: 0},
        {input: await SharpService.toJPEGBufferd(diffBuffer, rawOptions), left: width, top: 0},
        {input: await SharpService.toJPEGBufferd(current.buffer.data, rawOptions), left: width * 2, top: 0}
      ])
      .jpeg()
      .toFile(diffPath);

    return diffPath;
  }
}
