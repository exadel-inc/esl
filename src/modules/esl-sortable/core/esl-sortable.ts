// import {afterNextRender, bind} from '../../all';
import {afterNextRender, bind} from '../../esl-utils/all';
import {ESLTraversingQuery} from '../../esl-traversing-query/core';
import {ESLBaseElement, attr} from '../../esl-base-element/core';
import {ExportNs} from '../../esl-utils/environment/export-ns';
import {ESLSortableItem} from './esl-sortable-item';

@ExportNs('Sortable')
export class ESLSortable extends ESLBaseElement {
  public static is = 'esl-sortable';

  /**
   * Animation type when dragged element returns to original position
   */
  @attr({defaultValue: 'default'}) public animation: 'default' | 'smooth';

  /**
   * Children of sortables with identical group attribute vslue can be transfered between each other
   */
  @attr() public group: string;

  /**
   * Duration of recalculation transition
   */
  @attr({defaultValue: '150'}) public transitionDuration: number;

  /** Inner state */
  private _transition: boolean;

  /** Inner state */
  private _empty: boolean;

  /** Sortable to which active element was dragged and will be added to */
  private targetSortable: ESLSortable = this;

  /** Sortable from which active element was dragged and will be deleted from */
  private placeholderSortable: ESLSortable = this;

  /** Clone of the element */
  private _$cloneEl: ESLSortableItem;

  /** Original element which is copied */
  private _$placeholderEl: ESLSortableItem;

  /** Element that is targeted to insert next to */
  private _$targetEl: ESLSortableItem | ESLSortable;

  private get childrens(): Element[] {
    return ESLTraversingQuery.all('::child(ul)::child([esl-sortable-item])', this);
  }

  private get list(): Element {
    return ESLTraversingQuery.first('::child(ul)', this) || this.appendChild(document.createElement('ul'));
  }

  protected connectedCallback(): void {
    ESLSortableItem.register();
    this.bindEvents();
    super.connectedCallback();
  }

  protected disconnectedCallback(): void {
    this.unbindEvents();
    super.disconnectedCallback();
  }

  protected bindEvents(): void {
    this.addEventListener('mousedown', this._onMouseDown);
    this.addEventListener('transitionend', this._onTransitionOver);
    this.addEventListener('esl:sortable:insert', this._onInsert);
  }

  protected unbindEvents(): void {
    this.removeEventListener('mousedown', this._onMouseDown);
    this.removeEventListener('transitionend', this._onTransitionOver);
    this.removeEventListener('esl:sortable:insert', this._onInsert);
  }

  @bind
  protected _onMouseDown(): void {
    if (this.transition || this._$cloneEl) return;
    document.addEventListener('mousemove', this._onMouseMove);
    document.addEventListener('mouseup', this._onMouseUp);
  }

  @bind
  protected _onMouseMove(e: MouseEvent): void {
    if (!this._$cloneEl) {
      this.addElementClone(e);
      return;
    }
    this.updateCloneElPosition(e);
    this.findTargetItem(e);
  }

  private updateCloneElPosition(e: MouseEvent): void {
    this._$cloneEl.$host.style.transform = `translate3d(${this._$cloneEl.pos.x + e.x}px, ${this._$cloneEl.pos.y + e.y}px, 0)`;
  }

  /** Creates a copy of sortable's item */
  private addElementClone(e: MouseEvent): void {
    const placeholder = e.target as HTMLElement;
    if (!placeholder) return;
    const placeholderMixin = ESLSortableItem.get(placeholder);
    if (placeholderMixin?.parent !== this) return;
    this._$cloneEl = new ESLSortableItem(placeholder.cloneNode(true) as HTMLElement);

    this._$placeholderEl = placeholderMixin;
    placeholderMixin.placeholder = true;
    placeholderMixin.pos = {x: placeholder.offsetLeft, y: placeholder.offsetTop};
    const placeholderRect = placeholder.getBoundingClientRect();

    this._$cloneEl.pos = {x: placeholderRect.x - e.x, y: placeholderRect.y - e.y};
    this._$cloneEl.$$cls('esl-sortable-drag', true);
    this._$cloneEl.$host.style.height = `${placeholder.offsetHeight}px`;
    this._$cloneEl.$host.style.width = `${placeholder.offsetWidth}px`;

    document.body.appendChild(this._$cloneEl.$host);
    this.updateCloneElPosition(e);
  }

  private findTargetItem(e: MouseEvent): void {
    if (this.targetSortable?.transition || this.placeholderSortable?.transition) return;
    const target = document.elementsFromPoint(e.x, e.y)[1] as ESLSortable;
    this.placeholderSortable = this._$placeholderEl.parent!;
    if (this.isSortableEmpty(target) && this.isSortableFromGroup(target) && this.placeholderSortable !== target) {
      this._$targetEl = target;
      this._$targetEl.empty = true;
      this._$targetEl.$$cls('esl-sortable-target', true);
      this.targetSortable = this._$targetEl;
      this.fireInsertEvents(true);
      return;
    }

    const targetMixin = ESLSortableItem.get(target);
    if (!targetMixin?.parent || targetMixin.placeholder) return;
    this._$targetEl = targetMixin;
    this.targetSortable = targetMixin.parent;
    this.fireInsertEvents(false);
  }

  private fireInsertEvents(isSortableEmpty: boolean = false): void {
    this._$targetEl.$$cls('esl-sortable-target', true);
    if (!isSortableEmpty && !this.isSortableFromGroup(this.targetSortable)) return;
    const insertData = {detail: {target: this._$targetEl, placeholder: this._$placeholderEl, sameSortable: isSortableEmpty}};
    this.placeholderSortable.$$fire('sortable:insert', insertData);
    // Fired when element was dragged from one sortable to another
    if (this.targetSortable !== this.placeholderSortable) {
      this.targetSortable.$$fire('sortable:insert', insertData);
    }
  }

  /** Checks if target is sortable */
  private isSortable(el: HTMLElement): boolean {
    return (el.constructor as typeof ESLBaseElement).is === 'esl-sortable';
  }

  /** Checks if targeted sortable is empty */
  private isSortableEmpty(el: ESLSortable): boolean {
    return this.isSortable(el) ? el.childrens.length === 0 : false;
  }

  /** Checks if targeted sortable is from the same group */
  private isSortableFromGroup(el: ESLSortable): boolean {
    return this.isSortable(el) ? el.group === this.group : false;
  }

  @bind
  protected _onInsert(e: CustomEvent): void {
    const {target, placeholder, sameSortable} = e.detail;
    this._$targetEl = target;
    this._$placeholderEl = placeholder;
    this.targetSortable = sameSortable ? target : target.parent;
    this.placeholderSortable = placeholder.parent;
    this.insertChild();
  }

  /** Inner state */
  private get transition(): boolean {
    return this._transition;
  }
  private set transition(value: boolean) {
    this.toggleAttribute('transition', this._transition = value);
  }

  /** Inner state */
  private get empty(): boolean {
    return this._empty;
  }
  private set empty(value: boolean) {
    this.classList.toggle('esl-sortable-empty', this._empty = value);
  }

  /** Method recalculates sortable's children position two times: before and after element insert */
  private insertChild(): void {
    this.targetSortable.transition = true;
    this.placeholderSortable.transition = true;
    this.positionItems();
    afterNextRender(() => {
      if (this._$targetEl) this._$targetEl.$$cls('esl-sortable-target', false);
      // Necessary if element was transfered from one sortable to another
      if (this._$placeholderEl.$$cls('esl-sortable-group-inserted')) {
        this.positionItems(true);
        return;
      }

      if (this.targetSortable.empty) {
        this.targetSortable.empty = false;
        this.targetSortable.list.appendChild(this._$placeholderEl.$host);
      } else {
        (this._$targetEl as ESLSortableItem).$host.insertAdjacentElement(this.isInsertedBefore() ? 'afterend' : 'beforebegin', this._$placeholderEl.$host);
      }
      this._$placeholderEl.$$cls('esl-sortable-group-inserted', true);
      this.positionItems(true);
    });
  }

  /** Checks if element has to be inserted before or after target element */
  private isInsertedBefore(): boolean {
    const targetIndex = this.childrens.indexOf((this._$targetEl as ESLSortableItem).$host);
    const placeholderIndex = this.childrens.indexOf(this._$placeholderEl.$host);
    return targetIndex > placeholderIndex && this.targetSortable === this.placeholderSortable;
  }

  /** Sets sortable's children position to absolute and manually calculates each element position */
  private positionItems(isInserted: boolean = false): void {
    let rowHeight = 0;
    let leftValue = 0;
    let topValue = 0;
    this.childrens.forEach((el: HTMLElement) => {
      el.style.position = 'absolute';

      const elementFitsRow = leftValue + el.offsetWidth + parseInt(window.getComputedStyle(el).marginLeft, 10) < this.offsetWidth;
      if (!elementFitsRow) {
        leftValue = 0;
        topValue += rowHeight;
        rowHeight = el.offsetHeight;
      }

      el.style.left = `${leftValue}px`;
      el.style.top = `${topValue}px`;

      const {_$placeholderEl} = this;
      if (el === _$placeholderEl.$host) {
        _$placeholderEl.pos.x = leftValue;
        _$placeholderEl.pos.y = topValue;
      }

      rowHeight = this.outerHeight(el) > rowHeight ? this.outerHeight(el) : rowHeight;
      leftValue += this.outerWidth(el);
      if (isInserted) return;

      if (this.animation === 'default' && el === this._$placeholderEl.$host && (this._$placeholderEl.parent !== (this._$targetEl as ESLSortableItem).parent)) {
        el.style.transition = `opacity ${this.transitionDuration}ms ease`;
      } else {
        el.style.transition = `left ${this.transitionDuration}ms ease, top ${this.transitionDuration}ms ease`;
      }
    });
    this.style.height = `${topValue + rowHeight}px`;
    this.style.transition = `height ${this.transitionDuration}ms ease`;
  }

  /** Calculates height with margins */
  private outerHeight(el: HTMLElement): number {
    const margins = parseInt(window.getComputedStyle(el).marginTop, 10) + parseInt(window.getComputedStyle(el).marginBottom, 10);
    return el.offsetHeight + margins;
  }

  /** Calculates width with margins */
  private outerWidth(el: HTMLElement): number  {
    const margins = parseInt(window.getComputedStyle(el).marginLeft, 10) + parseInt(window.getComputedStyle(el).marginRight, 10);
    return el.offsetWidth + margins;
  }

  @bind
  protected _onTransitionOver(): void {
    if (!this.transition || !this.placeholderSortable || !this.targetSortable) return;
    this._$placeholderEl.$host.classList.remove('esl-sortable-group-inserted');
    const itemClearInlineStyles = (el: HTMLElement): void => ESLSortableItem.get(el)?.clearInlineStyles();
    this.placeholderSortable.childrens?.forEach(itemClearInlineStyles);
    this.targetSortable.childrens?.forEach(itemClearInlineStyles);

    this.placeholderSortable.transition = false;
    this.targetSortable.transition = false;
  }

  @bind
  protected _onMouseUp(): void {
    document.removeEventListener('mousemove', this._onMouseMove);
    document.removeEventListener('mouseup', this._onMouseUp);
    if (!this._$cloneEl) return;

    if (this.animation === 'smooth' && this.targetSortable !== null) {
      afterNextRender(() => {
        const thisRect = this._$placeholderEl.parent!.getBoundingClientRect();
        const placeholderXPos = thisRect.left + this._$placeholderEl.pos.x;
        const placeholderYPos = thisRect.top + this._$placeholderEl.pos.y;
        this._$cloneEl.$host.style.transform  = `translate3d(${placeholderXPos}px, ${placeholderYPos}px, 0)`;
        this._$cloneEl.$host.style.transition = `transform ${this.transitionDuration}ms ease`;
      });

      setTimeout(() => {
        this.removeCloneElement();
      }, this.transitionDuration);
      return;
    }

    this.removeCloneElement();
  }

  private removeCloneElement(): void {
    document.body.removeChild(this._$cloneEl.$host);
    this._$placeholderEl.placeholder = false;
    this._$cloneEl = null!;
  }
}
