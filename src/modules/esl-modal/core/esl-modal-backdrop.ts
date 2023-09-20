import {ExportNs} from '../../esl-utils/environment/export-ns';
import {ESLBaseElement} from '../../esl-base-element/core/esl-base-element';
import {attr, boolAttr, memoize} from '../../esl-utils/decorators';

export interface ESLModalBackdropParams {
  activator: Element;
}

@ExportNs('ModalBackdrop')
export class ESLModalBackdrop extends ESLBaseElement {
  public static override is = 'esl-modal-backdrop';

  @boolAttr({readonly: true}) public active: boolean;
  @attr({defaultValue: 'active'}) public activeClass: string;

  protected activators: Set<Element> = new Set<Element>();

  @memoize()
  static get instance(): ESLModalBackdrop {
    return ESLModalBackdrop.create();
  }

  public show(params: ESLModalBackdropParams): void {
    this.activators.add(params.activator);
    if (!document.body.contains(this)) document.body.appendChild(this);
    this.$$attr('active', true);
    this.$$cls(this.activeClass, true);
  }
  public hide(params: ESLModalBackdropParams): void {
    this.activators.delete(params.activator);
    if (this.activators.size > 0) return;
    this.$$attr('active', false);
    this.$$cls(this.activeClass, false);
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
