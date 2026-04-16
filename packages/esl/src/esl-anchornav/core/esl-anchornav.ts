import {ExportNs} from '../../esl-utils/environment/export-ns';
import {ESLBaseElement} from '../../esl-base-element/core';
import {attr, decorate, listen, memoize, prop, ready} from '../../esl-utils/decorators';
import {debounce, microtask} from '../../esl-utils/async';
import {getViewportForEl} from '../../esl-utils/dom/scroll';
import {htmlToElement} from '../../esl-utils/dom/api';
import {CSSClassUtils} from '../../esl-utils/dom/class';
import {ESLEventUtils, ESLIntersectionTarget} from '../../esl-event-listener/core';
import {ESLAnchor} from './esl-anchor';
import {buildHierarchyByLevel} from './esl-anchornav.hierarchy';

import type {DelegatedEvent, ESLIntersectionEvent} from '../../esl-event-listener/core';
import type {ESLAnchornavHierarchyBuilder} from './esl-anchornav.hierarchy';

/** {@link ESLAnchornav} item renderer */
export type ESLAnchornavRender = (data: ESLAnchorData, index: number, anchornav: ESLAnchornav) => string | Element;

/** {@link ESLAnchornav} anchor data interface */
export interface ESLAnchorData {
  id: string;
  title: string;
  $anchor: HTMLElement;
  level?: number;
  parent?: string | null;
  children?: ESLAnchorData[];
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
  public static _hierarchyBuilders: Map<string, ESLAnchornavHierarchyBuilder> = new Map();

  /** Gets renderer by name */
  public static getRenderer(name: string): ESLAnchornavRender | undefined {
    return this._renderers.get(name);
  }

  /** Sets renderer */
  public static setRenderer(renderer: ESLAnchornavRender): void;
  public static setRenderer(name: string, renderer: ESLAnchornavRender): void;
  public static setRenderer(name: string | ESLAnchornavRender, renderer?: ESLAnchornavRender): void {
    if (typeof name !== 'string') return this.setRenderer('default', name);
    if (renderer) this._renderers.set(name, renderer);
  }

  /** Gets hierarchy builder by name */
  public static getHierarchyBuilder(name: string): ESLAnchornavHierarchyBuilder | undefined {
    return this._hierarchyBuilders.get(name);
  }

  /** Sets hierarchy builder */
  public static setHierarchyBuilder(builder: ESLAnchornavHierarchyBuilder): void;
  public static setHierarchyBuilder(name: string, builder: ESLAnchornavHierarchyBuilder): void;
  public static setHierarchyBuilder(name: string | ESLAnchornavHierarchyBuilder, builder?: ESLAnchornavHierarchyBuilder): void {
    if (typeof name !== 'string') return this.setHierarchyBuilder('level', name);
    if (builder) this._hierarchyBuilders.set(name, builder);
  }

  @prop('esl:anchornav:activechanged') public ACTIVECHANGED_EVENT: string;
  @prop('esl:anchornav:updated') public UPDATED_EVENT: string;
  @prop([0, 0.01, 0.99, 1]) protected INTERSECTION_THRESHOLD: number[];

  /** Item renderer which is used to build inner markup */
  @attr({defaultValue: 'default', name: 'renderer'}) public rendererName: string;
  /** CSS classes to set on active item */
  @attr({defaultValue: 'active'}) public activeClass: string;
  /** Selector (ESLTraversingQuery) to find anchor elements */
  @attr({defaultValue: `[${ESLAnchor.is}]`}) public anchorSelector: string;
  /** Grouping mode for building hierarchy: 'level' to group by data-level attribute, empty string for flat list */
  @attr({defaultValue: ''}) public groupBy: string;

  protected _active: ESLAnchorData;
  protected _anchors: ESLAnchorData[] = [];
  protected _flatAnchors: ESLAnchorData[] = [];
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

  /** Anchors list (flattened for intersection observation) */
  protected get $anchors(): HTMLElement[] {
    return this._flatAnchors.map(({$anchor}) => $anchor);
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

  /** Permanent anchors to prepend to the list */
  protected get anchorsToPrepend(): ESLAnchorData[] {
    return [];
  }

  /** Permanent anchors to append to the list */
  protected get anchorsToAppend(): ESLAnchorData[] {
    return [];
  }

  /**
   * Finds anchor elements.
   * Uses {@link ESLTraversingQuery} syntax via {@link ESLBaseElement.$$findAll}.
   */
  protected findAnchors(): HTMLElement[] {
    return this.$$findAll(this.anchorSelector) as HTMLElement[];
  }

  @ready
  protected override connectedCallback(): void {
    super.connectedCallback();
    this.update();
  }

  /**
   * Updates the component.
   * Performs a full refresh cycle: recollects anchors list and updates the UI state.
   * Use this method when the set/order of anchors may have changed.
   */
  public update(): void {
    const flatAnchors = this.findAnchors().map(this.getDataFrom);
    flatAnchors.unshift(...this.anchorsToPrepend);
    flatAnchors.push(...this.anchorsToAppend);

    this._anchors = this.buildHierarchy(flatAnchors);
    this._flatAnchors = this.flattenAnchors(this._anchors);

    memoize.clear(this, '$viewport');
    this.rerender();
    this.$$attr('empty', this._anchors.length === 0);
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

  /** Renders the component anchors list */
  protected renderAnchors(): Element[] {
    this._items.clear();
    return this._anchors.map((anchor, index) => this.renderItem(anchor, index));
  }

  /**
   * Renders a single anchor item using the specified or default renderer.
   * Registers the rendered element in the internal items map.
   * Use this method when rendering nested items to ensure proper registration.
   * @param data - anchor data to render
   * @param index - anchor index (optional)
   * @param renderer - custom renderer function (optional, uses rendererName by default)
   * @returns rendered element
   */
  public renderItem(data: ESLAnchorData, index?: number, renderer?: ESLAnchornavRender): Element {
    const itemRenderer = renderer || ESLAnchornav.getRenderer(this.rendererName);
    if (!itemRenderer) throw new Error(`[ESLAnchornav] Renderer "${this.rendererName}" not found`);

    const item = htmlToElement(itemRenderer(data, index ?? 0, this));
    this._items.set(data.id, item);
    return item;
  }

  /** Gets anchor data from the anchor element */
  protected getDataFrom($anchor: HTMLElement, index: number): ESLAnchorData {
    return {
      id: $anchor.id,
      title: $anchor.title,
      $anchor
    };
  }

  /**
   * Builds hierarchy from flat anchors list based on groupBy mode.
   * Override this method to implement custom hierarchy logic.
   * @param flatAnchors - flat list of anchors in DOM order
   * @returns hierarchical anchors list (roots only) or flat list if groupBy is empty
   */
  protected buildHierarchy(flatAnchors: ESLAnchorData[]): ESLAnchorData[] {
    if (!this.groupBy) return flatAnchors;

    const builder = ESLAnchornav.getHierarchyBuilder(this.groupBy);
    if (!builder) {
      console.warn(`[ESLAnchornav] Unknown groupBy mode: "${this.groupBy}". Using flat list.`);
      return flatAnchors;
    }

    return builder(flatAnchors);
  }

  /**
   * Flattens hierarchical anchors list to a flat array in depth-first order.
   * @param anchors - hierarchical anchors list
   * @returns flat list of all anchors
   */
  protected flattenAnchors(anchors: ESLAnchorData[]): ESLAnchorData[] {
    const result: ESLAnchorData[] = [];
    for (const anchor of anchors) {
      result.push(anchor);
      if (anchor.children?.length) {
        result.push(...this.flattenAnchors(anchor.children));
      }
    }
    return result;
  }

  /** Gets initial active anchor */
  protected getInitialActive(): ESLAnchorData {
    return this._flatAnchors[0];
  }

  /** Updates the active anchor */
  @decorate(debounce, 50)
  protected updateActiveAnchor(): void {
    let active: ESLAnchorData = this.getInitialActive();
    const topBoundary = (this.$viewport ? this.$viewport.getBoundingClientRect().y : 0) + this.offset + 1;

    // Use flat anchors in DOM order for proper active detection
    this._flatAnchors.forEach((item) => {
      const {y} = item.$anchor.getBoundingClientRect();
      if (y <= topBoundary) active = item;
    });

    if (active) {
      this.updateActiveClasses(active);
      this.active = active;
    }
  }

  /**
   * Updates active classes on navigation items.
   * Resets all active classes and sets the active class on the current item.
   * Override this method to implement custom active state logic (e.g., parent activation).
   * @param active - the active anchor
   */
  protected updateActiveClasses(active: ESLAnchorData): void {
    this._items.forEach(($item, id) => {
      CSSClassUtils.toggle($item, this.activeClass, id === active.id);
    });
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
    this.update();
  }

  @listen({
    event: 'intersects',
    target: (that: ESLAnchornav) => ESLIntersectionTarget.for(that.$anchors, {
      root: that.$viewport,
      threshold: that.INTERSECTION_THRESHOLD,
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
ESLAnchornav.setHierarchyBuilder('level', buildHierarchyByLevel);

declare global {
  export interface ESLLibrary {
    Anchornav: typeof ESLAnchornav;
  }
  export interface HTMLElementTagNameMap {
    'esl-anchornav': ESLAnchornav;
  }
}
