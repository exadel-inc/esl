import {ESLTraversingQuery} from '../../esl-traversing-query/core';
import {afterNextRender, memoize} from '../../esl-utils/all';
import {ESLBaseElement, attr, prop, listen, boolAttr} from '../../esl-base-element/core';
import {ready} from '../../esl-utils/decorators/ready';
import {ExportNs} from '../../esl-utils/environment/export-ns';
import {ESLSortableItem} from './esl-sortable-item';
import {ESLDraggable} from './esl-draggable';
import type {ESLSortableInsertDetail} from './esl-draggable';


@ExportNs('Sortable')
export class ESLSortable extends ESLBaseElement {
  public static readonly is = 'esl-sortable';
  public static observedAttributes = ['empty'];

  @prop('1500') public delay: number;
  @attr() group: string;
  @boolAttr() empty: boolean;

  private _$select: HTMLElement;

  @memoize()
  public get $items(): HTMLElement[] {
    return ESLTraversingQuery.all('::child(li)', this._$select) as HTMLElement[];
  }

  // TODO fix unexisting esl-sortable-target
  @ready
  protected connectedCallback(): void {
    super.connectedCallback();
    this._$select = this.querySelector('[esl-sortable-target]')!;
    if (!this._$select) return;
    if (!this.$items.length) this.empty = true;

    this.$items.forEach((el) => el.setAttribute('esl-sortable-item', ''));

    ESLSortableItem.register();
    ESLDraggable.register();

    this.$$on(this._onInsert);
    this.$$on(this._onDelete);
  }

  @ready
  public attributeChangedCallback(attrName: string, oldVal: string, newVal: any): void {
    if (attrName === 'empty' && newVal !== null) this.addEventListener('esl:sortable:insert', () => console.log('lool'));
  }

  @listen('esl:sortable:remove')
  protected _onDelete(e: CustomEvent<ESLSortableInsertDetail>): void {
    const {activator, order} = e.detail;
    const div = document.createElement('div');
    div.style.height = `${activator.offsetHeight}px`;
    div.style.transition = `height ${this.delay}ms ease`;

    activator.insertAdjacentElement(order, div);
    activator.remove();

    div.addEventListener('transitionend', () => div.remove(), {once: true});
    afterNextRender(() => div.style.height = '0px');
  }

  @listen('esl:sortable:insert')
  protected _onInsert(e: CustomEvent<ESLSortableInsertDetail>): void {
    const {activator, target, order} = e.detail;
    activator.style.height = '0px';
    activator.style.transition = `height ${this.delay}ms ease`;
    target.insertAdjacentElement(order, activator);

    afterNextRender(() => e.detail.activator.style.height = `${e.detail.height}px`);
    activator.addEventListener('transitionend', () => {
      activator.removeAttribute('transition');
      memoize.clear(this, '$items');
    });
  }
}
