import {ESLShareConfig} from '../../core/esl-share-config';
import {ESLShareActionRegistry} from '../../core/esl-share-action-registry';

import type {ESLShareButtonConfig} from '../../core/esl-share-config';

export function createButtonTestPlan(buttonName: string, referenceButtonConfig: ESLShareButtonConfig, actionName: string): () => void {
  return () => {
    test('config instance has 1 button', () => {
      expect(ESLShareConfig.instance.buttons.length).toBe(1);
    });

    test('config contains a button that is equivalent to a reference button', () => {
      expect(ESLShareConfig.instance.getButton(buttonName)).toEqual(referenceButtonConfig);
    });

    test(`${actionName} action was registered when importing the button`, () => {
      expect(ESLShareActionRegistry.instance.has(actionName)).toBe(true);
    });
  };
}
