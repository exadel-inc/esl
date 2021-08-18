import type {ESLNote} from './esl-note';

export interface FootnotesItem {
  index: string;
  text: string;
}

/* Convert notes list to footnotes items list */
function convertNotesToFootnotesList(notes: ESLNote[]): FootnotesItem[] {
  return notes.map(({index, html}) => ({
    index: `${index}`,
    text: html
  }));
}

/* Compile footnotes non-grouped list */
export function compileFootnotesNongroupedList(notes: ESLNote[]): FootnotesItem[] {
  return convertNotesToFootnotesList(notes);
}

/* Compile footnotes grouped list */
export function compileFootnotesGroupedList(notes: ESLNote[]): FootnotesItem[] {
  const map = new Map();
  convertNotesToFootnotesList(notes).forEach(({index, text}) => {
    map.set(text, map.has(text) ? `${map.get(text)}, ${index}` : index);
  });
  const groupedList: FootnotesItem[] = [];
  map.forEach((index, text) => groupedList.push({index, text}));
  return groupedList;
}

/* Sort notes list */
export function sortFootnotes(notes: ESLNote[]): ESLNote[] {
  return notes.sort((note1: ESLNote, note2: ESLNote) => {
    const rect1 = note1.getBoundingClientRect();
    const rect2 = note2.getBoundingClientRect();
    return rect1.top - rect2.top || rect1.left - rect2.left;
});
}
