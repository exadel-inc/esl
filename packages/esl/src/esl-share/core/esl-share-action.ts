import {ESLShareActionRegistry} from './esl-share-action-registry';

import type {ESLShareButton} from './esl-share-button';

/** Action type definition */
export type ESLShareActionType = (new() => ESLShareBaseAction) & typeof ESLShareBaseAction;

/** Base action class/interface for actions that ESLShare widgets can invoke. */
export abstract class ESLShareBaseAction {
  public static readonly is: string;

  /** Decorator to register action */
  public static register(this: ESLShareActionType): void;
  /** Registers this action */
  public static register(this: unknown, action?: ESLShareActionType): void;
  public static register(this: any, action?: ESLShareActionType): void {
    action = action || this;
    if (action === ESLShareBaseAction) throw new Error('`ESLShareBaseAction` can\'t be registered.');
    if (!(action?.prototype instanceof ESLShareBaseAction)) throw new Error('Action should be instanceof `ESLShareBaseAction`');
    ESLShareActionRegistry.instance.register(action);
  }

  /** Checks if this action is available on the user's device */
  public get isAvailable(): boolean {
    return true;
  }

  /** @returns {@link ShareData} object for button  */
  protected getShareData($button: ESLShareButton): ShareData {
    return {
      url: $button.urlToShare,
      title: $button.titleToShare
    };
  }

  /** Does an action to share */
  public abstract share($button: ESLShareButton): void;
}
