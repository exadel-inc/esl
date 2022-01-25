import {randUID, sequentialUID} from '../uid';

const TRY_COUNT = 5;

describe('misc/uid helper tests', () => {
  test('randUID', () => {
    const set = new Set();
    for (let i = 0; i < TRY_COUNT; ++i) {
      set.add(randUID());
    }
    expect(set.size).toBe(TRY_COUNT);
  });
  test('seqUID', () => {
    const set = new Set();
    for (let i = 0; i < TRY_COUNT; ++i) {
      set.add(sequentialUID('a'));
    }
    expect(set.size).toBe(TRY_COUNT);
    for (let i = 0; i < TRY_COUNT; ++i) {
      set.add(sequentialUID('b'));
    }
    expect(set.size).toBe(TRY_COUNT * 2);
  });
});
