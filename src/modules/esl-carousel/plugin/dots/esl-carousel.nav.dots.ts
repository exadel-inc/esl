import {ExportNs} from '../../../esl-utils/environment/export-ns';
import {format} from '../../../esl-utils/misc/format';
import {ARROW_LEFT, ARROW_RIGHT} from '../../../esl-utils/dom/keys';
import {attr, listen, memoize, prop, ready} from '../../../esl-utils/decorators';
import {ESLBaseElement} from '../../../esl-base-element/core';
import {ESLTraversingQuery} from '../../../esl-traversing-query/core';

import {indexToGroup} from '../../core/esl-carousel.utils';
import {ESLCarouselChangeEvent, ESLCarouselSlideEvent} from '../../core/esl-carousel.events';

import type {ESLCarousel} from '../../core/esl-carousel';
import type {DelegatedEvent} from '../../../esl-event-listener/core/types';

/** Function to generate dot element. Note it's not aware of actual carousel state, so it cannot be used to add dynamic attributes */
export type ESLCarouselNavDotBuilder = (index: number, $dots: ESLCarouselNavDots) => HTMLElement;
/** Function to update dot element upon carousel state changes */
export type ESLCarouselNavDotUpdater = ($dot: HTMLElement, index: number, $dots: ESLCarouselNavDots) => void;

/**
 * {@link ESLCarousel} Dots navigation element
 *
 * Example:
 * ```
 * <esl-carousel-dots></esl-carousel-dots>
 * ```
 */
@ExportNs('Carousel.Dots')
export class ESLCarouselNavDots extends ESLBaseElement {
  public static override is = 'esl-carousel-dots';
  public static observedAttributes = ['target'];

  public static DEFAULT_ARIA_LABEL = 'Carousel dots';

  /** Default dot template implementation (readonly) */
  public static defaultDotBuilder(index: number, {tabIndex, dotLabelFormat, targetID}: ESLCarouselNavDots): HTMLElement {
    const dot = document.createElement('button');
    dot.className = 'esl-carousel-dot';
    dot.setAttribute('role', 'tab');
    dot.setAttribute('tabindex', tabIndex >= 0 ? '-1' : '0');
    dot.setAttribute('aria-label', format(dotLabelFormat, {index: index + 1}));
    dot.setAttribute('aria-controls', targetID);
    return dot;
  }
  /** Default dot updater implementation (readonly)*/
  public static defaultDotUpdater($dot: HTMLElement, index: number, {activeIndex}: ESLCarouselNavDots): void {
    const isActive = index === activeIndex;
    $dot.toggleAttribute('active', isActive);
    $dot.setAttribute('aria-selected', String(isActive));
    $dot.setAttribute('aria-current', String(isActive));
  }

  /** Default dots builder function {@link ESLCarouselNavDotBuilder} */
  public static dotBuilder: ESLCarouselNavDotBuilder = ESLCarouselNavDots.defaultDotBuilder;
  /** Default dots updater function {@link ESLCarouselNavDotUpdater} */
  public static dotUpdater: ESLCarouselNavDotUpdater = ESLCarouselNavDots.defaultDotUpdater;

  /** {@link ESLTraversingQuery} string to find {@link ESLCarousel} instance */
  @attr({
    name: 'target',
    defaultValue: '::parent(.esl-carousel-nav-container)::find(esl-carousel)'
  })
  public carousel: string;

  /** Label format (supports `index` key) */
  @attr({defaultValue: ($this: ESLCarouselNavDots) => `Go to slide ${$this.groupSize > 1  ? 'group ' : ''}{index}`})
  public dotLabelFormat: string;

  /** Dots builder function {@link ESLCarouselNavDotBuilder} */
  @prop(($this: ESLCarouselNavDots) => ($this.constructor as typeof ESLCarouselNavDots).dotBuilder)
  public dotBuilder: ESLCarouselNavDotBuilder;

  /** Dots updater function {@link ESLCarouselNavDotUpdater} */
  @prop(($this: ESLCarouselNavDots) => ($this.constructor as typeof ESLCarouselNavDots).dotUpdater)
  public dotUpdater: ESLCarouselNavDotUpdater;

  // TODO: implement in future
  // /** Use arrow keys to navigate */
  // @attr({defaultValue: true, parser: parseBoolean})
  // public keyboardArrows: boolean;

  /**
   * Dots number according carousel config.
   * Will be 0 if carousel does not require dots (carousel incomplete).
   * (Note: memoization used during update stage)
   */
  @memoize()
  public get count(): number {
    if (!this.$carousel?.renderer) return 0;
    const {count, size} = this.$carousel.state;
    const value = Math.ceil(size / count);
    return value > 1 ? value : 0;
  }

  /** Active dot index according to carousel config. (Note: memoization used during update stage) */
  @memoize()
  public get activeIndex(): number {
    if (!this.$carousel?.renderer) return 0;
    const {activeIndex, count, size} = this.$carousel.state;
    return indexToGroup(activeIndex, count, size);
  }

  /** Previous dot index (cycled) */
  public get prevIndex(): number {
    return this.activeIndex > 0 ? this.activeIndex - 1 : this.count - 1;
  }
  /** Next dot index (cycled) */
  public get nextIndex(): number {
    return this.activeIndex < this.count - 1 ? this.activeIndex + 1 : 0;
  }

  /** Returns amount of slides associated with one group(dot) */
  public get groupSize(): number {
    return this.$carousel?.state.count || 0;
  }

  /** Current dots collection */
  @memoize()
  public get $dots(): HTMLElement[] {
    return [...this.querySelectorAll('[esl-carousel-dot]')] as HTMLElement[];
  }

  /** @returns ESLCarousel instance; based on {@link carousel} attribute */
  @memoize()
  public get $carousel(): ESLCarousel | null {
    return ESLTraversingQuery.first(this.carousel, this) as ESLCarousel;
  }

  /** @returns accessible target ID */
  public get targetID(): string {
    return this.$carousel?.id || '';
  }

  @ready
  public override connectedCallback(): void {
    super.connectedCallback();
    this.replaceChildren();
    this.update();
    this.updateA11y();
  }

  public override disconnectedCallback(): void {
    super.disconnectedCallback();
    memoize.clear(this, '$carousel');
  }

  public override attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
    if (!this.connected) return;
    if (name === 'target') {
      memoize.clear(this, '$carousel');
      this.$$on(this._onSlideChange);
    }
    this.update(true);
    this.updateA11y();
  }

  /** Updates dots state, rebuilds dots if needed */
  public update(force?: boolean): void {
    memoize.clear(this, ['count', 'activeIndex']); // invalidate state memoization
    if (force || this.$dots.length !== this.count) {
      const $dots = new Array(this.count).fill(null).map((_, index) => this.dotBuilder(index, this));
      // Attribute `esl-carousel-dot` is necessary for proper work of ESLCarouselNavDots plugin, we do not relay on customizable dotBuilder(including default)
      $dots.forEach(($dot, index) => $dot.setAttribute('esl-carousel-dot', String(index)));
      memoize.clear(this, '$dots');
      this.replaceChildren(...$dots);
    }
    this.$dots.forEach(($dot, index) => this.dotUpdater($dot, index, this));
  }

  /** Updates a11y of `ESLCarouselNavDots` as a container */
  protected updateA11y(): void {
    this.$$attr('role', 'tablist');
    if (!this.hasAttribute('aria-label')) {
      this.$$attr('aria-label', ESLCarouselNavDots.DEFAULT_ARIA_LABEL);
    }
  }

  /** Handles carousel state changes */
  @listen({
    event: `${ESLCarouselSlideEvent.AFTER} ${ESLCarouselChangeEvent.TYPE}`,
    target: ($el: ESLCarouselNavDots) => $el.$carousel
  })
  protected _onSlideChange(e: Event): void {
    if (this.$carousel === e.target) this.update();
  }

  /** Handles `click` on the dots */
  @listen({event: 'click', selector: '[esl-carousel-dot]'})
  protected _onClick(event: DelegatedEvent<PointerEvent>): void {
    if (!this.$carousel || typeof this.$carousel.goTo !== 'function') return;
    const $btn = event.$delegate as HTMLElement;
    const target = $btn.getAttribute('esl-carousel-dot') || '';
    this.$carousel.goTo(`group:${+target}`);
    (this.tabIndex >= 0 ? this : $btn).focus({preventScroll: true});
  }

  /** Handles `keydown` event */
  @listen('keydown')
  protected _onKeydown(event: KeyboardEvent): void {
    if (ARROW_LEFT === event.key) {
      this.$dots[this.prevIndex]?.click();
    }
    if (ARROW_RIGHT === event.key) {
      this.$dots[this.nextIndex]?.click();
    }
  }
}

declare global {
  export interface ESLCarouselNS {
    Dots: typeof ESLCarouselNavDots;
  }
  export interface HTMLElementTagNameMap {
    'esl-carousel-dots': ESLCarouselNavDots;
  }
}
