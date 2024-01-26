import {ESLRandomText} from '@exadel/esl/modules/esl-random-text/core';
import {UIPPreprocessorService} from './preprocessor';

/**
 * Pre-processor services for JS content.
 * Rendering preprocessors applied to content before rendering and does not affect editor's content
 */
export const UIPJSRenderingPreprocessors = new UIPPreprocessorService();
/**
 * Pre-processor services for HTML content.
 * Rendering preprocessors applied to content before rendering and does not affect editor's content
 */
export const UIPHTMLRenderingPreprocessors = new UIPPreprocessorService();

// Register default pre-processors

UIPHTMLRenderingPreprocessors.addRegexReplacer('text', /<!--\s*text\s*x?(\d+)?\s*-->/g, (term, count) => {
  const length = count ? parseInt(count, 10) : 10;
  return ESLRandomText.generateText(length);
});

UIPHTMLRenderingPreprocessors.addRegexReplacer('text-html', /<!--\s*(text-html|paragraph)\s*x?(\d+)?\s*-->/g, (term, name, count) => {
  const length = count ? parseInt(count, 10) : 100;
  return ESLRandomText.generateTextHTML(100 * length);
});
