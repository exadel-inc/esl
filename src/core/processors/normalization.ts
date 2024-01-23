/** Function to process html string for normalization*/
export type UIPNormalizationProcessor = ((input: string) => string) & {
  htmlOnly?: boolean;
};

export class UIPNormalizationService {
  /** Processor storage */
  protected static processors: Record<string, UIPNormalizationProcessor> = {};

  /** Add processor function to normalization process */
  public static addProcessor(
    name: string,
    processor: UIPNormalizationProcessor,
    htmlOnly = false
  ): void {
    Object.assign(processor, {htmlOnly});
    UIPNormalizationService.processors[name] = processor;
  }

  /** Normalizes passes content string by running all registered processors in chain */
  public static normalize(content: string, isHtml = true): string {
    return Object.keys(UIPNormalizationService.processors)
      .map((name) => UIPNormalizationService.processors[name])
      .filter((processor) => typeof processor === 'function')
      .filter((processor) => !processor.htmlOnly || isHtml)
      .reduce((input, processor) => processor(input), content);
  }
}

/** Removes extra indents */
UIPNormalizationService.addProcessor(
  'remove-indent',
  (input: string): string => {
    // Get all indents from text
    const indents = input.match(/^[^\S\n\r]*(?=\S)/gm);
    // No processing if no indent on the first line or input is empty
    if (!indents || !indents[0].length) return input;
    // Sort indents by length
    indents.sort((a, b) => a.length - b.length);
    // No processing if minimal indent is 0
    if (!indents[0].length) return input;
    // Remove indents from text
    return input.replace(RegExp('^' + indents[0], 'gm'), '');
  }
);
/** Removes extra spaces */
// TODO: handle case with inline script with literal double spaces
UIPNormalizationService.addProcessor(
  'remove-trailing',
  (input: string) => input.replace(/\s*?$/gm, ''),
  true
);
/** Remove beginning spaces */
UIPNormalizationService.addProcessor('left-trim', (input: string) =>
  input.replace(/^\s+/, '')
);
/** Remove ending spaces */
UIPNormalizationService.addProcessor('right-trim', (input: string) =>
  input.replace(/\s+$/, '')
);
