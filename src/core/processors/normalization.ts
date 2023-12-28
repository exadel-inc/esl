/** Function to process html string for normalization*/
export type UIPNormalizationProcessor = (input: string) => string;

export class UIPHtmlNormalizationService {
  /** Processor storage */
  protected static processors: Record<string, UIPNormalizationProcessor> = {};

  /** Add processor function to normalization process */
  public static addProcessor(
    name: string,
    processor: UIPNormalizationProcessor
  ): void {
    UIPHtmlNormalizationService.processors[name] = processor;
  }

  /** Normalizes passes html string by running all registered processors in chain */
  public static normalize(html: string): string {
    return Object.keys(UIPHtmlNormalizationService.processors)
      .map((name) => UIPHtmlNormalizationService.processors[name])
      .filter((processor) => typeof processor === 'function')
      .reduce((input, processor) => processor(input), html);
  }
}

/** Removes extra indents */
UIPHtmlNormalizationService.addProcessor(
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
UIPHtmlNormalizationService.addProcessor('remove-trailing', (input: string) =>
  input.replace(/\s*?$/gm, '')
);
/** Remove beginning spaces */
UIPHtmlNormalizationService.addProcessor('left-trim', (input: string) =>
  input.replace(/^\s+/, '')
);
/** Remove ending spaces */
UIPHtmlNormalizationService.addProcessor('right-trim', (input: string) =>
  input.replace(/\s+$/, '')
);
