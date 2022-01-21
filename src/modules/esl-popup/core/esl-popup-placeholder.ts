import {ExportNs} from '../../esl-utils/environment/export-ns';
import {ESLToggleablePlaceholder} from '../../esl-toggleable/core';

import type {ESLPopup} from './esl-popup';

@ExportNs('PopupPlaceholder')
export class ESLPopupPlaceholder extends ESLToggleablePlaceholder {
  public static is = 'esl-popup-placeholder';

  public $origin: ESLPopup | null;
}

declare global {
  export interface ESLLibrary {
    PopupPlaceholder: typeof ESLPopupPlaceholder;
  }
  export interface HTMLElementTagNameMap {
    'esl-popup-placeholder': ESLPopupPlaceholder;
  }
}
