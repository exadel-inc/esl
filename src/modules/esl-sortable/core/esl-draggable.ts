import {ESLBaseElement, listen} from '../../esl-base-element/core';
import {bind} from '../../esl-utils/all';

import type {ESLSortable} from './esl-sortable';

export interface DraggbleConfig {
  activator: HTMLElement;
  something: ESLSortable;
  event: MouseEvent;
}

export interface ESLSortableInsertDetail {
  target: HTMLElement;
  activator: HTMLElement;
  order: InsertPosition;
  draggable?: ESLDraggable;
  height?: number;
}

export class ESLDraggable extends ESLBaseElement {
  static is = 'esl-draggable';
  protected delay: number;
  public activator: HTMLElement | null;
  public something: ESLSortable;

  protected _rect: any;

  public connectedCallback(): void {
    this.style.height = `${this.activator?.offsetHeight}px`;
    this.style.width = `${this.activator?.offsetWidth}px`;

    this.bindEvents();
  }

  @bind
  protected bindEvents(): void {
    this.$$on(this._onMouseMove);
    this.$$on(this._onMouseUp);
  }

  // @listen({auto: false, event: 'pointermove', target: (that: any) => that.something})
  @listen({auto: false, event: 'pointermove'})
  protected _onMouseMove(e: PointerEvent): void {
    this.updatePosition(e);
    this.findTarget(e);
  }

  @bind
  protected updatePosition(e: MouseEvent): any {
    this.style.transform = `translate3d(${this._rect.x + e.x}px, ${this._rect.y + e.y}px, 0)`;
  }

  // @listen({auto: false, event: 'pointerup', target: (that: any) => that.something})
  @listen({auto: false, event: 'pointerup'})
  protected _onMouseUp(): void {
    const rect = this.activator?.getBoundingClientRect();
    this.style.transform  = `translate3d(${rect!.x}px, ${rect!.y}px, 0)`;
    this.style.transition = `transform ${this.delay}ms ease`;

    this.addEventListener('transitionend', () => {
      (this.activator as any).removeAttribute('placeholder');
      this.removeEL();
    });
  }

  protected removeEL(): any {
    this.remove();
  }

  @bind
  protected findTarget(e: MouseEvent): void {
    if (this.activator!.hasAttribute('transition')) return;
    const eventTargets = document.elementsFromPoint(e.x, e.y);
    const sortables = eventTargets.filter((el) => el.tagName.toLowerCase() === 'esl-sortable') as ESLSortable[];
    if (!sortables.length || this.something.group !== sortables[0].group) return;
    const target = eventTargets.filter((el) => el.hasAttribute('esl-sortable-item')) as HTMLElement[];
    if (!target.length || target[0].hasAttribute('placeholder')) return;

    const order = (sortables[0].$items.indexOf(target[0]) < sortables[0].$items.indexOf(this.activator as any) ? 'beforebegin' : 'afterend');
    // if (e.movementY <= 0 && order === 'afterend' || e.movementY >= 0 && order === 'beforebegin') return;

    /*
      TODO:
        - mousemovement;
        - rethink group targeting (esl-sortable-target + sortable-plugin);
        - incorrect animation;
    */

    this.activator!.setAttribute('transition', '');
    this.something.$$fire('esl:sortable:remove', {detail: {target: this.something, activator: this.activator, order}});
    sortables[0].$$fire('esl:sortable:insert', {detail: {target: target[0], activator: this.activator, order, height: this.offsetHeight}});
  }

  static build(params: DraggbleConfig): any {
    const draggable = document.createElement(ESLDraggable.is) as ESLDraggable;
    const clone = params.activator.cloneNode(true) as HTMLElement;
    clone.removeAttribute('esl-sortable-item');
    draggable.appendChild(clone);

    draggable.activator = params.activator;
    draggable.something = params.something;
    draggable.delay = params.something.delay;

    const rect = params.activator.getBoundingClientRect();
    draggable._rect = {x: rect.x - params.event.x, y: rect.y - params.event.y};
    draggable.updatePosition(params.event);

    document.body.appendChild(draggable);
    return draggable;
  }
}
