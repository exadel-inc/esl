import {ESLShareActionRegistry} from '../../core/esl-share-action-registry';

export function createImportCheckTestPlan(actionName: string): () => void {
  return () => {
    test(`"${actionName}" action was registered when importing`, () => {
      expect(ESLShareActionRegistry.instance.has(actionName)).toBe(true);
    });
  };
}
