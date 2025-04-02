import {ESLMixinElement} from '../../esl-mixin-element/core';
import {bind, ready, memoize} from '../../esl-utils/decorators';
import {evaluate} from '../../esl-utils/misc/format';
import {ESLMediaRuleList} from '../../esl-media-query/core';
import {ESLCarousel} from '../core/esl-carousel';

/** Base mixin plugin of {@link ESLCarousel} */
export abstract class ESLCarouselPlugin<Config> extends ESLMixinElement {
  /** Config key to be used if passed non object value */
  protected static DEFAULT_CONFIG_KEY: string = '';

  /** {@link ESLCarousel} host instance */
  public override $host: ESLCarousel;

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
  public get config(): Config {
    return this.configQuery.value || {} as Config;
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
  protected override connectedCallback(): boolean | void {
    const {$host} = this;
    if (($host as unknown) instanceof ESLCarousel) {
      super.connectedCallback();
      return true;
    }
    const {is} = this.constructor as typeof ESLCarouselPlugin;
    console.warn('[ESL]: ESLCarousel %s plugin rejected for non correct target %o', is, $host);
    this.$host.removeAttribute(is);
    return false;
  }

  protected override attributeChangedCallback(attrName: string, oldValue: string | null, newValue: string | null): void {
    if (attrName === (this.constructor as typeof ESLCarouselPlugin).is) {
      memoize.clear(this, 'configQuery');
      this.onConfigChange();
    }
  }

  /** Callback to be executed on plugin configuration query change (attribute change) */
  protected onConfigChange(): void {}

  /** Register mixin-plugin in ESLMixinRegistry */
  public static override register(): void {
    ESLCarousel.registered.then(() => super.register());
  }
}
