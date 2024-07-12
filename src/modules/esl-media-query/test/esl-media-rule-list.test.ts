import {getMatchMediaMock} from '../../esl-utils/test/matchMedia.mock';
import {ESLMediaRuleList} from '../core/esl-media-rule-list';
import {ESLScreenBreakpoints} from '../core/common/screen-breakpoint';

describe('ESLMediaRuleList', () => {
  const mockSmMatchMedia = getMatchMediaMock(ESLScreenBreakpoints.get('sm')!.mediaQuery);
  const mockMdMatchMedia = getMatchMediaMock(ESLScreenBreakpoints.get('md')!.mediaQuery);

  describe('Integration cases:', () => {
    test('Basic case: "1 | @sm => 2 | @md => 3" parsed correctly', () => {
      const mrl = ESLMediaRuleList.parseQuery('1 | @sm => 2 | @md => 3');
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

    test('Extended media case parsed correctly: "1 | @sm and @md => 2"', () => {
      const mrl = ESLMediaRuleList.parseQuery('1 | @sm and @md => 2');
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

    test('Extended media case parsed correctly: "1 | @sm or @md => 2"', () => {
      const mrl = ESLMediaRuleList.parseQuery('1 | @sm or @md => 2');
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

    test('Tuple media query "all|@sm|@md ==> 1|2|3" correctly parsed', () => {
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

  describe('Basic cases:', () => {
    test('Single value parsed to the single "all" rule', () => {
      const mrl = ESLMediaRuleList.parseQuery('123');
      expect(mrl.rules.length).toBe(1);
      expect(mrl.active.length).toBeGreaterThan(0);
      expect(mrl.value).toBe('123');
      expect(mrl.activeValue).toBe('123');
    });

    test('Single rule with media query "@sm => 1"', () => {
      const mrl = ESLMediaRuleList.parseQuery('@sm => 1');
      expect(mrl.rules.length).toBe(1);
    });

    test('Single rule "@sm => 1" response to the matcher correctly', () => {
      const mrl = ESLMediaRuleList.parseQuery('@sm => 1');

      mockSmMatchMedia.matches = false;
      expect(mrl.value).toBe(undefined);

      mockSmMatchMedia.matches = true;
      expect(mrl.value).toBe('1');

      mockSmMatchMedia.matches = false;
      expect(mrl.value).toBe(undefined);
    });

    afterEach(() => {
      mockSmMatchMedia.matches = false;
      mockMdMatchMedia.matches = false;
    });
  });

  describe('Partial tuple parsing', () => {
    test('Single value is accepted and copied for each condition', () => {
      const ruleList = ESLMediaRuleList.parseTuple('@sm|@md|@lg', '123');
      expect(ruleList.rules.length).toBe(3);
      for (const rule of ruleList.rules) {
        expect(rule.payload).toBe('123');
      }
    });

    test('Partial value parsing leads to autocomplete values with the last one', () => {
      const ruleList = ESLMediaRuleList.parseTuple('@sm|@md|@lg', '1 | 12');
      expect(ruleList.rules.length).toBe(3);
      expect(ruleList.rules[0].payload).toBe('1');
      expect(ruleList.rules[1].payload).toBe('12');
      expect(ruleList.rules[2].payload).toBe('12');
    });

    test('Empty value to be parsed aas empty sting', () => {
      const ruleList = ESLMediaRuleList.parseTuple('(min-width: 100px)', '');
      expect(ruleList.rules.length).toBe(1);
      expect(ruleList.rules[0].payload).toBe('');
      expect(ruleList.rules[0].query.toString()).toBe('(min-width: 100px)');
    });

    test('Empty mask leads to all query', () => {
      const ruleList = ESLMediaRuleList.parseTuple('', '');
      expect(ruleList.rules.length).toBe(1);
      expect(ruleList.rules[0].payload).toBe('');
      expect(ruleList.rules[0].query.toString()).toBe('all');
    });

    test('Values cortege longer then mask cortege is not allowed', () => {
      expect(() => ESLMediaRuleList.parseTuple('@xs', '1|2|3')).toThrowError();
    });
  });
});
