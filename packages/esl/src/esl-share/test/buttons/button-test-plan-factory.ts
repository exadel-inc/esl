import {ESLShareConfig} from '../../core/esl-share-config';
import {ESLShareActionRegistry} from '../../core/esl-share-action-registry';

export function createImportCheckTestPlan(actionName: string): () => void {
  return () => {
    test('config instance has 1 button', () => {
      expect(ESLShareConfig.instance.buttons.length).toBe(1);
    });

    test(`"${actionName}" action was registered when importing the button`, () => {
      expect(ESLShareActionRegistry.instance.has(actionName)).toBe(true);
    });
  };
}

export function createButtonMatchingTestPlan(name: string, action: string): () => void {
  return () => {
    test('button from config has action property', () => {
      expect(ESLShareConfig.instance.buttons[0]).toHaveProperty('action');
    });

    test(`button from config has action property set to "${action}"`, () => {
      expect(ESLShareConfig.instance.buttons[0].action).toBe(action);
    });

    test('button from config has icon property', () => {
      expect(ESLShareConfig.instance.buttons[0]).toHaveProperty('icon');
    });

    test('button from config has link property', () => {
      expect(ESLShareConfig.instance.buttons[0]).toHaveProperty('link');
    });

    test('button from config has name property', () => {
      expect(ESLShareConfig.instance.buttons[0]).toHaveProperty('name');
    });

    test(`button from config has name property set to "${name}"`, () => {
      expect(ESLShareConfig.instance.buttons[0].name).toBe(name);
    });

    test('button from config has title property', () => {
      expect(ESLShareConfig.instance.buttons[0]).toHaveProperty('title');
    });
  };
}
