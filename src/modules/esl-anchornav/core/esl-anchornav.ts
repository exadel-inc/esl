import {ExportNs} from '../../esl-utils/environment/export-ns';
import {ESLBaseElement} from '../../esl-base-element/core';
import {attr, decorate, listen, memoize, prop, ready} from '../../esl-utils/decorators';
import {debounce, microtask} from '../../esl-utils/async';
import {getViewportForEl} from '../../esl-utils/dom/scroll';
import {ESLEventUtils, ESLIntersectionTarget} from '../../esl-event-listener/core';
import {ESLAnchor} from './esl-anchor';

import type {DelegatedEvent, ESLIntersectionEvent} from '../../esl-event-listener/core';

/** {@link ESLAnchornav} item renderer */
export type ESLAnchornavRender = (data: ESLAnchorData, index: number, anchrnav: ESLAnchornav) => string | Element;

/** {@link ESLAnchornav} anchor data interface */
export interface ESLAnchorData {
  id: string;
  title: string;
  $anchor: HTMLElement;
}

/**
 * ESLAnchornav
 * @author Dmytro Shovchko
 *
 * ESLAnchornav is a component that collects content anchors from the page and provides anchor navigation
 */
@ExportNs('Anchornav')
export class ESLAnchornav extends ESLBaseElement {
  public static override is = 'esl-anchornav';
  public static _renderers: Map<string, ESLAnchornavRender> = new Map();

  /** Gets renderer by name */
  public static getRenderer(name: string): ESLAnchornavRender | undefined {
    return this._renderers.get(name);
  }

  /** Sets renderer */
  public static setRenderer(renderer: ESLAnchornavRender): void;
  public static setRenderer(name: string, renderer: ESLAnchornavRender): void;
  public static setRenderer(name: string | ESLAnchornavRender, renderer?: ESLAnchornavRender): void {
    if (typeof name !== 'string') return this.setRenderer('default', name);
    if (typeof name === 'string' && renderer) this._renderers.set(name, renderer);
  }

  @prop('esl:anchornav:activechanged') public ACTIVECHANGED_EVENT: string;
  @prop('esl:anchornav:updated') public UPDATED_EVENT: string;
  @prop('[esl-anchor]') protected ANCHOR_SELECTOR: string;

  /** Item renderer which is used to build inner markup */
  @attr({defaultValue: 'default', name: 'renderer'}) public rendererName: string;

  protected _active: ESLAnchorData;
  protected _anchors: ESLAnchorData[] = [];
  protected _items: Map<string, Element> = new Map();
  protected _offset: number;

  /** Active anchor */
  public get active(): ESLAnchorData {
    return this._active;
  }
  public set active(value: ESLAnchorData) {
    if (this._active === value) return;
    this._active = value;
    this._onActiveChange();
  }

  /** Anchors list */
  protected get $anchors(): HTMLElement[] {
    return this._anchors.map(({$anchor}) => $anchor);
  }

  /** Anchornav offset */
  public get offset(): number {
    return this._offset || 0;
  }
  public set offset(value: number) {
    if (this._offset === value) return;
    this._offset = value;
    memoize.clear(this, '$viewport');
    this.$$on(this._onAnchorIntersection);
  }

  /** Anchornav items container */
  @memoize()
  protected get $itemsArea(): HTMLElement {
    const $provided = this.querySelector<HTMLElement>(`[${this.baseTagName}-items]`);
    if ($provided) return $provided;
    const $container = document.createElement('div');
    $container.setAttribute(this.baseTagName + '-items', '');
    this.appendChild($container);
    return $container;
  }

  /** Anchornav viewport (root element for IntersectionObservers checking visibility) */
  @memoize()
  protected get $viewport(): Element | undefined {
    return getViewportForEl(this);
  }

  /** Data for prepend anchor */
  protected get prependData(): ESLAnchorData[] {
    return [];
  }

  /** Data for append anchor */
  protected get appependData(): ESLAnchorData[] {
    return [];
  }

  @ready
  protected override connectedCallback(): void {
    super.connectedCallback();
    this._onAnchornavRequest();
  }

  /** Updates the component */
  public update(): void {
    memoize.clear(this, '$viewport');
    this.rerender();
    this.$$on(this._onAnchorIntersection);
    this.updateActiveAnchor();
    this._onUpdateEvent();
  }

  /** Builds the component anchors list markup */
  protected rerender(): void {
    const {$itemsArea} = this;
    const anchors = this.renderAnchors();
    $itemsArea.replaceChildren(...anchors);
  }

  // TODO: move to esl-utils helpers
  /** Converts html string to Element */
  protected htmlToElement(html: string): Element {
    return (new DOMParser()).parseFromString(html, 'text/html').body.children[0];
  }

  /** Renders the component anchors list */
  protected renderAnchors(): Element[] {
    const itemRenderer = ESLAnchornav.getRenderer(this.rendererName);
    this._items.clear();
    return itemRenderer ? this._anchors.map((anchor, index) => {
      let item = itemRenderer(anchor, index, this);
      if (typeof item === 'string') item = this.htmlToElement(item);
      this._items.set(anchor.id, item);
      return item;
    }) : [];
  }

  /** Gets anchor data from the anchor element */
  protected getDataFrom($anchor: HTMLElement, index: number): ESLAnchorData {
    return {
      id: $anchor.id,
      title: $anchor.title,
      $anchor
    };
  }

  /** Gets initial active anchor */
  protected getInitialActive(): ESLAnchorData {
    return this._anchors[0];
  }

  /** Updates the active anchor */
  @decorate(debounce, 50)
  protected updateActiveAnchor(): void {
    let active: ESLAnchorData = this.getInitialActive();
    const topBoundary = (this.$viewport ? this.$viewport.getBoundingClientRect().y : 0) + this.offset + 1;
    this._anchors.forEach((item) => {
      const {y} = item.$anchor.getBoundingClientRect();
      if (y <= topBoundary) active = item;
    });
    if (active) {
      this._items.forEach(($item, id) => $item.classList.toggle('active', id === active.id));
      this.active = active;
    }
  }

  /** Handles changing the active anchor */
  @decorate(microtask)
  protected _onActiveChange(): void {
    const detail = {id: this.active.id};
    ESLEventUtils.dispatch(this, this.ACTIVECHANGED_EVENT, {detail});
  }

  /** Handles updating the component */
  @decorate(microtask)
  protected _onUpdateEvent(): void {
    ESLEventUtils.dispatch(this, this.UPDATED_EVENT);
  }

  @listen({
    event: ESLAnchor.prototype.CHANGE_EVENT,
    target: document.body
  })
  protected _onAnchornavRequest(): void {
    this._anchors = [...document.querySelectorAll<HTMLElement>(this.ANCHOR_SELECTOR)].map(this.getDataFrom);
    this._anchors.unshift(...this.prependData);
    this._anchors.push(...this.appependData);
    this.update();
  }

  @listen({
    event: 'intersects',
    target: (that: ESLAnchornav) => ESLIntersectionTarget.for(that.$anchors, {
      root: that.$viewport,
      threshold: [0, 0.01, 0.99, 1],
      rootMargin: `-${that.offset + 1}px 0px 0px 0px`
    })
  })
  protected _onAnchorIntersection(e: ESLIntersectionEvent): void {
    this.updateActiveAnchor();
  }

  @listen({
    event: 'click',
    selector: 'a'
  })
  protected _onAnchorClick(event: DelegatedEvent<MouseEvent>): void {
    this.updateActiveAnchor();
  }
}

ESLAnchornav.setRenderer((data: ESLAnchorData) => `<a class="esl-anchornav-item" href="#${data.id}">${data.title}</a>`);

declare global {
  export interface ESLLibrary {
    Anchornav: typeof ESLAnchornav;
  }
  export interface HTMLElementTagNameMap {
    'esl-anchornav': ESLAnchornav;
  }
}
