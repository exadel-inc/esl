import sharp from 'sharp';
import {SharpService} from './sharp';

import type {SharpContext} from './sharp';

type DiffBuilderConfig = {
  diffPath: string;
  img1: SharpContext;
  img2: SharpContext;
  diffBuffer: Buffer;
};

export class DiffImageComposer {

  protected imgInfo: {width: number, height: number};

  constructor(protected config: DiffBuilderConfig) {
    this.imgInfo = this.config.img1.info;
  }

  public async save(): Promise<void> {
    const {diffPath, img1, img2, diffBuffer} = this.config;
    const {width, height} = this.imgInfo;

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
        {input: await SharpService.toJPEGBufferd(img1.data, rawOptions), left: 0, top: 0},
        {input: await SharpService.toJPEGBufferd(diffBuffer, rawOptions), left: width, top: 0},
        {input: await SharpService.toJPEGBufferd(img2.data, rawOptions), left: width * 2, top: 0}
      ])
      .jpeg()
      .toFile(diffPath);
  }
}
