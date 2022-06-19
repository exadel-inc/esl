import {getMatchMediaMock} from '../../esl-utils/test/matchMedia.mock';
import {ESLMediaRuleList} from '../core/esl-media-rule-list';
import {ESLScreenBreakpoints} from '../core/common/screen-breakpoint';

describe('ESLMediaRuleList', () => {
  const mockSmMatchMedia = getMatchMediaMock(ESLScreenBreakpoints.get('sm')!.mediaQuery);
  const mockMdMatchMedia = getMatchMediaMock(ESLScreenBreakpoints.get('md')!.mediaQuery);

  test('123 (default)', () => {
    const mrl = ESLMediaRuleList.parse('123');
    expect(mrl.rules.length).toBe(1);
    expect(mrl.active.length).toBeGreaterThan(0);
    expect(mrl.value).toBe('123');
    expect(mrl.activeValue).toBe('123');
  });

  test('@sm => 1', () => {
    const mrl = ESLMediaRuleList.parse('@sm => 1');
    expect(mrl.rules.length).toBe(1);

    mockSmMatchMedia.matches = false;
    expect(mrl.value).toBe(undefined);

    mockSmMatchMedia.matches = true;
    expect(mrl.value).toBe('1');

    mockSmMatchMedia.matches = false;
    expect(mrl.value).toBe(undefined);
  });

  test('1 | @sm => 2 | @md => 3', () => {
    const mrl = ESLMediaRuleList.parse('1 | @sm => 2 | @md => 3');
    expect(mrl.rules.length).toBe(3);

    mockSmMatchMedia.matches = false;
    mockMdMatchMedia.matches = false;
    expect(mrl.active).toBeDefined();
    expect(mrl.value).toBe('1');

    mockSmMatchMedia.matches = true;
    mockMdMatchMedia.matches = false;
    expect(mrl.value).toBe('2');

    mockSmMatchMedia.matches = false;
    mockMdMatchMedia.matches = true;
    expect(mrl.value).toBe('3');

    mockSmMatchMedia.matches = true;
    mockMdMatchMedia.matches = true;
    expect(mrl.value).toBe('3');
  });

  test('1 | @sm and @md => 2', () => {
    const mrl = ESLMediaRuleList.parse('1 | @sm and @md => 2');
    const listener = jest.fn();

    expect(mrl.rules.length).toBe(2);

    mrl.addEventListener(listener);

    mockSmMatchMedia.matches = false;
    mockMdMatchMedia.matches = false;
    expect(mrl.value).toBe('1');

    mockSmMatchMedia.matches = true;
    mockMdMatchMedia.matches = false;
    expect(mrl.value).toBe('1');

    mockSmMatchMedia.matches = false;
    mockMdMatchMedia.matches = true;
    expect(mrl.value).toBe('1');
    expect(listener).not.toBeCalled();

    mockSmMatchMedia.matches = true;
    mockMdMatchMedia.matches = true;
    expect(mrl.value).toBe('2');
    expect(listener).toBeCalled();
  });

  test('1 | @sm or @md => 2', () => {
    const mrl = ESLMediaRuleList.parse('1 | @sm or @md => 2');
    const listener = jest.fn();

    expect(mrl.rules.length).toBe(2);

    mrl.addEventListener(listener);

    mockSmMatchMedia.matches = false;
    mockMdMatchMedia.matches = false;
    expect(mrl.value).toBe('1');
    expect(listener).not.toBeCalled();

    mockSmMatchMedia.matches = true;
    mockMdMatchMedia.matches = false;
    expect(mrl.value).toBe('2');
    expect(listener).toBeCalled();

    mockSmMatchMedia.matches = false;
    mockMdMatchMedia.matches = true;
    expect(mrl.value).toBe('2');

    mockSmMatchMedia.matches = true;
    mockMdMatchMedia.matches = true;
    expect(mrl.value).toBe('2');
  });

  test('all|@sm|@md ==> 1|2|3', () => {
    const mrl = ESLMediaRuleList.parseTuple('all|@sm|@md', '1|2|3');
    expect(mrl.rules.length).toBe(3);

    mockSmMatchMedia.matches = false;
    mockMdMatchMedia.matches = false;
    expect(mrl.value).toBe('1');

    mockSmMatchMedia.matches = true;
    mockMdMatchMedia.matches = false;
    expect(mrl.value).toBe('2');

    mockSmMatchMedia.matches = false;
    mockMdMatchMedia.matches = true;
    expect(mrl.value).toBe('3');

    mockSmMatchMedia.matches = true;
    mockMdMatchMedia.matches = true;
    expect(mrl.value).toBe('3');
  });

  afterEach(() => {
    mockSmMatchMedia.matches = false;
    mockMdMatchMedia.matches = false;
  });
});
