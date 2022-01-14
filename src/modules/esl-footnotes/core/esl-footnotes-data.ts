import type {ESLNote} from './esl-note';

export interface FootnotesItem {
  index: string[];
  renderedIndex: string[];
  text: string;
}

/** Convert notes list to footnotes items list */
function convertNotesToFootnotesList(notes: ESLNote[]): FootnotesItem[] {
  return notes.map(({index, renderedIndex, html}) => ({
    index: [`${index}`],
    renderedIndex: [renderedIndex],
    text: html
  }));
}

/** Compile footnotes non-grouped list */
export function compileFootnotesNongroupedList(notes: ESLNote[]): FootnotesItem[] {
  return convertNotesToFootnotesList(notes.filter((note) => note.allowFootnotes));
}

/** Compile footnotes grouped list */
export function compileFootnotesGroupedList(notes: ESLNote[]): FootnotesItem[] {
  const map = new Map() ;
  convertNotesToFootnotesList(notes.filter((note) => note.allowFootnotes)).forEach((note) => {
    const {index, renderedIndex, text} = note;
    map.has(text) ? map.set(text, {
      index: [...map.get(text).index, ...index],
      renderedIndex: [...map.get(text).renderedIndex, ...renderedIndex],
      text
    }) : map.set(text, note);
  });
  const groupedList: FootnotesItem[] = [];
  map.forEach((note, text) => groupedList.push(note));
  return groupedList;
}

/** Sort notes list */
export function sortFootnotes(notes: ESLNote[]): ESLNote[] {
  return notes.sort((note1: ESLNote, note2: ESLNote) => {
    const rect1 = note1.getBoundingClientRect();
    const rect2 = note2.getBoundingClientRect();
    return rect1.top - rect2.top || rect1.left - rect2.left;
  });
}
