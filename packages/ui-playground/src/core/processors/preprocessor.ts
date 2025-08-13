/** Pre-processor function, called to process content */
export type UIPTransformer = (input: string) => string;

/** Rendering pre-processor service, that stores collection of {@link UIPRenderingPreprocessor}s */
export class UIPPreprocessorService {
  /** Pre-processor storage */
  protected preprocessors: Record<string, UIPTransformer> = {};

  /** Add pre-processor {@link UIPRenderingPreprocessor} */
  public add(name: string, preprocessor: UIPTransformer): void {
    this.preprocessors[name] = preprocessor;
  }

  /** Add pre-processor alias */
  public addAlias(name: string, alias: string): void {
    this.preprocessors[name] = this.preprocessors[alias];
  }

  /** Add pre-processor with RegExp replacer */
  public addRegexReplacer(name: string, regex: RegExp, replaceValue: string): void;
  /** Add pre-processor with RegExp replacer */
  public addRegexReplacer(name: string, regex: RegExp, replacer: (substring: string, ...args: any[]) => string): void;
  public addRegexReplacer(name: string, regex: RegExp, replacer: any): void {
    this.add(name, (input) => input.replace(regex, replacer));
  }

  public get(name: string): UIPTransformer | undefined {
    return this.preprocessors[name];
  }

  /** Pre-process html content */
  public preprocess(html: string): string {
    return Object.keys(this.preprocessors)
      .map((name) => this.preprocessors[name])
      .filter((preprocessor) => typeof preprocessor === 'function')
      .reduce((input, preprocessor) => preprocessor(input), html);
  }

  /** Clear all pre-processors */
  public clear(): void {
    this.preprocessors = {};
  }
}
