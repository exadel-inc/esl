import {ESLMediaRuleList} from '../core/esl-media-rule-list';
import {getMatchMediaMock} from '../../esl-utils/test/matchMedia.mock';
import {ESLScreenBreakpoints} from '../core/common/screen-breakpoint';

describe('ESLMediaRuleList', () => {
  const mockSmMatchMedia = getMatchMediaMock(ESLScreenBreakpoints.get('sm')!.mediaQuery);
  const mockMdMatchMedia = getMatchMediaMock(ESLScreenBreakpoints.get('md')!.mediaQuery);

  test('123 (default)', () => {
    const mrl = ESLMediaRuleList.parse('123');
    expect(mrl.rules.length).toBe(1);
    expect(mrl.default).toBeDefined();
    expect(mrl.default.default).toBe(true);
    expect(mrl.default.payload).toBe('123');

    expect(mrl.active).toBeDefined();
    expect(mrl.activeValue).toBe('123');
  });

  test('@sm => 1', () => {
    const mrl = ESLMediaRuleList.parse('@sm => 1');
    expect(mrl.rules.length).toBe(1);
    expect(mrl.default).not.toBeDefined();

    mockSmMatchMedia.matches = false;
    expect(mrl.active).toBeDefined();
    expect(mrl.activeValue).toBe(undefined);

    mockSmMatchMedia.matches = true;
    expect(mrl.active).toBeDefined();
    expect(mrl.activeValue).toBe('1');

    mockSmMatchMedia.matches = false;
    expect(mrl.active).toBeDefined();
    expect(mrl.activeValue).toBe(undefined);
  });

  test('1 | @sm => 2 | @md => 3', () => {
    const mrl = ESLMediaRuleList.parse('1 | @sm => 2 | @md => 3');
    expect(mrl.rules.length).toBe(3);
    expect(mrl.default).toBeDefined();

    mockSmMatchMedia.matches = false;
    mockMdMatchMedia.matches = false;
    expect(mrl.active).toBeDefined();
    expect(mrl.activeValue).toBe('1');

    mockSmMatchMedia.matches = true;
    mockMdMatchMedia.matches = false;
    expect(mrl.activeValue).toBe('2');

    mockSmMatchMedia.matches = false;
    mockMdMatchMedia.matches = true;
    expect(mrl.activeValue).toBe('3');

    mockSmMatchMedia.matches = true;
    mockMdMatchMedia.matches = true;
    expect(mrl.activeValue).toBe('3');
  });

  test('1 | @sm and @md => 2', () => {
    const mrl = ESLMediaRuleList.parse('1 | @sm and @md => 2');
    const listener = jest.fn();

    expect(mrl.rules.length).toBe(2);

    mrl.addListener(listener);

    mockSmMatchMedia.matches = false;
    mockMdMatchMedia.matches = false;
    expect(mrl.activeValue).toBe('1');

    mockSmMatchMedia.matches = true;
    mockMdMatchMedia.matches = false;
    expect(mrl.activeValue).toBe('1');

    mockSmMatchMedia.matches = false;
    mockMdMatchMedia.matches = true;
    expect(mrl.activeValue).toBe('1');
    expect(listener).not.toBeCalled();

    mockSmMatchMedia.matches = true;
    mockMdMatchMedia.matches = true;
    expect(mrl.activeValue).toBe('2');
    expect(listener).toBeCalled();
  });

  test('1 | @sm or @md => 2', () => {
    const mrl = ESLMediaRuleList.parse('1 | @sm or @md => 2');
    const listener = jest.fn();

    expect(mrl.rules.length).toBe(2);

    mrl.addListener(listener);

    mockSmMatchMedia.matches = false;
    mockMdMatchMedia.matches = false;
    expect(mrl.activeValue).toBe('1');
    expect(listener).not.toBeCalled();

    mockSmMatchMedia.matches = true;
    mockMdMatchMedia.matches = false;
    expect(mrl.activeValue).toBe('2');
    expect(listener).toBeCalled();

    mockSmMatchMedia.matches = false;
    mockMdMatchMedia.matches = true;
    expect(mrl.activeValue).toBe('2');

    mockSmMatchMedia.matches = true;
    mockMdMatchMedia.matches = true;
    expect(mrl.activeValue).toBe('2');
  });

  test('1|2|3 with all|@sm|@md mask', () => {
    const mrl = ESLMediaRuleList.parseTuple('1|2|3', 'all|@sm|@md');
    expect(mrl.rules.length).toBe(3);
    expect(mrl.default).not.toBeDefined();

    mockSmMatchMedia.matches = false;
    mockMdMatchMedia.matches = false;
    expect(mrl.active).toBeDefined();
    expect(mrl.activeValue).toBe('1');

    mockSmMatchMedia.matches = true;
    mockMdMatchMedia.matches = false;
    expect(mrl.activeValue).toBe('2');

    mockSmMatchMedia.matches = false;
    mockMdMatchMedia.matches = true;
    expect(mrl.activeValue).toBe('3');

    mockSmMatchMedia.matches = true;
    mockMdMatchMedia.matches = true;
    expect(mrl.activeValue).toBe('3');
  });

  afterEach(() => {
    mockSmMatchMedia.matches = false;
    mockMdMatchMedia.matches = false;
  });
});
