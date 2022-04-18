import {afterNextRender, bind, TraversingQuery} from '../../all';
import {ESLBaseElement, attr, boolAttr} from '../../esl-base-element/core';
import {ready} from '../../esl-utils/decorators/ready';
import {ExportNs} from '../../esl-utils/environment/export-ns';

@ExportNs('Sortable')
export class ESLSortable extends ESLBaseElement {
  public static is = 'esl-sortable';

  /**
   * Sets sortable children width to 100%
   */
  @boolAttr() public horizontal: boolean;

  /**
   * Animation type when dragged element returns to original position
   */
  @attr({defaultValue: '1'}) public animation: '1' | '2';

  /**
   * Children of sortables with identical group attribute vslue can be transfered between each other
   */
  @attr() public group: string;

  /**
   * Duration of recalculation transition
   */
  @attr({defaultValue: '150'}) public duration: number;

  /** Inner state */
  private _transition: boolean;

  /** X and Y values of dragged copied element */
  private cloneXPos: number;
  private cloneYPos: number;

  /** X and Y values of element that was copied*/
  private placeholderXPos: number;
  private placeholderYPos: number;

  /** Sortable to which active element was dragged and will be added to */
  private targetSortable: ESLSortable = this;

  /** Sortable from which active element was dragged and will be deleted from */
  private originSortable: ESLSortable = this;

  /** Clone of the element */
  private _$cloneElement: HTMLElement;

  /** Element that is targeted to insert next to */
  private _$targetElement: HTMLElement;

  /** Original element which is copied */
  private _$placeholderElement: HTMLElement;

  @ready
  protected connectedCallback(): void {
    this.bindEvents();
    super.connectedCallback();
  }

  @ready
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
    if (this.transition || this._$cloneElement) return;
    document.addEventListener('mousemove', this._onMouseMove);
    document.addEventListener('mouseup', this._onMouseUp);
  }

  @bind
  protected _onMouseMove(e: MouseEvent): void {
    if (!this._$cloneElement) {
      this.addElementClone(e);
      return;
    }

    this.recalculateClonePosition(e);
    this._onItemMove(e);
  }

  private recalculateClonePosition(e: MouseEvent): void {
    this._$cloneElement.style.transform = `translate3d(${this.cloneXPos + e.x}px, ${this.cloneYPos + e.y}px,0)`;
  }

  private addElementClone(e: any): void {
    if (!TraversingQuery.first('::parent', e.target)?.classList.contains('esl-sortable')) {
      return;
    }
    this._$cloneElement = e.target.cloneNode(true) as HTMLElement;
    this._$placeholderElement = e.target;
    this._$placeholderElement.classList.add('esl-sortable-placeholder');
    this.placeholderXPos = this._$placeholderElement.offsetLeft;
    this.placeholderYPos = this._$placeholderElement.offsetTop;

    const placeholderRect = this._$placeholderElement.getBoundingClientRect();
    this.cloneXPos = placeholderRect.x - e.x;
    this.cloneYPos = placeholderRect.y - e.y;

    this._$cloneElement.classList.add('esl-sortable-drag');
    this._$cloneElement.style.height = `${this._$placeholderElement.offsetHeight}px`;
    this._$cloneElement.style.width = `${this._$placeholderElement.offsetWidth}px`;
    document.body.appendChild(this._$cloneElement);
    this.recalculateClonePosition(e);

    // Target and origin sortables are originally assigned as this in case if element was dragged and returned to original position
    this.targetSortable = this;
    this.originSortable = this;
  }

  protected _onItemMove(e: any): void {
    if (this.targetSortable?.transition || this.originSortable?.transition) return;

    this._$targetElement = document.elementsFromPoint(e.x, e.y)[1] as any;
    if (this.isSortableEmpty()) {
      this._$targetElement.classList.add('esl-sortable-empty');
      this.setTarget();
      return;
    }

    if (!this._$targetElement?.parentElement?.classList.contains('esl-sortable') ||
        this._$targetElement.classList.contains('esl-sortable-drag') ||
        this._$targetElement.classList.contains('esl-sortable-placeholder')) {
      return;
    }
    this.setTarget();
  }

  private setTarget(): void {
    this._$targetElement.classList.add('esl-sortable-target');
    this.fireInsertEvents();
  }

  private fireInsertEvents(): void {
    const targetParent = (this.isSortableEmpty() ? this._$targetElement :  this._$targetElement.parentNode) as ESLSortable;
    const placeholderParent = this._$placeholderElement.parentNode as ESLSortable;
    if (this._$targetElement.parentNode !== this && targetParent?.getAttribute('group') !== this.group) return;

    placeholderParent.$$fire('sortable:insert', {detail: [this._$targetElement, this._$placeholderElement]});

    // Fired when element was dragged from one sortable to another
    if (placeholderParent !== targetParent) {
      targetParent.$$fire('sortable:insert', {detail: [this._$targetElement, this._$placeholderElement]});
    }
  }

  /** Checks if sortable is empty and from the same group */
  private isSortableEmpty(): boolean {
    return this._$targetElement?.classList.contains('esl-sortable') &&
    this._$targetElement?.getAttribute('group') === this.group &&
    this._$targetElement.children.length === 0;
  }

  @bind
  protected _onInsert(e: any): void {
    this._$targetElement = e.detail[0];
    this._$placeholderElement = e.detail[1];
    this.targetSortable = e.detail[0].parentElement.classList.contains('esl-sortable') ? e.detail[0].parentElement : e.detail[0];
    this.originSortable = e.detail[1].parentElement;
    this.insertChild();
  }

  /** Inner state */
  public get transition(): boolean {
    return this._transition;
  }
  public set transition(value: boolean) {
    this.toggleAttribute('transition', this._transition = value);
  }
  /** Method recalculates sortable's children position two times: before and after element insert */
  private insertChild(): void {
    this.targetSortable.transition = true;
    this.originSortable.transition = true;

    this.positionItems();
    afterNextRender(() => {
      if (this._$targetElement) this._$targetElement.classList.remove('esl-sortable-target');
      // Necessary if element was transfered from one sortable to another
      if (this._$placeholderElement.classList.contains('esl-sortable-group-inserted')) {
        this.positionItems(true);
        return;
      }

      if (this.targetSortable.classList.contains('esl-sortable-empty')) {
        this.targetSortable.classList.remove('esl-sortable-empty');
        this.targetSortable.appendChild(this._$placeholderElement);
      } else {
        this._$targetElement.insertAdjacentElement(this.toInsertBefore() ? 'afterend' : 'beforebegin', this._$placeholderElement);
      }
      this._$placeholderElement.classList.add('esl-sortable-group-inserted');
      this.positionItems(true);
    });
  }

  /** Checks if element has to be inserted before or after target element */
  private toInsertBefore(): boolean {
    const targetIndex = [...this.children].indexOf(this._$targetElement);
    const placeholderIndex = [...this.children].indexOf(this._$placeholderElement);
    return targetIndex > placeholderIndex && this.targetSortable === this.originSortable;
  }

  /** Sets sortable's children position to absolute and manually calculates each element position */
  private positionItems(isInserted: boolean = false): void {
    let rowHeight = 0;
    let leftValue = 0;
    let topValue = 0;

    [...this.children].forEach((el: any) => {
      el.style.position = 'absolute';

      const elementFitsRow = leftValue + el.offsetWidth + parseInt(window.getComputedStyle(el).marginLeft, 10) < this.offsetWidth;
      if (!elementFitsRow) {
        leftValue = 0;
        topValue += rowHeight;
        rowHeight = el.offsetHeight;
      }

      el.style.left = `${leftValue}px`;
      el.style.top = `${topValue}px`;

      if (el === this._$placeholderElement) {
        this.placeholderXPos = leftValue;
        this.placeholderYPos = topValue;
      }

      rowHeight = this.outerHeight(el) > rowHeight ? this.outerHeight(el) : rowHeight;
      leftValue += this.outerWidth(el);
      if (isInserted) return;

      if (this.animation === '1' && el === this._$placeholderElement && (this._$placeholderElement.parentNode !== this._$targetElement.parentNode)) {
        el.style.transition = `opacity ${this.duration}ms ease`;
      } else {
        el.style.transition = `left ${this.duration}ms ease, top ${this.duration}ms ease`;
      }
    });
    this.style.height = `${topValue + rowHeight}px`;
    this.style.transition = `height ${this.duration}ms ease`;
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
  private _onTransitionOver(): void {
    if (!this.transition || !this.originSortable || !this.targetSortable) return;

    this._$placeholderElement.classList.remove('esl-sortable-group-inserted');

    [...this.originSortable.children]?.forEach((el: any) => this.removeInlineStyles(el));
    [...this.targetSortable.children]?.forEach((el: any) => this.removeInlineStyles(el));

    this.originSortable.transition = false;
    this.targetSortable.transition = false;
    this.targetSortable = null as any;
    this.originSortable = null as any;
  }

  @bind
  protected _onMouseUp(): void {
    document.removeEventListener('mousemove', this._onMouseMove);
    document.removeEventListener('mouseup', this._onMouseUp);
    if (!this._$cloneElement || !this._$targetElement) return;

    if (this.animation === '2' && this.originSortable !== null) {
      afterNextRender(() => {
        const thisRect = this.targetSortable.getBoundingClientRect();
        this._$cloneElement.style.transform  = `translate3d(${thisRect.left + this.placeholderXPos}px, ${thisRect.top + this.placeholderYPos}px, 0)`;
        this._$cloneElement.style.transition = `transform ${this.duration}ms ease`;
      });

      setTimeout(() => {
        this.removeCloneElement();
      }, this.duration);
      return;
    }

    this.removeCloneElement();
  }

  protected removeCloneElement(): void {
    document.body.removeChild(this._$cloneElement);
    this._$placeholderElement.classList.remove('esl-sortable-placeholder');
    this._$cloneElement = null as any;
  }

  private removeInlineStyles(targetElement: HTMLElement): void {
    targetElement.style.position = '';
    targetElement.style.top = '';
    targetElement.style.height = '';
    targetElement.style.width = '';
    targetElement.style.left = '';
    targetElement.style.transition = '';
  }
}
