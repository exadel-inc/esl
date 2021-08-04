import {ESLMediaRuleList} from '../core/esl-media-rule-list';
import {ESLMediaRule} from '../core/esl-media-rule';
import {ALL} from '../core/conditions/media-query-base';

describe('ESLMediaRule', () => {

  describe('parse', () => {
    test('all => 1', () => {
      const serialized = 'all => 1';
      const rule = ESLMediaRule.parse(serialized, ESLMediaRuleList.STRING_PARSER);
      expect(rule).toBeDefined();
      expect(rule!.default).toBe(false);
      expect(rule!.matches).toBe(true);
      expect(rule!.payload).toBe('1');
      expect(rule!.toString()).toEqual(serialized);
    });

    test('not all => 1', () => {
      const serialized = 'not all => 1';
      const rule = ESLMediaRule.parse(serialized, ESLMediaRuleList.STRING_PARSER);
      expect(rule).toBeDefined();
      expect(rule!.default).toBe(false);
      expect(rule!.matches).toBe(false);
      expect(rule!.payload).toBe('1');
      expect(rule!.toString()).toEqual(serialized);
    });

    test('@sm => {a: 1}', () => {
      const serialized = '@sm => {a: 1}';
      const rule = ESLMediaRule.parse(serialized, ESLMediaRuleList.OBJECT_PARSER);
      expect(rule).toBeDefined();
      expect(rule!.default).toBe(false);
      expect(rule!.payload).toEqual({a: 1});
    });

    test('@sm => {a: 1', () => {
      const spy = jest.spyOn(console, 'warn').mockImplementationOnce(() => void 0);
      const serialized = '@sm => {a: 1';
      const rule = ESLMediaRule.parse(serialized, ESLMediaRuleList.OBJECT_PARSER);
      expect(rule).not.toBeDefined();
      expect(spy).toBeCalled();
    });

    test('hello', () => {
      const serialized = 'hello';
      const rule = ESLMediaRule.parse(serialized, ESLMediaRuleList.STRING_PARSER);
      expect(rule).toBeDefined();
      expect(rule!.default).toBe(true);
      expect(rule!.payload).toEqual('hello');
    });

    test('123 (custom parser)', () => {
      const serialized = '123';
      const rule = ESLMediaRule.parse(serialized, (str) => +str);
      expect(rule).toBeDefined();
      expect(rule!.default).toBe(true);
      expect(rule!.payload).toEqual(123);
    });
  });

  test('empty', () => {
    const rule = ESLMediaRule.empty();
    expect(rule).toBeDefined();
    expect(rule.default).toBe(false);
    expect(rule.matches).toBe(true);
    expect(rule.payload).toEqual(undefined);
  });

  test('all', () => {
    const obj = {};
    const rule = ESLMediaRule.all(obj);
    expect(rule).toBeDefined();
    expect(rule.default).toBe(false);
    expect(rule.matches).toBe(true);
    expect(rule.payload).toEqual(obj);
  });

  test('default', () => {
    const obj = {};
    const rule = ESLMediaRule.default(obj);
    expect(rule).toBeDefined();
    expect(rule.default).toBe(true);
    expect(rule.matches).toBe(true);
    expect(rule.payload).toEqual(obj);
  });

  describe('subscription', () => {
    const callback = () => void 0;
    const testRule = ESLMediaRule.parse('all => 1', ESLMediaRuleList.STRING_PARSER) as ESLMediaRule<string>;

    test('addListener', () => {
      const spyAdd = jest.spyOn(ALL, 'addListener');
      testRule.addListener(callback);
      expect(spyAdd).toBeCalled();
    });
    test('removeListener', () => {
      const spyRemove = jest.spyOn(ALL, 'removeListener');
      testRule.removeListener(callback);
      expect(spyRemove).toBeCalled();
    });
  });
});
