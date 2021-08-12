import type {ESLNote} from './esl-note';

export interface FootnotesItem {
  index: string;
  text: string;
}

/* convert notes list to footnotes items list */
function convertNotesToFootnotesList(notes: ESLNote[]): FootnotesItem[] {
  return notes.map(({index, html}) => ({
    index: `${index}`,
    text: html
  }));
}

/* compile footnotes non-grouped list */
export function compileFootnotesNongroupedList(notes: ESLNote[]): FootnotesItem[] {
  return convertNotesToFootnotesList(notes);
}

/* compile footnotes grouped list */
export function compileFootnotesGroupedList(notes: ESLNote[]): FootnotesItem[] {
  const map = new Map();
  convertNotesToFootnotesList(notes).forEach(({index, text}) => {
    map.set(text, map.has(text) ? `${map.get(text)}, ${index}` : index);
  });
  return Array.from(map)
    .reduce(
      (list,[text, index]) => [...list, {index, text}],
      []
    );
}
