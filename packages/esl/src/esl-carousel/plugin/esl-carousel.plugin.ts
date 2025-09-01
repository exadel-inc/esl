import {ESLMixinElement} from '../../esl-mixin-element/core';
import {bind, ready, memoize, listen} from '../../esl-utils/decorators';
import {evaluate} from '../../esl-utils/misc/format';
import {ESLMediaRuleList} from '../../esl-media-query/core';
import {ESLCarousel} from '../core/esl-carousel';

/** Base mixin plugin of {@link ESLCarousel} */
export abstract class ESLCarouselPlugin<Config extends Record<string, any>> extends ESLMixinElement {
  /** Default configuration */
  protected static DEFAULT_CONFIG: Record<string, any> = {};
  /** Config key to be used if passed non object value */
  protected static DEFAULT_CONFIG_KEY: string = '';

  /** {@link ESLCarousel} host instance */
  public override $host: ESLCarousel;

  /** Plugin name, also an attribute name in the carousel configuration */
  public get name(): string {
    return (this.constructor as typeof ESLCarouselPlugin).is;
  }

  /** Plugin configuration attribute value */
  public get configValue(): string {
    const plugin = (this.constructor as typeof ESLCarouselPlugin);
    return this.$$attr(plugin.is) || '';
  }
  public set configValue(value: string) {
    const plugin = (this.constructor as typeof ESLCarouselPlugin);
    this.$$attr(plugin.is, value);
  }

  /** Plugin configuration query */
  @memoize()
  public get configQuery(): ESLMediaRuleList<Config | null> {
    return ESLMediaRuleList.parse(this.configValue, this.$host.media, this.parseConfig);
  }

  /** Active plugin configuration object */
  @memoize()
  public get config(): Config {
    const base = (this.constructor as typeof ESLCarouselPlugin).DEFAULT_CONFIG as Config;
    return Object.assign({}, base, this.configQuery.value || {});
  }

  /**
   * Parses plugin media query value term to the config object.
   * Provides the capability to pass a config a stringified non-strict JSON or as a string (mapped to single option configuration).
   *
   * Uses {@link ESLCarouselPlugin.DEFAULT_CONFIG_KEY} to map string value to the config object.
   */
  @bind
  protected parseConfig(value: string): Config | null {
    if (!value) return null;
    if (value.trim().startsWith('{')) return evaluate(value, {});
    const {DEFAULT_CONFIG_KEY} = (this.constructor as typeof ESLCarouselPlugin);
    return {[DEFAULT_CONFIG_KEY]: value} as Config;
  }

  @ready
  protected override connectedCallback(): void {
    const {$host} = this;
    if (($host as unknown) instanceof ESLCarousel) {
      super.connectedCallback();
      this.onInit();
    } else {
      const {is} = this.constructor as typeof ESLCarouselPlugin;
      console.warn('[ESL]: ESLCarousel %s plugin rejected for non correct target %o', is, $host);
      this.$host.removeAttribute(is);
    }
  }

  protected override attributeChangedCallback(attrName: string, oldValue: string | null, newValue: string | null): void {
    if (attrName === (this.constructor as typeof ESLCarouselPlugin).is) {
      memoize.clear(this, 'configQuery');
      this.$$on(this.onConfigChange);
      this.onConfigChange();
    }
  }

  /** Callback to be executed on plugin initialization */
  protected onInit(): void {
  }

  /** Callback to be executed on plugin configuration query change (attribute change) */
  @listen({event: 'change', target: ($this: ESLCarouselPlugin<any>) => $this.configQuery})
  protected onConfigChange(): void {
    memoize.clear(this, 'config');
  }

  /** Register mixin-plugin in ESLMixinRegistry */
  public static override register(): void {
    ESLCarousel.registered.then(() => super.register());
  }
}
