import {ESLBaseElement} from '@exadel/esl/modules/esl-base-element/core';
import {attr, boolAttr, decorate, listen, memoize} from '@exadel/esl/modules/esl-utils/decorators';
import {rafDecorator} from '@exadel/esl/modules//esl-utils/async';
import {ESLTraversingQuery} from '@exadel/esl/modules/esl-traversing-query/core';

/** Fun component like a game for checking popup positioning on edge cases */
export class ESLDemoPopupGame extends ESLBaseElement {
  static override is = 'esl-d-popup-game';

  /** Trigger selector */
  @attr() public trigger: string;
  /** Marker shows that element is in dragging mode */
  @boolAttr() public dragging = false;

  @memoize()
  get $trigger(): HTMLElement | undefined {
    if (this.trigger) return ESLTraversingQuery.first(this.trigger, this) as HTMLElement | undefined;
  }

  protected updateTriggerPosition(dX: number, dY: number): void {
    if (!this.$trigger) return;

    const limitX = this.clientWidth - this.$trigger.clientWidth;
    const limitY = this.clientHeight - this.$trigger.clientHeight;

    let x = parseInt(this.$trigger.style.left, 10) || 0;
    let y = parseInt(this.$trigger.style.top, 10) || 0;
    x += dX;
    y += dY;
    x = Math.max(0, Math.min(x, limitX));
    y = Math.max(0, Math.min(y, limitY));

    this.$trigger.style.top = `${y}px`;
    this.$trigger.style.left = `${x}px`;
  }

  @listen({event: 'mousedown'})
  protected _onDragStart(event: MouseEvent): void {
    this.dragging = true;
    this.$$on(this._onDragging);
    this.$$on(this._onDragStop);
    event.preventDefault();
  }

  @listen({auto: false, event: 'mouseup', target: () => document.body})
  protected _onDragStop(): void {
    this.dragging = false;
    this.$$off(this._onDragging);
    this.$$off(this._onDragStop);
  }

  @listen({auto: false, event: 'mousemove', target: () => document.body})
  @decorate(rafDecorator)
  protected _onDragging(event: MouseEvent): void {
    if (!this.dragging || !this.$trigger) return;

    const {movementX, movementY} = event;
    this.updateTriggerPosition(movementX, movementY);

    event.preventDefault();
  }

  @listen({event: 'wheel'})
  @decorate(rafDecorator)
  protected _onWheel(event: WheelEvent): void {
    if (!this.$trigger) return;

    let {deltaX, deltaY} = event;
    if (event.shiftKey) [deltaY, deltaX] = [deltaX, deltaY];
    const {clientWidth, clientHeight} = this;
    this.style.setProperty('--_width', `${clientWidth + deltaX / 10}px`);
    this.style.setProperty('--_height', `${clientHeight + deltaY / 10}px`);

    this.updateTriggerPosition(0, 0);

    event.preventDefault();
  }
}
