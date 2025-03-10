import {ExportNs} from '../../esl-utils/environment/export-ns';
import {ESLToggleablePlaceholder} from '../../esl-toggleable/core';

import type {ESLPopup} from './esl-popup';

@ExportNs('PopupPlaceholder')
export class ESLPopupPlaceholder extends ESLToggleablePlaceholder {
  public static override is = 'esl-popup-placeholder';

  public override $origin: ESLPopup | null;

  protected override disconnectedCallback(): void {
    this.$origin?.remove();
    super.disconnectedCallback();
  }
}

declare global {
  export interface ESLLibrary {
    PopupPlaceholder: typeof ESLPopupPlaceholder;
  }
  export interface HTMLElementTagNameMap {
    'esl-popup-placeholder': ESLPopupPlaceholder;
  }
}
