import sharp from 'sharp';
import type {SharpContext} from './snapshot-matcher';

type DiffBuilderConfig = {
  diffPath: string;
  img1: SharpContext;
  img2: SharpContext;
  diffBuffer: Buffer;
};

export class DiffBuilder {

  protected imgInfo: {width: number, height: number};

  constructor(protected config: DiffBuilderConfig) {
    this.imgInfo = this.config.img1.info;
  }

  public async build(): Promise<void> {
    const {diffPath, img1, img2, diffBuffer} = this.config;
    const {width, height} = this.imgInfo;
    await sharp({
      create: {
        width: width * 3,
        height,
        channels: 4,
        background: {r: 0, g: 0, b: 0, alpha: 0}
      }
    })
      .composite([
        {input: await this.toWebp(img1.data), left: 0, top: 0},
        {input: await this.toWebp(diffBuffer), left: width, top: 0},
        {input: await this.toWebp(img2.data), left: width * 2, top: 0}
      ])
      .webp()
      .toFile(diffPath);
  }

  protected toWebp(buffer: Buffer): Promise<Buffer> {
    const {height, width} = this.imgInfo;
    return sharp(buffer, {raw: {width, height, channels: 4}}).webp().toBuffer();
  }
}
