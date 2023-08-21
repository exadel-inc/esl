import {ExportNs} from '../../esl-utils/environment/export-ns';
import {ESLToggleablePlaceholder} from '../../esl-toggleable/core';

import type {ESLModal} from './esl-modal';

@ExportNs('ModalPlaceholder')
export class ESLModalPlaceholder extends ESLToggleablePlaceholder {
  public static override is = 'esl-modal-placeholder';

  public override $origin: ESLModal | null;
}

declare global {
  export interface ESLLibrary {
    ModalPlaceholder: typeof ESLModalPlaceholder;
  }
  export interface HTMLElementTagNameMap {
    'esl-modal-placeholder': ESLModalPlaceholder;
  }
}
