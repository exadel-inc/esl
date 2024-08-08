import {ExportNs} from '../../esl-utils/environment/export-ns';
import {ESLBaseElement} from '../../esl-base-element/core';
import {attr, decorate, listen, memoize, prop, ready} from '../../esl-utils/decorators';
import {debounce, microtask} from '../../esl-utils/async';
import {getViewportForEl} from '../../esl-utils/dom/scroll';
import {ESLEventUtils, ESLIntersectionTarget} from '../../esl-event-listener/core';

import type {DelegatedEvent, ESLIntersectionEvent} from '../../esl-event-listener/core';
import type {ESLAnchorData, ESLAnchornavRender} from './esl-anchornav-types';

/**
 * ESLSAnchornav
 * @author Dmytro Shovchko
 *
 * ESLAnchornav is a component that collects content anchors from the page and provides anchor navigation
 */
@ExportNs('Anchornav')
export class ESLAnchornav extends ESLBaseElement {
  public static override is = 'esl-anchornav';
  public static _renderers: Map<string, ESLAnchornavRender> = new Map();

  /** Default renderer for anchornav item */
  public static defaultRenderer: ESLAnchornavRender = (data: ESLAnchorData) => `<a class="esl-anchornav-item" href="#${data.id}">${data.title}</a>`;

  /** Gets renderer by name */
  public static getRenderer(name: string): ESLAnchornavRender {
    return this._renderers.get(name) || this.defaultRenderer;
  }

  /** Sets renderer */
  public static setRenderer(renderer: ESLAnchornavRender): void;
  public static setRenderer(name: string, renderer: ESLAnchornavRender): void;
  public static setRenderer(name: string | ESLAnchornavRender, renderer?: ESLAnchornavRender): void {
    if (typeof name !== 'string') return this.setRenderer('default', name);
    if (typeof name === 'string' && renderer) this._renderers.set(name, renderer);
  }

  @prop('esl:anchornav:request') public REQUEST_EVENT: string;
  @prop('esl:anchornav:activechanged') public ACTIVECHANGED_EVENT: string;
  @prop('esl:anchornav:update') public UPDATE_EVENT: string;
  @prop('[esl-anchor]') protected ANCHOR_SELECTOR: string;

  /** Item renderer which is used to build inner markup */
  @attr({defaultValue: 'default'}) public renderer: string;

  protected _active: ESLAnchorData;
  protected _anchors: ESLAnchorData[] = [];
  protected _offset: number;

  /** Active anchor */
  public get active(): ESLAnchorData {
    return this._active;
  }
  public set active(value: ESLAnchorData) {
    if (this._active === value) return;
    this._active = value;
    this._onActiveChange(value);
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

  /** Anchornav item renderer */
  protected get itemRenderer(): ESLAnchornavRender {
    return ESLAnchornav.getRenderer(this.renderer);
  }

  /** Anchornav item selector */
  protected get itemSelector(): string {
    return `.${this.baseTagName}-item`;
  }

  /** Anchornav items */
  protected get $items(): HTMLAnchorElement[] {
    return [...this.querySelectorAll<HTMLAnchorElement>(this.itemSelector)];
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
  protected get $viewport(): Element | null {
    return getViewportForEl(this);
  }

  @ready
  protected override connectedCallback(): void {
    super.connectedCallback();
    this.init();
  }

  /** Initializes the component */
  public init(): void {
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
    anchors[0] instanceof Element ? $itemsArea.replaceChildren(...anchors) : $itemsArea.innerHTML = anchors.join('');
  }

  /** Renders the component anchors list */
  protected renderAnchors(): (string | Element)[] {
    const {itemRenderer} = this;
    return this._anchors.map((item) => itemRenderer(item));
  }

  /** Gets anchor data from the anchor element */
  protected getDataFrom($anchor: HTMLElement, index: number): ESLAnchorData {
    return {
      id: $anchor.id,
      title: $anchor.title,
      index: `${index + 1}`,
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
      this.$items.forEach(($item) => {
        $item.classList.toggle('active', $item.getAttribute('href') === `#${active.id}`);
      });
      this.active = active;
    }
  }

  /** Handles changing the active anchor */
  @decorate(microtask)
  protected _onActiveChange(active: ESLAnchorData): void {
    const detail = {id: active.id};
    ESLEventUtils.dispatch(this, this.ACTIVECHANGED_EVENT, {detail});
  }

  /** Handles updating the component */
  @decorate(microtask)
  protected _onUpdateEvent(): void {
    ESLEventUtils.dispatch(this, this.UPDATE_EVENT);
  }

  @listen({
    event: (that: ESLAnchornav) => that.REQUEST_EVENT,
    target: document.body
  })
  protected _onAnchornavRequest(): void {
    this._anchors = [...document.querySelectorAll<HTMLElement>(this.ANCHOR_SELECTOR)].map(this.getDataFrom);
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
    selector: (that: ESLAnchornav) => that.itemSelector
  })
  protected _onAnchorClick(event: DelegatedEvent<MouseEvent>): void {
    this.updateActiveAnchor();
  }
}

declare global {
  export interface ESLLibrary {
    Anchornav: typeof ESLAnchornav;
  }
  export interface HTMLElementTagNameMap {
    'esl-anchornav': ESLAnchornav;
  }
}
