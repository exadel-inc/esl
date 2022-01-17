import type {ESLNote} from './esl-note';

export interface FootnotesItem {
  index: string[];
  renderedIndex: string[];
  text: string;
}

/** Converts notes list to footnotes items list */
function convertNotesToFootnotesList(notes: ESLNote[]): FootnotesItem[] {
  return notes.map(({index, renderedIndex, html}) => ({
    index: [`${index}`],
    renderedIndex: [renderedIndex],
    text: html
  }));
}

/** Compiles footnotes non-grouped list */
export function compileFootnotesNongroupedList(notes: ESLNote[]): FootnotesItem[] {
  return convertNotesToFootnotesList(notes.filter((note) => note.allowFootnotes));
}

/** Compiles footnotes grouped list */
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

/** Sorts notes list */
export function sortFootnotes(notes: ESLNote[]): ESLNote[] {
  return notes.sort((note1: ESLNote, note2: ESLNote): number => {
    if (note1 === note2) return 0;
    // eslint-disable-next-line no-bitwise
    if (note1.compareDocumentPosition(note2) & Node.DOCUMENT_POSITION_PRECEDING) {
      // note2 comes before note1
      return 1;
    }
    return -1;
  });
}
