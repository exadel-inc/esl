import {CSSUtil} from '../styles';

describe('CSSUtil tests:', () => {
  test('styles: crud simple', () => {
    const el = document.createElement('div');

    expect(el.classList.length).toBe(0);
    CSSUtil.addCls(el, 'abc');
    expect(el.classList.contains('abc')).toBe(true);
    CSSUtil.removeCls(el, 'abc');
    expect(el.classList.contains('abc')).toBe(false);
    CSSUtil.toggleClsTo(el, 'abc', true);
    expect(el.classList.contains('abc')).toBe(true);
    CSSUtil.toggleClsTo(el, 'abc', false);
    expect(el.classList.contains('abc')).toBe(false);
  });

  test('styles: crud multiple', () => {
    const el = document.createElement('div');

    expect(el.classList.length).toBe(0);
    CSSUtil.addCls(el, 'a b');
    expect(el.classList.contains('a')).toBe(true);
    expect(el.classList.contains('b')).toBe(true);
    CSSUtil.removeCls(el, 'a b ');
    expect(el.classList.contains('a')).toBe(false);
    expect(el.classList.contains('b')).toBe(false);

    CSSUtil.addCls(el, 'a a');
    expect(el.classList.contains('a')).toBe(true);
    expect(el.classList.length).toBe(1);
    CSSUtil.removeCls(el, 'b c');
    expect(el.classList.contains('a')).toBe(true);
  });

  describe('class locks:', () => {

    const lock1 = document.createElement('div');
    const lock2 = document.createElement('div');

    test('lock case', () => {
      const el = document.createElement('div');

      CSSUtil.toggleClsTo(el, 'a', true, lock1);
      expect(el.classList.contains('a')).toBeTruthy();
      CSSUtil.toggleClsTo(el, 'a', true, lock2);
      expect(el.classList.contains('a')).toBeTruthy();

      CSSUtil.toggleClsTo(el, 'a', false, lock1);
      expect(el.classList.contains('a')).toBeTruthy();
      CSSUtil.toggleClsTo(el, 'a', false, lock2);
      expect(el.classList.contains('a')).toBeFalsy();
    });

    test('unlock via force action', () => {
      const el = document.createElement('div');

      CSSUtil.addCls(el, 'a', lock1);
      expect(el.classList.contains('a')).toBeTruthy();
      CSSUtil.addCls(el, 'a', lock2);
      expect(el.classList.contains('a')).toBeTruthy();

      CSSUtil.removeCls(el, 'a');
      expect(el.classList.contains('a')).toBeFalsy();
    });

    const payloadSet = (new Array(1000)).fill('!a').join(' ');
    test('payload test case', () => {
      const el = document.createElement('div');
      CSSUtil.removeCls(el, payloadSet, lock1);
      expect(el.classList.contains('a')).toBeTruthy();
      expect(el.classList.length).toBe(1);
      CSSUtil.addCls(el, payloadSet, lock1);
      expect(el.classList.contains('a')).toBeFalsy();
      expect(el.classList.length).toBe(0);
    }, 50);
  });

  describe('reverse adding:', () => {
    test('add reverse', () => {
      const el = document.createElement('div');
      el.className = 'a b';
      CSSUtil.add(el, '!a');
      expect(el.classList.length).toBe(1);
      CSSUtil.add(el, '!b');
      expect(el.classList.length).toBe(0);
    });
    test('remove reverse', () => {
      const el = document.createElement('div');
      el.className = 'a b';
      CSSUtil.remove(el, '!a');
      expect(el.classList.contains('a')).toBeTruthy();
      CSSUtil.remove(el, '!b');
      expect(el.classList.contains('b')).toBeTruthy();
      expect(el.classList.length).toBe(2);
    });
  });

  describe('edge cases:', () => {
    test.each([
      [''], [' '], [null], [undefined]
    ])('%p safe check', (val) => {
      const el = document.createElement('div');
      expect(el.classList.length).toBe(0);
      CSSUtil.addCls(el, val);
      expect(el.classList.length).toBe(0);
      CSSUtil.removeCls(el, val);
      expect(el.classList.length).toBe(0);
    });
  });
});
