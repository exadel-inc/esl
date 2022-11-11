import {memoize} from '../../esl-utils/decorators';

import type {ActionType} from './esl-share-action';
import type {ESLShareButton} from './esl-share-button';

export class ESLShareActionRegistry {
  private actionsMap: Map<string, ActionType> = new Map();

  @memoize()
  public static get instance(): ESLShareActionRegistry {
    return new ESLShareActionRegistry();
  }

  /** Register action */
  public register(action: ActionType): void {
    if (!action.is) throw new Error('Action should have a name');
    this.actionsMap.set(action.is, action);
  }

  /** Check that action is registered for passed name */
  public has(name: string): boolean {
    return this.actionsMap.has(name);
  }

  /** Get action by name */
  public get(name: string): ActionType | null {
    if (!name) return null;
    return this.actionsMap.get(name.toLowerCase()) || null;
  }

  /** Do action at passed Share button */
  public doAction(button: ESLShareButton): void {
    const action = this.get(button.action);
    action && new action(button).do();
  }
}
