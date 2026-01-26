import {resolveCSSSize} from '../units';
import type {CSSSize} from '../units';

describe('resolveCSSSize tests', () => {
  test('resolveCSSSize called with value \'25px\' should return 25', () => {
    const result = resolveCSSSize('25px');
    expect(result).toStrictEqual(25);
  });

  test('resolveCSSSize called with value \'25vw\' should return 25', () => {
    vi.spyOn(document.documentElement, 'clientWidth', 'get').mockImplementation(() => 100);
    const result = resolveCSSSize('25vw');
    expect(result).toStrictEqual(25);
  });

  test('resolveCSSSize called with value \'25vh\' should return 25', () => {
    vi.spyOn(document.documentElement, 'clientHeight', 'get').mockImplementation(() => 100);
    const result = resolveCSSSize('25vh');
    expect(result).toStrictEqual(25);
  });

  test('resolveCSSSize called with value \'25\' should return 25 as a number', () => {
    const result = resolveCSSSize('25');
    expect(result).toStrictEqual(25);
  });

  test('resolveCSSSize called with value \'undefined\' should return null', () => {
    const result = resolveCSSSize(('undefined' as CSSSize));
    expect(result).toStrictEqual(null);
  });

  test('resolveCSSSize called with value \'.5vw\' should return 1 (rounded value)', () => {
    vi.spyOn(document.documentElement, 'clientWidth', 'get').mockImplementation(() => 100);
    const result = resolveCSSSize('.5vw');
    expect(result).toStrictEqual(1);
  });
});
