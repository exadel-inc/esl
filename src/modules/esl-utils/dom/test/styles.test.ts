import {CSSUtil} from '../styles';

describe('CSSUtil tests', () => {
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

  test.each([
    [''], [' '], [null], [undefined]
  ])('add %p safe check', (val) => {
    const el = document.createElement('div');
    expect(el.classList.length).toBe(0);
    CSSUtil.addCls(el, val);
    expect(el.classList.length).toBe(0);
    CSSUtil.removeCls(el, val);
    expect(el.classList.length).toBe(0);
  });
});
