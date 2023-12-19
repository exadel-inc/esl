import {ESLRandomText} from '@exadel/esl/modules/esl-random-text/core';

/** Rendering pre-processor function, called before rendering, does not affect the content in plugins */
export type UIPRenderingPreprocessor = (input: string) => string;

/** Rendering pre-processor service, that stores collection of {@link UIPRenderingPreprocessor}s */
export class UIPRenderingPreprocessorService {
  protected static preprocessors: Record<string, UIPRenderingPreprocessor> = {};

  /** Add pre-processor {@link UIPRenderingPreprocessor} */
  public static addPreprocessor(name: string, preprocessor: UIPRenderingPreprocessor): void {
    UIPRenderingPreprocessorService.preprocessors[name] = preprocessor;
  }

  /** Add pre-processor with RegExp replacer */
  public static addRegexPreprocessor(name: string, regex: RegExp, replacer: Parameters<typeof String.prototype.replace>[1]): void {
    this.addPreprocessor(name, (input) => input.replace(regex, replacer));
  }

  /** Add pre-processor alias */
  public static addPreprocessorAlias(name: string, alias: string): void {
    UIPRenderingPreprocessorService.preprocessors[name] = UIPRenderingPreprocessorService.preprocessors[alias];
  }

  /** Pre-process html content */
  public static preprocess(html: string): string {
    return Object.keys(UIPRenderingPreprocessorService.preprocessors)
      .map((name) => UIPRenderingPreprocessorService.preprocessors[name])
      .filter((preprocessor) => typeof preprocessor === 'function')
      .reduce((input, preprocessor) => preprocessor(input), html);
  }

  /** Clear all pre-processors */
  public static clear(): void {
    UIPRenderingPreprocessorService.preprocessors = {};
  }
}

// Register default pre-processors
UIPRenderingPreprocessorService.addRegexPreprocessor('text', /<!--\s*text\s*x?(\d+)?\s*-->/g, (term, count) => {
  const length = count ? parseInt(count, 10) : 10;
  return ESLRandomText.generateText(length);
});

UIPRenderingPreprocessorService.addRegexPreprocessor('text-html', /<!--\s*(text-html|paragraph)\s*x?(\d+)?\s*-->/g, (term, name, count) => {
  const length = count ? parseInt(count, 10) : 100;
  return ESLRandomText.generateTextHTML(100 * length);
});
