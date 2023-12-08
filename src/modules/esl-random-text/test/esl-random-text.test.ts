import {ESLRandomText} from '../core/esl-random-text';

describe('ESLRandomText', () => {
  const normalizeWord = (word: string) => word.toLowerCase().replace(/[.,]/g, '');

  describe('ESLRandomText.generateText', () => {
    test('generates text with specified number of words', () => {
      const text = ESLRandomText.generateText(10);
      expect(text.split(' ').length).toBe(10);
    });

    test('generates text with specified number of words (in a shuffle case)', () => {
      const text = ESLRandomText.generateText(10, true);
      expect(text.split(' ').length).toBe(10);
    });

    test('generated text consist of words from dictionary', () => {
      const text = ESLRandomText.generateText(10);
      const words = text.split(' ').map(normalizeWord);
      words.forEach((word) => expect(ESLRandomText.DICTIONARY).toContain(word));
    });

    test('generated text without shuffling is sequential', () => {
      const text = ESLRandomText.generateText(10);
      const words = text.split(' ');
      words.forEach((word, index) => expect(normalizeWord(word)).toBe(ESLRandomText.DICTIONARY[index]));
    });

    test('generated text with shuffling returns different results', () => {
      const text1 = ESLRandomText.generateText(100, true);
      const text2 = ESLRandomText.generateText(100, true);
      expect(text1).not.toBe(text2);
    });
  });

  describe('ESLRandomText.generateTextHTML', () => {
    test('generates text with specified number of words', () => {
      const dom = ESLRandomText.generateTextHTML(10);
      const text = dom.replace(/<[^>]+>/g, '');
      expect(text.split(' ').length).toBe(10);
    });

    test('generates text with specified number of words (in a shuffle case)', () => {
      const dom = ESLRandomText.generateTextHTML(10, 10, true);
      const text = dom.replace(/<[^>]+>/g, '');
      expect(text.split(' ').length).toBe(10);
    });

    test('generated text consist of words from dictionary', () => {
      const dom = ESLRandomText.generateTextHTML(10);
      const words = dom.replace(/<[^>]+>/g, '').split(' ').map(normalizeWord);
      words.forEach((word) => expect(ESLRandomText.DICTIONARY).toContain(word));
    });

    test('generated text is a valid HTML (RichText)', () => {
      const dom = ESLRandomText.generateTextHTML(10);
      expect(dom).toMatch(/^<p>([^<]+)<\/p>$/);
    });

    test('generated text respects words per paragraph limit', () => {
      const dom = ESLRandomText.generateTextHTML(10, 5);
      expect(dom).toMatch(/^<p>([^<]+)<\/p><p>([^<]+)<\/p>$/);
    });
  });

  describe('ESLRandomText custom element', () => {
    beforeAll(() => ESLRandomText.register());

    beforeEach(() => document.body.innerHTML = '');

    test('generates one paragraph by default', () => {
      const dom = document.createElement('esl-random-text');
      document.body.appendChild(dom);
      expect(dom.innerHTML).toMatch(/^<p>([^<]+)<\/p>$/);
    });

    test('generates specified number of paragraphs', () => {
      const dom = document.createElement('esl-random-text');
      dom.setAttribute('paragraphs', '10');
      document.body.appendChild(dom);
      expect(dom.innerHTML).toMatch(/^<p>([^<]+)<\/p>(<p>([^<]+)<\/p>){9}$/);
    });

    test('supports float number of paragraphs', () => {
      const dom = document.createElement('esl-random-text');
      dom.setAttribute('paragraphs', '1.5');
      document.body.appendChild(dom);
      expect(dom.innerHTML).toMatch(/^<p>([^<]+)<\/p><p>([^<]+)<\/p>$/);
      const wordsCount = (dom.textContent || '').split(' ').length;
      expect(Math.abs(wordsCount - ESLRandomText.WORDS_PER_PARAGRAPH * 1.5)).toBeLessThan(2);
    });

    test('generates specified number of words in paragraph', () => {
      const dom = document.createElement('esl-random-text');
      dom.setAttribute('words-per-paragraph', '10');
      document.body.appendChild(dom);
      const text = dom.textContent || '';
      expect(text.split(' ').length).toBe(10);
    });

    test('supports shuffling', () => {
      const el1 = document.createElement('esl-random-text');
      el1.setAttribute('shuffle', 'true');
      document.body.appendChild(el1);
      const el2 = document.createElement('esl-random-text');
      el2.setAttribute('shuffle', 'false');
      document.body.appendChild(el2);

      const text1 = el1.textContent || '';
      const text2 = el2.textContent || '';
      expect(text1).not.toBe(text2);
    });
  });
});
