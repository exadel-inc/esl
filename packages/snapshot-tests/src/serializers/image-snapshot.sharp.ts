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

  public static async normalize(...img: (string | Buffer)[]): Promise<Buffer[]> {
    const images = img.map((image) => sharp(image));
    const metadata = await Promise.all(images.map((image) => image.metadata()));

    const tWidth = Math.max(...metadata.map((m) => m.width));
    const tHeight = Math.max(...metadata.map((m) => m.height));

    return Promise.all(images.map((image, index) => image.extend({
      left: 0,
      right: Math.max(0, Math.ceil(tWidth - metadata[index].width)),
      top: 0,
      bottom: Math.max(0, Math.ceil(tHeight - metadata[index].height)),
      background: {r: 255, g: 255, b: 255, alpha: 1}
    }).toBuffer()));
  }
}
