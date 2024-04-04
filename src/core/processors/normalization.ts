import {UIPPreprocessorService} from './preprocessor';

/**
 * Normalization processors store for JS content.
 * Normalization transformation are used to normalize content before displaying or processing.
 */
export const UIPJSNormalizationPreprocessors = new UIPPreprocessorService();
/**
 * Normalization processors store for HTML content.
 * Normalization transformation are used to normalize content before displaying or processing.
 */
export const UIPHTMLNormalizationPreprocessors = new UIPPreprocessorService();
/**
 * Normalization processors store for Notes content (could be HTML).
 * Normalization transformation are used to normalize content before displaying or processing.
 */
export const UIPNoteNormalizationPreprocessors = new UIPPreprocessorService();


/** Removes extra indents to beautify content alignment */
export function removeIndent(input: string): string {
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
UIPJSNormalizationPreprocessors.add('remove-leading-indent', removeIndent);
UIPHTMLNormalizationPreprocessors.add('remove-leading-indent', removeIndent);
UIPNoteNormalizationPreprocessors.add('remove-leading-indent', removeIndent);

/** Trim content */
UIPJSNormalizationPreprocessors.add('trim', (content: string) => content.trim());
UIPHTMLNormalizationPreprocessors.add('trim', (content: string) => content.trim());
UIPNoteNormalizationPreprocessors.add('trim', (content: string) => content.trim());

/** Removes extra spaces inside the content. Applicable for HTML only */
UIPHTMLNormalizationPreprocessors.addRegexReplacer('remove-trailing', /\s*?$/gm, ''); // TODO: possibly problem here
