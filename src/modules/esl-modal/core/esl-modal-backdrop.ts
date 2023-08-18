import {ExportNs} from '../../esl-utils/environment/export-ns';
import {ESLBaseElement} from '../../esl-base-element/core/esl-base-element';
import {memoize} from '../../esl-utils/decorators/memoize';

@ExportNs('ModalBackdrop')
export class ESLModalBackdrop extends ESLBaseElement {
  public static override is = 'esl-modal-backdrop';

  @memoize()
  static get instance(): ESLModalBackdrop {
    return ESLModalBackdrop.create();
  }
}

declare global {
  export interface ESLLibrary {
    ModalBackdrop: typeof ESLModalBackdrop;
  }

  export interface HTMLElementTagNameMap {
    'esl-modal-backdrop': ESLModalBackdrop;
  }
}
