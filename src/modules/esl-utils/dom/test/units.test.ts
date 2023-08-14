import {resolveCSSSize} from '../units';

describe('resolveCSSSize tests', () => {
  test('resolveCSSSize called with value \'25px\' should return 25', () => {
    const result = resolveCSSSize('25px');
    expect(result).toStrictEqual(25);
  });

  test('resolveCSSSize called with value \'25vw\' should return 25', () => {
    jest.spyOn(document.documentElement, 'clientWidth', 'get').mockImplementation(() => 100);
    const result = resolveCSSSize('25vw');
    expect(result).toStrictEqual(25);
  });

  test('resolveCSSSize called with value \'25vh\' should return 25', () => {
    jest.spyOn(document.documentElement, 'clientHeight', 'get').mockImplementation(() => 100);
    const result = resolveCSSSize('25vh');
    expect(result).toStrictEqual(25);
  });

  test('resolveCSSSize called with value \'25\' should return 25 as a number', () => {
    const result = resolveCSSSize('25');
    expect(result).toStrictEqual(25);
  });
});
