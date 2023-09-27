import {ExportNs} from '../../esl-utils/environment/export-ns';

import type {ESLModal} from './esl-modal';

@ExportNs('ModalStack')
export class ESLModalStack {
  private static instance: ESLModalStack;
  public static store: ESLModal[] = [];

  constructor() {
    if (!ESLModalStack.instance) {
      ESLModalStack.instance = this;
    }
    return ESLModalStack.instance;
  }

  public static add(target: ESLModal): void {
    if (ESLModalStack.store.includes(target)) return;
    ESLModalStack.store.push(target);
  }

  public static remove(target: ESLModal): void {
    if (!ESLModalStack.store.includes(target)) return;
    let modalToHide;
    do {
      modalToHide = ESLModalStack.store.pop();
      modalToHide && modalToHide.hide();
    } while (modalToHide !== target);
  }
}


declare global {
  export interface ESLLibrary {
    ModalStack: typeof ESLModalStack;
  }
}
