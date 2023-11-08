import {ExportNs} from '../../esl-utils/environment/export-ns';
import {SyntheticEventTarget} from '../../esl-utils/dom/events/target';
import {memoize} from '../../esl-utils/decorators/memoize';

import type {ESLModal} from './esl-modal';

export interface ModalStackActionsParams {
  action: string;
  relatedTarget: ESLModal;
}

@ExportNs('ModalStack')
export class ESLModalStack extends SyntheticEventTarget {
  private static _store: ESLModal[] = [];

  @memoize()
  public static get instance(): ESLModalStack {
    return new ESLModalStack();
  }

  public static get store(): ESLModal[] {
    return ESLModalStack._store;
  }

  public add(item: ESLModal): void {
    if (ESLModalStack.store.includes(item)) return;
    ESLModalStack._store.push(item);
    this.afterStackUpdate('add', item);
  }

  public remove(target: ESLModal): void {
    if (!ESLModalStack.store.includes(target)) return;
    let modalToHide;
    do {
      modalToHide = ESLModalStack._store.pop();
      modalToHide && modalToHide.hide() && this.afterStackUpdate('remove', modalToHide);
    } while (modalToHide !== target);
  }

  protected afterStackUpdate(action: string, relatedTarget: ESLModal): void {
    const eventInit: ModalStackActionsParams = {action, relatedTarget};
    this.dispatchEvent(new CustomEvent('stack:update', {detail: eventInit}));
  }
}


declare global {
  export interface ESLLibrary {
    ModalStack: typeof ESLModalStack;
  }
}
