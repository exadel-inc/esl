import sharp from 'sharp';
import {SharpService} from './image-snapshot.sharp';

import type {SnapshotData} from './image-snapshot.pocessor';

interface DiffBuilderConfig extends SnapshotData {
  diffBuffer: Buffer;
}

export class DiffImageComposer {

  public static async compose(config: DiffBuilderConfig): Promise<sharp.Sharp> {
    const {diffBuffer, previous, current} = config;
    const {width, height} = previous.buffer!.info;

    const rawOptions = {raw: {width, height, channels: 4}};
    return sharp({
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
      .jpeg();
  }
}
