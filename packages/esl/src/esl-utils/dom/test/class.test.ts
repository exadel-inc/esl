import {CSSClassUtils} from '../class';

describe('CSSClassUtils tests:', () => {
  test('styles: crud simple', () => {
    const el = document.createElement('div');

    expect(el.classList.length).toBe(0);
    CSSClassUtils.add(el, 'abc');
    expect(el.classList.contains('abc')).toBe(true);
    CSSClassUtils.remove(el, 'abc');
    expect(el.classList.contains('abc')).toBe(false);
    CSSClassUtils.toggle(el, 'abc', true);
    expect(el.classList.contains('abc')).toBe(true);
    CSSClassUtils.toggle(el, 'abc', false);
    expect(el.classList.contains('abc')).toBe(false);
  });

  test('styles: crud multiple', () => {
    const el = document.createElement('div');

    expect(el.classList.length).toBe(0);
    CSSClassUtils.add(el, 'a b');
    expect(el.classList.contains('a')).toBe(true);
    expect(el.classList.contains('b')).toBe(true);
    CSSClassUtils.remove(el, 'a b ');
    expect(el.classList.contains('a')).toBe(false);
    expect(el.classList.contains('b')).toBe(false);

    CSSClassUtils.add(el, 'a a');
    expect(el.classList.contains('a')).toBe(true);
    expect(el.classList.length).toBe(1);
    CSSClassUtils.remove(el, 'b c');
    expect(el.classList.contains('a')).toBe(true);
  });

  describe('class locks:', () => {
    const el = document.createElement('div');
    const lock1 = document.createElement('div');
    const lock2 = document.createElement('div');

    afterEach(() => el.className = '');

    test('lock case', () => {
      CSSClassUtils.add(el, 'a', lock1);
      expect(el.classList.contains('a')).toBeTruthy();
      CSSClassUtils.add(el, 'a', lock2);
      expect(el.classList.contains('a')).toBeTruthy();

      CSSClassUtils.remove(el, 'a', lock1);
      expect(el.classList.contains('a')).toBeTruthy();
      CSSClassUtils.remove(el, 'a', lock2);
      expect(el.classList.contains('a')).toBeFalsy();
    });

    test('double lock case', () => {
      CSSClassUtils.toggle(el, 'a', true, lock2);
      expect(el.classList.contains('a')).toBeTruthy();
      CSSClassUtils.toggle(el, 'a', true, lock2);
      expect(el.classList.contains('a')).toBeTruthy();

      CSSClassUtils.toggle(el, 'a', false, lock2);
      expect(el.classList.contains('a')).toBeFalsy();
    });

    test('unlock via force action', () => {
      CSSClassUtils.add(el, 'a', lock1);
      expect(el.classList.contains('a')).toBeTruthy();
      CSSClassUtils.add(el, 'a', lock2);
      expect(el.classList.contains('a')).toBeTruthy();

      CSSClassUtils.remove(el, 'a');
      expect(el.classList.contains('a')).toBeFalsy();
    });

    const payloadSet = (new Array(100))
      .fill('!a !b c !d !e !f !g !h !i !j !k !l !m !n !o !p !q !r !s !t !u !v !w !x !y !z')
      .join(' ');

    test('payload test case', () => {
      const start = performance.now();
      CSSClassUtils.remove(el, payloadSet, lock1);
      expect(el.classList.contains('a')).toBeTruthy();
      expect(el.classList.length).toBe(25);
      CSSClassUtils.add(el, payloadSet, lock1);
      expect(el.classList.contains('a')).toBeFalsy();
      expect(el.classList.length).toBe(1);
      const end = performance.now();
      expect(end - start).toBeLessThan(1000);
    }, 1000);
  });

  test('styles: has check', () => {
    const el = document.createElement('div');
    el.className = 'a b';
    expect(CSSClassUtils.has(el, 'a')).toBe(true);
    expect(CSSClassUtils.has(el, 'a b')).toBe(true);
    expect(CSSClassUtils.has(el, 'c')).toBe(false);
  });

  describe('reverse adding:', () => {
    test('add reverse', () => {
      const el = document.createElement('div');
      el.className = 'a b';
      CSSClassUtils.add(el, '!a');
      expect(el.classList.length).toBe(1);
      CSSClassUtils.add(el, '!b');
      expect(el.classList.length).toBe(0);
    });
    test('remove reverse', () => {
      const el = document.createElement('div');
      el.className = 'a b';
      CSSClassUtils.remove(el, '!a');
      expect(el.classList.contains('a')).toBeTruthy();
      CSSClassUtils.remove(el, '!b');
      expect(el.classList.contains('b')).toBeTruthy();
      expect(el.classList.length).toBe(2);
    });
    test('has reverse', () => {
      const el = document.createElement('div');
      el.className = 'a b';
      expect(CSSClassUtils.has(el, '!a')).toBe(false);
      expect(CSSClassUtils.has(el, '!c !d')).toBe(true);
    });
  });

  describe('edge cases:', () => {
    test.each([
      [''], [' '], [null], [undefined]
    ])('%p safe check', (val) => {
      const el = document.createElement('div');
      expect(el.classList.length).toBe(0);
      CSSClassUtils.add(el, val);
      expect(el.classList.length).toBe(0);
      CSSClassUtils.remove(el, val);
      expect(el.classList.length).toBe(0);
    });
  });
});

describe('multiple targets', () => {
  const els = [
    document.createElement('div'),
    document.createElement('div'),
    document.createElement('div')
  ];

  beforeEach(() => els.forEach((el) => el.className = ''));
  test('add', () => {
    CSSClassUtils.add(els, 'a b');
    for (const el of els) {
      expect(el.classList.contains('a')).toBeTruthy();
      expect(el.classList.contains('b')).toBeTruthy();
    }
    CSSClassUtils.add(els, '!a !b');
    for (const el of els) {
      expect(el.classList.contains('a')).toBeFalsy();
      expect(el.classList.contains('b')).toBeFalsy();
    }
  });
  test('remove', () => {
    CSSClassUtils.remove(els, '!a !b');
    for (const el of els) {
      expect(el.classList.contains('a')).toBeTruthy();
      expect(el.classList.contains('b')).toBeTruthy();
    }
    CSSClassUtils.remove(els, 'a b');
    for (const el of els) {
      expect(el.classList.contains('a')).toBeFalsy();
      expect(el.classList.contains('b')).toBeFalsy();
    }
  });
  test('has', () => {
    expect(CSSClassUtils.has(els, 'a')).toBe(false);
    CSSClassUtils.add(els, 'a');
    expect(CSSClassUtils.has(els, 'a')).toBe(true);
    CSSClassUtils.remove(els[0], 'a');
    expect(CSSClassUtils.has(els, 'a')).toBe(false);
  });
  test('trivial',  () => {
    expect(() => CSSClassUtils.add([], 'a')).not.toThrowError();
    expect(() => CSSClassUtils.remove([], 'a')).not.toThrowError();
  });
});
