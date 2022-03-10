import {deepMerge} from '../merge';

describe('misc/object: deepMerge', () => {
  test.each([
    [{}, {}, {}],
    [{a: [1]}, {a: 1}, {a: 1}],
    [{a: 1}, {b: 2}, {c: 3}, {d: 4}, {a: 1, b: 2, c: 3, d: 4}],
    [{a: 1}, {a: ['2']}, {a: ['2']}],
    [[1, 2], [3], [3, 2]],
    [{a: 1, b: 1}, {a: 2, c: 2}, {a: 2, b: 1, c: 2}],
    [{a: {a: 1, b: 1}, b: 1}, {a: {a: 3, c: 3}}, {a: {a: 3, b: 1, c: 3}, b: 1}],
    [{a: 1}, {b: 2}, {c: 3}, {a: 1, b: 2, c: 3}],
    [{a: 'value', b: 'value'}, {a: null, b: ''}, {a: null, b: ''}],
    [{a: [1, 2, {a: 1, b: 1}]}, {a: [3, 4, {a: 2, b: 2}]}, {a: [3, 4, {a: 2, b: 2}]}]
  ])('basic cases %p %p %p', (...args: any[]) => {
    const result = args.pop();
    expect(deepMerge(...args)).toEqual(result);
  });

  test('merge array + object', () => {
    const res = deepMerge([1, 2], {a: 1});
    const exp: any = [1, 2];
    exp.a = 1;
    expect(res).toEqual(exp);
  });

  test('deep copy object', () => {
    const obj = {a: 1, b: {c: 2}};
    const copyObj = deepMerge(obj);

    expect(copyObj).not.toBe(obj);
    expect(copyObj).toEqual(obj);
    expect(copyObj.b).not.toBe(obj.b);
    expect(copyObj.b).toEqual(obj.b);
  });

  test('deep copy array', () => {
    const obj = [1, 2, {a: 1, b: 3}];
    const copyObj = deepMerge(obj);

    expect(copyObj).not.toBe(obj);
    expect(copyObj).toEqual(obj);
    expect(copyObj[2]).not.toBe(obj[2]);
    expect(copyObj[2]).toEqual(obj[2]);
  });

  test.each([
    [null, {}], // ?? minor
    [{}, undefined, {}],
    [{}, null, {}],
    [{}, 1, {}],
    [{}, 'Hi', {}],
  ])('edge case: %p %p %p', (...args: any[]) => {
    const result = args.pop();
    expect(deepMerge(...args)).toEqual(result);
  });
});
