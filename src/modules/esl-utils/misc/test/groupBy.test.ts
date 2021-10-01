import {groupBy} from '../groupBy';

describe('misc/groupBy', () => {
  test('noop', () => {
    expect(groupBy([1, 2, 10, 4, 3], (i) => i % 2 > 0 ? 'odd' : 'even')).toStrictEqual( { odd: [1, 3], even: [2, 10, 4] });
    expect(groupBy(['cat', 'fat', 'kitten'], (s) => s.length)).toStrictEqual({ 3: ['cat', 'fat'], 6: ['kitten']});
    expect(groupBy([{ a: 2, b: 1 }, {}, {a: 1}, {}, {b: 2}], (s) => s['a'])).toStrictEqual( { 2: [{a: 2, b: 1}], undefined: [{}, {}, {b: 2}], 1: [{a: 1}] });
    expect(groupBy([100, 20, 10, 101, 300], (i) => String(i)[0] )).toStrictEqual( { '1': [100, 10, 101], '2': [20], '3': [300] });
    expect(groupBy([100, 20, 10, 101, 300], (i) => null )).toStrictEqual({null: [100, 20, 10, 101, 300]});
  });
});
