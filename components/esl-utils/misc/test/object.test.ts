import {deepCompare} from '../object';

describe('misc/object helper tests', () => {
  test('deepCompare simple tests', () => {
    expect(deepCompare({}, {})).toBeTruthy();
    expect(deepCompare({a: 1}, {a: 1})).toBeTruthy();
    expect(deepCompare({a: null}, {a: null})).toBeTruthy();
    expect(deepCompare({a: []}, {a: []})).toBeTruthy();
    expect(deepCompare({a: 1}, {b: 2})).toBeFalsy();
    expect(deepCompare({b: 1}, {b: 2})).toBeFalsy();
    expect(deepCompare({b: undefined}, {b: null})).toBeFalsy();
    expect(deepCompare({c: NaN}, {c: NaN})).toBeTruthy();
    expect(deepCompare({a: 1, c: Infinity}, {a: 1, c: Infinity})).toBeTruthy();
  });
  test('deepCompare array tests', () => {
    expect(deepCompare([], [])).toBeTruthy();
    expect(deepCompare([1], [1])).toBeTruthy();
    expect(deepCompare([1, 2, 3], [1, 2, 3])).toBeTruthy();
    expect(deepCompare([1], [1, 2])).toBeFalsy();
    expect(deepCompare([2, 1], [1, 2])).toBeFalsy();
    expect(deepCompare([{}, {}], [{}, {}])).toBeTruthy();
    expect(deepCompare([{a: 1}, {b: ''}], [{a: 1}, {b: ''}])).toBeTruthy();
  });
  test('deepCompare deep tests', () => {
    expect(deepCompare({a: {b: 1}}, {a: {b: 1}})).toBeTruthy();
    expect(deepCompare({a: {b: {c: 1}}}, {a: {b: {c: 1}}})).toBeTruthy();
    expect(deepCompare({a: {c: {b: 1}}}, {a: {b: {c: 1}}})).toBeFalsy();
    expect(deepCompare({a: {a: 1, b: 1}}, {a: {b: 1}})).toBeFalsy();
    expect(deepCompare({a: {b: 1}}, {a: {a: 1, b: 1}})).toBeFalsy();
  });
});
