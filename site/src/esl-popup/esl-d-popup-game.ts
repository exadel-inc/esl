import {ESLBaseElement} from '@exadel/esl/modules/esl-base-element/core';
import {ESLPopup} from '@exadel/esl/modules/esl-popup/core';
import {attr, boolAttr, listen, memoize} from '@exadel/esl/modules/esl-utils/decorators';
import {ESLResizeObserverTarget} from '@exadel/esl/modules/esl-utils/dom';
import {ESLTraversingQuery} from '@exadel/esl/modules/esl-traversing-query/core';

import type {Point} from '@exadel/esl/modules/esl-utils/dom';

/** Fun component like a game for checking popup positioning on edge cases */
export class ESLDemoPopupGame extends ESLBaseElement {
  static override is = 'esl-d-popup-game';

  protected currentCoords: Point;

  /** Trigger selector */
  @attr() public trigger: string;
  /** Marker shows that element is in dragging mode */
  @boolAttr() public dragging = false;

  @memoize()
  get $trigger(): HTMLElement | undefined {
    if (this.trigger) return ESLTraversingQuery.first(this.trigger, this) as HTMLElement | undefined;
  }

  protected override connectedCallback(): void {
    this.setTriggerDefaultPosition();
    super.connectedCallback();
  }

  protected setTriggerDefaultPosition(): void {
    const center = this.calculateCenter();
    this.updateTriggerPosition(center.x, center.y);
  }

  protected calculateCenter(): Point {
    return {x: this.clientWidth / 2, y: this.clientHeight / 2};
  }

  @listen({event: 'mousedown', target: ($this: any) => $this.$trigger})
  protected _onDragStart(event: MouseEvent): void {
    this.dragging = true;
    this.$$on(this._onDragging);
    this.$$on(this._onDragStop);
    event.preventDefault();
    this.currentCoords = {x: event.clientX, y: event.clientY};
  }

  @listen({auto: false, event: 'mousemove', target: window})
  protected _onDragging(event: MouseEvent): void {
    if (!this.dragging || !this.$trigger) return;
    const {clientX, clientY} = event;
    const dX = clientX - this.currentCoords.x;
    const dY = clientY - this.currentCoords.y;
    this.currentCoords = {x: clientX, y: clientY};
    this.updateTriggerPosition(dX, dY);

    event.preventDefault();
  }

  protected updateTriggerPosition(dX: number, dY: number): void {
    if (!this.$trigger) return;
    this.$$fire(ESLPopup.prototype.REFRESH_EVENT);
    const limitX = this.clientWidth - this.$trigger.clientWidth;
    const limitY = this.clientHeight - this.$trigger.clientHeight;

    let x = (parseInt(this.$trigger.style.left, 10) || 0) + dX;
    let y = (parseInt(this.$trigger.style.top, 10) || 0) + dY;
    x = Math.max(0, Math.min(x, limitX));
    y = Math.max(0, Math.min(y, limitY));

    this.$trigger.style.left = `${x}px`;
    this.$trigger.style.top = `${y}px`;
  }

  @listen({auto: false, event: 'mouseup', target: window})
  protected _onDragStop(): void {
    this.dragging = false;
    this.$$off(this._onDragging);
    this.$$off(this._onDragStop);
  }

  @listen({event: 'resize', target: ESLResizeObserverTarget.for})
  protected _onResize(): void {
    this.updateTriggerPosition(0, 0);
  }
}
