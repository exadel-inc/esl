import {withLineNumbers} from 'codejar/linenumbers';
import Prism from 'prismjs';
import 'prismjs/plugins/normalize-whitespace/prism-normalize-whitespace';

export function useLineNumbers(color: string = '#C9BFBF'): (editor: HTMLElement) => void {
  return Prism.highlightElement;
  // return withLineNumbers(Prism.highlightElement, {
  //   color,
  // });
}

/** Normalize lines indents. */
export function normalize(markup: string): string {
  return Prism.plugins.NormalizeWhitespace.normalize(markup);
}

/** Wrap long markup lines. */
export function wrapLines(markup: string, wrapThreshold?: number) : string {
  wrapThreshold = wrapThreshold ?? Infinity;
  const lines: string[] = [];

  for (const line of markup.split('\n')) {
    if (line.length < wrapThreshold) {
      lines.push(line);
    } else {
      for (let splitPos = 0; splitPos < line.length; splitPos += wrapThreshold) {
        lines.push(line.substring(splitPos, splitPos + wrapThreshold));
      }
    }
  }

  return lines.join('\n');
}

export interface EditorConfig {
  wrap: number;
}
