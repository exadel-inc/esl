import {ESLScreenBreakpoint, ESLMediaShortcuts} from '../core';

describe('ESLScreenBreakpoint tests', () => {
  test('Get all breakpoints (default)', () => {
    expect(new Set(ESLScreenBreakpoint.breakpointsNames))
      .toEqual(new Set(['xs', 'sm', 'md', 'lg', 'xl']));
  })

  test('add and get custom breakpoints tests', () => {
    expect(ESLScreenBreakpoint.add('SMALL', 300, 400)).toBeUndefined();
    expect(ESLScreenBreakpoint.for('SMALL')?.mediaQuery).toBe('(min-width: 300px) and (max-width: 400px)');
    expect(ESLScreenBreakpoint.for('SMALL')?.mediaQueryGE).toBe('(min-width: 300px)');
    expect(ESLScreenBreakpoint.for('SMALL')?.mediaQueryLE).toBe('(max-width: 400px)');
    expect(ESLScreenBreakpoint.add('Small', 400, 500)?.mediaQuery)
      .toBe('(min-width: 300px) and (max-width: 400px)');
    expect(ESLScreenBreakpoint.for('small')?.mediaQuery).toBe('(min-width: 400px) and (max-width: 500px)');
    ESLScreenBreakpoint.add('xs', 11, 22);
    expect(ESLScreenBreakpoint.for('xs')?.mediaQuery).toBe('(min-width: 11px) and (max-width: 22px)');
  });

  test('Get all breakpoints after adding custom', () => {
    expect(new Set(ESLScreenBreakpoint.breakpointsNames))
      .toEqual(new Set(['xs', 'sm', 'md', 'lg', 'xl', 'small']));
  })

  test('Error tests', () => {
    const testFn = ESLScreenBreakpoint.add;
    expect(() => testFn('небольшой', 200, 300)).toThrowError();
    expect(() => testFn('@XS', 200, 300)).toThrowError();
    expect(() => testFn('', 200, 300)).toThrowError();
    expect(() => testFn('234', 200, 300)).toThrowError();
    expect(() => testFn('XS2', 200, 300)).not.toThrowError();
    expect(ESLScreenBreakpoint.for('some')).toBeUndefined();
  });

  test.each([
    {query: '@md', queryString: '(min-width: 992px) and (max-width: 1199px)'},
    {
      query: '@lg, @sm',
      queryString: '(min-width: 1200px) and (max-width: 1599px), (min-width: 768px) and (max-width: 991px)'
    },
    {query: '@+sm,@-md', queryString: '(min-width: 768px),(max-width: 1199px)'},
    {query: '@mobile', queryString: 'not all'},
    {query: '', queryString: ''},
    {query: '@MOBILE', queryString: 'not all'},
    {query: '@XL', queryString: '(min-width: 1600px) and (max-width: 999999px)'},
    {query: '@small', queryString: '(min-width: 400px) and (max-width: 500px)'},
    {query: '@+small', queryString: '(min-width: 400px)'},
    {query: '@-small', queryString: '(max-width: 500px)'},
    {query: '@Mobile, @xl', queryString: 'not all, (min-width: 1600px) and (max-width: 999999px)'},
    {query: '@Xl, @MOBILE', queryString: '(min-width: 1600px) and (max-width: 999999px), not all'}
  ])('Apply tests for %p breakpoint', ({query, queryString}) => {
    expect(ESLMediaShortcuts.replace(query)).toBe(queryString);
  })
});
