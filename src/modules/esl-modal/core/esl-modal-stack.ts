import {ExportNs} from '../../esl-utils/environment/export-ns';

import type {ESLModal} from './esl-modal';

@ExportNs('ModalStack')
export class ESLModalStack {
  private readonly instance: ESLModalStack;
  private static _store: ESLModal[] = [];

  constructor() {
    if (!this.instance) {
      this.instance = this;
    }
    return this.instance;
  }

  public static get store(): ESLModal[] {
    return ESLModalStack._store;
  }

  public static add(target: ESLModal): void {
    if (ESLModalStack.store.includes(target)) return;
    ESLModalStack._store.push(target);
    this.updateA11ty();
  }

  public static remove(target: ESLModal): void {
    if (!ESLModalStack.store.includes(target)) return;
    let modalToHide;
    do {
      modalToHide = ESLModalStack._store.pop();
      modalToHide && modalToHide.hide();
    } while (modalToHide !== target);
    this.updateA11ty();
  }

  private static updateA11ty(): void {
    const length = ESLModalStack.store.length;
    if (!length) return;
    ESLModalStack._store.forEach(($el: ESLModal, i: number) => $el.setAttribute('aria-hidden', String(i !== length - 1)));
  }
}


declare global {
  export interface ESLLibrary {
    ModalStack: typeof ESLModalStack;
  }
}
