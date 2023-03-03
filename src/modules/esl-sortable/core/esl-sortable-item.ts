import {attr, boolAttr, ESLMixinElement, listen} from '../../esl-mixin-element/core';
import {ESLTraversingQuery} from '../../esl-traversing-query/core';
import {ready} from '../../esl-utils/all';
import {ESLDraggable} from './esl-draggable';

import type {ESLSortable} from './esl-sortable';

export class ESLSortableItem extends ESLMixinElement {
  public static is = 'esl-sortable-item';
  public static observedAttributes = ['placeholder', 'transition'];

  @boolAttr() placeholder: boolean;
  @boolAttr() transition: boolean;

  @attr() public copy: boolean;

  protected draggable: ESLDraggable | null;

  @ready
  public connectedCallback(): void {
    if (!this.sortable) return;
    super.connectedCallback();
    this.bindEvents();
  }

  @ready
  public disconnectedCallback(): void {
    // this.unbindEvents(); TODO
  }

  @ready
  public attributeChangedCallback(attrName: string, oldVal: string, newVal: any): void {
    if (attrName === 'placeholder') this.$$cls('esl-sortable-placeholder', !(newVal ?? true));
  }

  // TODO check if null
  protected get sortable(): ESLSortable | null {
    return ESLTraversingQuery.first('::parent(esl-sortable)', this.$host) as ESLSortable | null;
  }

  protected bindEvents(): void {
    this.$$on(this._onPointerDown);
  }

  @listen('pointerdown')
  protected _onPointerDown(e: PointerEvent): void {
    this.$$on(this._onPointerMove);
    e.stopPropagation();
  }

  @listen({auto: false, event: 'pointermove', once: true})
  protected _onPointerMove(e: PointerEvent): void {
    if (this.placeholder) return;
    this.addElementClone(e);
    this.placeholder = true;
  }

  @listen('pointerup')
  protected _onPointerUp(): void {
    this.$$off(this._onPointerMove);
  }

  /** Creates a copy of sortable's item */
  protected addElementClone(e: PointerEvent): void {
    if (!this.sortable) return;
    this.draggable = ESLDraggable.build({
      activator: this.$host,
      event: e,
      something: this.sortable
    });

    this.draggable!.setPointerCapture(e.pointerId);
  }
}
