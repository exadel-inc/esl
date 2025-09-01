import {ESLMediaRuleList} from '../core/esl-media-rule-list';
import {ESLMediaRule} from '../core/esl-media-rule';
import {ESLMediaQuery} from '../core/esl-media-query';

describe('ESLMediaRule', () => {
  describe('create', () => {
    test('empty strings', () => {
      const rule = ESLMediaRule.create('', '', String);
      expect(rule!.payload).toBe('');
      expect(rule!.matches).toBe(true);
    });
    test('basic sample', () => {
      const rule = ESLMediaRule.create('hi', 'not all', String);
      expect(rule!.payload).toBe('hi');
      expect(rule!.matches).toBe(false);
    });
    test('number parser', () => {
      const rule = ESLMediaRule.create('1', 'all', Number);
      expect(rule!.payload).toBe(1);
      expect(rule!.matches).toBe(true);
    });
    test('number parser NaN', () => {
      const rule = ESLMediaRule.create('hi', 'all', Number);
      expect(rule!.payload).toBe(NaN);
      expect(rule!.matches).toBe(true);
    });
    test('parser undefined result', () => {
      const rule = ESLMediaRule.create('hi', 'all', () => undefined);
      expect(rule).toBe(undefined);
    });
  });

  describe('parse', () => {
    test('all => 1', () => {
      const serialized = 'all => 1';
      const rule = ESLMediaRule.parse(serialized, ESLMediaRuleList.STRING_PARSER);
      expect(rule).toBeDefined();
      expect(rule!.matches).toBe(true);
      expect(rule!.payload).toBe('1');
      expect(rule!.toString()).toEqual(serialized);
    });

    test('not all => 1', () => {
      const serialized = 'not all => 1';
      const rule = ESLMediaRule.parse(serialized, ESLMediaRuleList.STRING_PARSER);
      expect(rule).toBeDefined();
      expect(rule!.matches).toBe(false);
      expect(rule!.payload).toBe('1');
      expect(rule!.toString()).toEqual(serialized);
    });

    test('@sm => {a: 1}', () => {
      const serialized = '@sm => {a: 1}';
      const rule = ESLMediaRule.parse(serialized, ESLMediaRuleList.OBJECT_PARSER);
      expect(rule).toBeDefined();
      expect(rule!.payload).toEqual({a: 1});
    });

    test('@sm => {a: 1', () => {
      const spy = jest.spyOn(console, 'warn').mockImplementationOnce(() => void 0);
      const serialized = '@sm => {a: 1';
      const rule = ESLMediaRule.parse(serialized, ESLMediaRuleList.OBJECT_PARSER);
      expect(rule).not.toBeDefined();
      expect(spy).toHaveBeenCalled();
    });

    test('hello', () => {
      const serialized = 'hello';
      const rule = ESLMediaRule.parse(serialized, ESLMediaRuleList.STRING_PARSER);
      expect(rule).toBeDefined();
      expect(rule!.payload).toEqual('hello');
    });

    test('123 (custom parser)', () => {
      const serialized = '123';
      const rule = ESLMediaRule.parse(serialized, (str) => +str);
      expect(rule).toBeDefined();
      expect(rule!.payload).toEqual(123);
    });
  });

  test('empty', () => {
    const rule = ESLMediaRule.empty();
    expect(rule).toBeDefined();
    expect(rule.matches).toBe(true);
    expect(rule.payload).toEqual(undefined);
  });

  test('all', () => {
    const obj = {};
    const rule = ESLMediaRule.all(obj);
    expect(rule).toBeDefined();
    expect(rule.matches).toBe(true);
    expect(rule.payload).toEqual(obj);
  });

  describe('subscription', () => {
    const callback = () => void 0;
    const testRule = ESLMediaRule.parse('all => 1', ESLMediaRuleList.STRING_PARSER) as ESLMediaRule<string>;

    test('addEventListener', () => {
      const spyAdd = jest.spyOn(ESLMediaQuery.ALL, 'addEventListener');
      testRule.addEventListener(callback);
      expect(spyAdd).toHaveBeenCalled();
    });
    test('removeEventListener', () => {
      const spyRemove = jest.spyOn(ESLMediaQuery.ALL, 'removeEventListener');
      testRule.removeEventListener(callback);
      expect(spyRemove).toHaveBeenCalled();
    });
  });
});
