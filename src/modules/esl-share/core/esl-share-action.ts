import {ESLShareActionRegistry} from './esl-share-action-registry';

import type {ESLShareButton} from './esl-share-button';

export type ActionType = (new() => ESLShareBaseAction) & typeof ESLShareBaseAction;

export abstract class ESLShareBaseAction {
  public static readonly is: string;

  /** Register this action. Can be used as a decorator */
  public static register(this: ActionType): void;
  public static register(this: unknown, action?: ActionType): void;
  public static register(this: any, action?: ActionType): void {
    action = action || this;
    if (action === ESLShareBaseAction) throw new Error('`ESLShareBaseAction` can\'t be registered.');
    if (!(action?.prototype instanceof ESLShareBaseAction)) throw new Error('Action should be instanceof `ESLShareBaseAction`');
    ESLShareActionRegistry.instance.register(action);
  }

  public get isAvailable(): boolean {
    return true;
  }

  public abstract share(shareData: ShareData, $button: ESLShareButton): void;
}
