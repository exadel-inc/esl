import {ExportNs} from '../../esl-utils/environment/export-ns';
import {ESLBaseElement} from '../../esl-base-element/core/esl-base-element';
import {attr, boolAttr, listen, memoize} from '../../esl-utils/decorators';
import {ESLModalStack} from './esl-modal-stack';

import type {DelegatedEvent} from '../../esl-event-listener/core/types';
import type {ModalStackActionsParams} from './esl-modal-stack';

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
  public static get instance(): ESLModalBackdrop {
    return ESLModalBackdrop.create();
  }

  public insert(): void {
    if (document.body.contains(this)) return;
    document.body.appendChild(this);
  }

  @listen({event: 'stack:update', target: () => ESLModalStack.instance})
  protected onHandleStackUpdate(e: CustomEvent<ModalStackActionsParams>): void {
    const {relatedTarget, action} = e.detail;
    if (relatedTarget.noBackdrop) return;
    this.activators[action === 'add' ? 'add' : 'delete'](relatedTarget);
    this.$$attr('active', !!this.activators.size);
    this.$$cls(this.activeClass, !!this.activators.size);
  }

  @listen('click')
  protected _onBackdropClick(e: DelegatedEvent<MouseEvent>): void {
    const target = ESLModalStack.store.at(-1);
    if (target) target.hide({activator: e.$delegate as HTMLElement, initiator: 'backdrop', event: e});
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
