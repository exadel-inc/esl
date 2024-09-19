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

  public static async normalizeImages(img1: Buffer | string, img2: Buffer | string): Promise<[Buffer, Buffer]> {
    const imgCtx1 = sharp(img1);
    const imgCtx2 = sharp(img2);

    const metadata1 = await imgCtx1.metadata();
    const metadata2 = await imgCtx2.metadata();

    const targetWidth = Math.max(metadata1.width!, metadata2.width!);
    const targetHeight = Math.max(metadata1.height!, metadata2.height!);

    const padImage = async (
      image: sharp.Sharp,
      width: number,
      height: number,
      metadata: sharp.Metadata
    ): Promise<Buffer> => {
      const padX = Math.max(0, (width - metadata.width!) / 2);
      const padY = Math.max(0, (height - metadata.height!) / 2);

      return image.extend({
        top: Math.floor(padY),
        bottom: Math.ceil(padY),
        left: Math.floor(padX),
        right: Math.ceil(padX),
        background: {r: 255, g: 255, b: 255, alpha: 1}
      })
        .toBuffer();
    };

    const normalizedBuffer1 = await padImage(imgCtx1, targetWidth, targetHeight, metadata1);
    const normalizedBuffer2 = await padImage(imgCtx2, targetWidth, targetHeight, metadata2);
    return [normalizedBuffer1, normalizedBuffer2];
  }
}
