import {ESLShareActionRegistry} from '../core/esl-share-action-registry';
import {ESLSharePrintAction} from '../actions/print-action';

describe('ESLShareActionRegistry tests', () => {
  describe('ESLShareActionRegistry static API', () => {
    test('ESLShareActionRegistry instance is a singleton', () => {
      expect(ESLShareActionRegistry.instance).toBeInstanceOf(ESLShareActionRegistry);
      expect(ESLShareActionRegistry.instance).toBe(ESLShareActionRegistry.instance);
    });
  });

  describe('ESLShareActionRegistry public API', () => {

    afterEach(() => {
      ESLShareActionRegistry.instance['actionsMap'].clear();
    });

    test('should throw an error when register invalid action', () => {
      const {instance} = ESLShareActionRegistry;
      expect(() => instance.register({} as any)).toThrowError();
    });

    test('should register action', () => {
      const {instance} = ESLShareActionRegistry;
      instance.register(ESLSharePrintAction);
      expect(instance['actionsMap'].has('print')).toBe(true);
    });

    test('should register the same action just once', () => {
      const {instance} = ESLShareActionRegistry;
      instance.register(ESLSharePrintAction);
      instance.register(ESLSharePrintAction);
      instance.register(ESLSharePrintAction);
      expect(instance['actionsMap'].size).toBe(1);
    });

    test('should check action availability', () => {
      const {instance} = ESLShareActionRegistry;
      instance.register(ESLSharePrintAction);
      expect(instance.has('copy')).toBe(false);
      expect(instance.has('print')).toBe(true);
    });

    test('should get action by name', () => {
      const {instance} = ESLShareActionRegistry;
      instance.register(ESLSharePrintAction);
      const action = instance.get('print');
      expect(action).toBeInstanceOf(ESLSharePrintAction);
    });

    test('should return null when trying to get an unregistered action', () => {
      const {instance} = ESLShareActionRegistry;
      const action = instance.get('print');
      expect(action).toBe(null);
    });
  });
});
