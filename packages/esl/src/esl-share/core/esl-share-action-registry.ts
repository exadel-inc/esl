import {memoize} from '../../esl-utils/decorators';

import type {ESLShareActionType, ESLShareBaseAction} from './esl-share-action';

/**
 * ESLShareActionRegistry class to store share actions
 * @author Dmytro Shovchko
 */
export class ESLShareActionRegistry {
  private actionsMap: Map<string, ESLShareBaseAction> = new Map();

  /** Returns action registry instance */
  @memoize()
  public static get instance(): ESLShareActionRegistry {
    return new ESLShareActionRegistry();
  }

  protected constructor() {}

  /** Registers action */
  public register(action: ESLShareActionType): void {
    if (!action.is) throw new Error('[ESL]: `ESLAction.is` is not defined');
    this.actionsMap.set(action.is, new action());
  }

  /** Checks if action is registered for passed name */
  public has(name: string): boolean {
    return this.actionsMap.has(name);
  }

  /** Gets the action by name */
  public get(name: string): ESLShareBaseAction | null {
    if (!name) return null;
    return this.actionsMap.get(name.toLowerCase()) || null;
  }
}
