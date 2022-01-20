import {ExportNs} from '../../esl-utils/environment/export-ns';
import {ESLToggleableProxy} from '../../esl-toggleable/core';

import type {ESLPopup} from './esl-popup';

@ExportNs('PopupProxy')
export class ESLPopupProxy extends ESLToggleableProxy {
  static is = 'esl-popup-proxy';

  public $origin: ESLPopup | null;
}

declare global {
  export interface ESLLibrary {
    PopupProxy: typeof ESLPopupProxy;
  }
  export interface HTMLElementTagNameMap {
    'esl-popup-proxy': ESLPopupProxy;
  }
}
