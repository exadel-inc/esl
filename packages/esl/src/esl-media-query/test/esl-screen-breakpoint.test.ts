import {ESLScreenBreakpoints} from '../core';

describe('ESLScreenBreakpoint tests', () => {
  const {add, get} = ESLScreenBreakpoints;

  test(
    'Get un-existing shortcut returs undefined',
    () => expect(get('some')).toBeUndefined()
  );

  test('Get all breakpoints (default)', () => {
    expect(new Set(ESLScreenBreakpoints.names)).toEqual(new Set(['xs', 'sm', 'md', 'lg', 'xl']));
  });

  test(
    'Add custom breakpoint "SMALL"',
    () => expect(add('SMALL', 300, 400)).toBeUndefined()
  );
  test(
    'Get custom breakpoint "SMALL" regular query',
    () => expect(get('SMALL')?.mediaQuery).toBe('(min-width: 300px) and (max-width: 400px)')
  );

  test(
    'Get custom breakpoint "SMALL" ge query',
    () => expect(get('SMALL')?.mediaQueryGE).toBe('(min-width: 300px)')
  );

  test(
    'Get custom breakpoint "SMALL" le query',
    () => expect(get('SMALL')?.mediaQueryLE).toBe('(max-width: 400px)')
  );

  test(
    'Replace custom breakpoint "SMALL"',
    () => expect(add('Small', 400, 500)?.mediaQuery)
      .toBe('(min-width: 300px) and (max-width: 400px)')
  );
  test(
    'Get updated custom breakpoint "SMALL" regular query',
    () => expect(get('small')?.mediaQuery).toBe('(min-width: 400px) and (max-width: 500px)')
  );

  test(
    'Add default custom breakpoint "xs"',
    () => expect(add('xs', 11, 22)).not.toBeUndefined()
  );

  test(
    'Check that default custom breakpoint "xs" updated',
    () => expect(get('xs')?.mediaQuery).toBe('(min-width: 11px) and (max-width: 22px)')
  );

  test('Get all breakpoints after adding custom', () => {
    expect(new Set(ESLScreenBreakpoints.names))
      .toEqual(new Set(['xs', 'sm', 'md', 'lg', 'xl', 'small']));
  });

  test(
    'Empty keys is not allowed in custom breakpoint name',
    () => expect(() => add('', 200, 300)).toThrow()
  );
  test(
    'Non-Latin keys are not allowed in custom breakpoint name',
    () => expect(() => add('небольшой', 200, 300)).toThrow()
  );
  test(
    'Extra "@" is not allowed in custom breakpoint name',
    () => expect(() => add('@XS', 200, 300)).toThrow()
  );
  test(
    'Numeric key is not allowed in custom breakpoint name',
    () => expect(() => add('123', 200, 300)).toThrow()
  );

  test(
    'Digits allowed as part of regular custom breakpoint name',
    () => expect(() => add('xs123', 200, 300)).not.toThrow()
  );
});
