import sharp from 'sharp';

export type SharpContext = {data: Buffer, info: sharp.OutputInfo};

export class SharpService {
  public static toRaw(input: string | Buffer): sharp.Sharp {
    return sharp(input).ensureAlpha().raw();
  }

  public static toRawBuffered(input: string | Buffer): Promise<SharpContext> {
    return SharpService.toRaw(input).toBuffer({resolveWithObject: true});
  }

  public static toJPEG(input: string | Buffer, options: any = {}): sharp.Sharp {
    return sharp(input, options).jpeg({
      mozjpeg: true,
      quality: 75
    });
  }

  public static toJPEGBufferd(input: string | Buffer, options: any = {}): Promise<Buffer> {
    return SharpService.toJPEG(input, options).toBuffer();
  }
}
