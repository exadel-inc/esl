import {splitEvents} from '../core/listener';

describe('ESLEventListener: splitEvents sub-utility tests', () => {
  test(
    'Empty string parsed to an empty array without exceptions',
    () => expect(splitEvents('')).toEqual([])
  );
  test(
    'Single event string parsed to single event',
    () => expect(splitEvents('abc')).toEqual(['abc'])
  );
  test(
    'Single event string with extra spaces parsed to single event',
    () => expect(splitEvents('  abc ')).toEqual(['abc'])
  );
  test(
    'Multiple events string parsed to separate events',
    () => expect(splitEvents('abc de f')).toEqual(['abc', 'de', 'f'])
  );
  test(
    'Multiple events string with extra spaces parsed to separate events',
    () => expect(splitEvents(' a b')).toEqual(['a', 'b'])
  );
  test(
    'The same events count ones when parsed (two unique terms)',
    () => expect(splitEvents(' a a b')).toEqual(['a', 'b'])
  );
  test(
    'The same events count ones when parsed (one unique term)',
    () => expect(splitEvents('a a a a a')).toEqual(['a'])
  );
});
