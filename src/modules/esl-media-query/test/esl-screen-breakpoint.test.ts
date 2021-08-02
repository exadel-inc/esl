import {ESLScreenBreakpoints} from '../core';

describe('ESLScreenBreakpoint tests', () => {
  test('Get all breakpoints (default)', () => {
    expect(new Set(ESLScreenBreakpoints.names)).toEqual(new Set(['xs', 'sm', 'md', 'lg', 'xl']));
  });

  test('add and get custom breakpoints tests', () => {
    expect(ESLScreenBreakpoints.add('SMALL', 300, 400)).toBeUndefined();
    expect(ESLScreenBreakpoints.get('SMALL')?.mediaQuery).toBe('(min-width: 300px) and (max-width: 400px)');
    expect(ESLScreenBreakpoints.get('SMALL')?.mediaQueryGE).toBe('(min-width: 300px)');
    expect(ESLScreenBreakpoints.get('SMALL')?.mediaQueryLE).toBe('(max-width: 400px)');
    expect(ESLScreenBreakpoints.add('Small', 400, 500)?.mediaQuery)
      .toBe('(min-width: 300px) and (max-width: 400px)');
    expect(ESLScreenBreakpoints.get('small')?.mediaQuery).toBe('(min-width: 400px) and (max-width: 500px)');
    ESLScreenBreakpoints.add('xs', 11, 22);
    expect(ESLScreenBreakpoints.get('xs')?.mediaQuery).toBe('(min-width: 11px) and (max-width: 22px)');
  });

  test('Get all breakpoints after adding custom', () => {
    expect(new Set(ESLScreenBreakpoints.names))
      .toEqual(new Set(['xs', 'sm', 'md', 'lg', 'xl', 'small']));
  });

  test('Error tests', () => {
    const testFn = ESLScreenBreakpoints.add;
    expect(() => testFn('небольшой', 200, 300)).toThrowError();
    expect(() => testFn('@XS', 200, 300)).toThrowError();
    expect(() => testFn('', 200, 300)).toThrowError();
    expect(() => testFn('234', 200, 300)).toThrowError();
    expect(() => testFn('XS2', 200, 300)).not.toThrowError();
    expect(ESLScreenBreakpoints.get('some')).toBeUndefined();
  });
});
