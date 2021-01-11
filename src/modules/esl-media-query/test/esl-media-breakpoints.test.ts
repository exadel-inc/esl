import ESLMediaBreakpoints from '../core/esl-media-breakpoints';

describe('esl breakpoints test', () => {
  test('Get all breakpoints', () => {
    expect(new Set(ESLMediaBreakpoints.getAllBreakpointsNames())).toEqual(new Set(['xs', 'sm', 'md', 'lg', 'xl']));
  })

  test('add and get custom breakpoints tests', () => {
    const getBp = ESLMediaBreakpoints.getBreakpoint;
    const addBp = ESLMediaBreakpoints.addCustomBreakpoint;
    expect(addBp('SMALL', 300, 400)).toBeUndefined();
    expect(getBp('SMALL').mediaQuery).toBe('(min-width: 300px) and (max-width: 400px)');
    expect(getBp('SMALL').mediaQueryGE).toBe('(min-width: 300px)');
    expect(getBp('SMALL').mediaQueryLE).toBe('(max-width: 400px)');
    expect(addBp('Small', 400, 500).mediaQuery).toBe('(min-width: 300px) and (max-width: 400px)');
    expect(getBp('small').mediaQuery).toBe('(min-width: 400px) and (max-width: 500px)');
    addBp('xs', 11, 22);
    expect(getBp('xs').mediaQuery).toBe('(min-width: 11px) and (max-width: 22px)');
  });

  test('Get all breakpoints after adding custom', () => {
    expect(new Set(ESLMediaBreakpoints.getAllBreakpointsNames())).toEqual(new Set(['xs', 'sm', 'md', 'lg', 'xl', 'small']));
  })

  test('Error tests', () => {
    const testFn = ESLMediaBreakpoints.addCustomBreakpoint;
    expect(() => testFn('небольшой', 200, 300)).toThrowError();
    expect(() => testFn('@XS', 200, 300)).toThrowError();
    expect(() => testFn('', 200, 300)).toThrowError();
    expect(() => testFn('234', 200, 300)).toThrowError();
    expect(() => testFn('XS2', 200, 300)).not.toThrowError();
    expect(ESLMediaBreakpoints.getBreakpoint('some')).toBeUndefined();
  });

  test.each([
    {query: '@md', queryString: '(min-width: 992px) and (max-width: 1199px)'},
    {
      query: '@lg, @sm',
      queryString: '(min-width: 1200px) and (max-width: 1599px), (min-width: 768px) and (max-width: 991px)'
    },
    {query: '@+sm,@-md', queryString: '(min-width: 768px),(max-width: 1199px)'},
    {query: '@mobile', queryString: '@mobile'},
    {query: '', queryString: ''},
    {query: '@MOBILE', queryString: '@MOBILE'},
    {query: '@XL', queryString: '(min-width: 1600px) and (max-width: 999999px)'},
    {query: '@small', queryString: '(min-width: 400px) and (max-width: 500px)'},
    {query: '@+small', queryString: '(min-width: 400px)'},
    {query: '@-small', queryString: '(max-width: 500px)'},
    {query: '@Mobile, @xl', queryString: '@Mobile, (min-width: 1600px) and (max-width: 999999px)'},
    {query: '@Xl, @MOBILE', queryString: '(min-width: 1600px) and (max-width: 999999px), @MOBILE'}
  ])('Apply tests for %p breakpoint', ({query, queryString}) => {
    expect(ESLMediaBreakpoints.apply(query)).toBe(queryString);
  })
});

