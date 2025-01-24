import {ESLMixinElement} from '../../esl-mixin-element/core';
import {ESLTraversingQuery} from '../../esl-traversing-query/core/esl-traversing-query';
import {attr, bind, listen, memoize} from '../../esl-utils/decorators';
import {ExportNs} from '../../esl-utils/environment/export-ns';
import {evaluate} from '../../esl-utils/misc/format';

import type {ESLMedia} from '../core/esl-media';

export interface ESLMediaControlConfig {
  target?: string;
  action?: 'play' | 'pause' | 'stop' | 'toggle';
  activeCls?: string;
}

@ExportNs('MediaControlMixin')
export class ESLMediaControlMixin extends ESLMixinElement {
  public static override is = 'esl-media-contol';

  public static readonly DEFAULT_CONFIG_KEY: string = 'target';

  public static readonly DEFAULT_CONFIG: ESLMediaControlConfig = {
    action: 'toggle',
  };

  @attr({name: ESLMediaControlMixin.is})
  public userConfig: string;

  @bind
  protected parseConfig(value: string): ESLMediaControlConfig | null {
    if (!value) return null;
    if (value.trim().startsWith('{')) return evaluate(value, {});
    const {DEFAULT_CONFIG_KEY} = (this.constructor as typeof ESLMediaControlMixin);
    return {[DEFAULT_CONFIG_KEY]: value} as ESLMediaControlConfig;
  }

  @memoize()
  protected get config(): ESLMediaControlConfig {
    return Object.assign({}, ESLMediaControlMixin.DEFAULT_CONFIG, this.parseConfig(this.userConfig) || {});
  }

  @memoize()
  public get $target(): ESLMedia | null {
    if (!this.config.target) return null;
    return ESLTraversingQuery.first(this.config.target, this.$host) as ESLMedia | null;
  }

  @listen('click')
  protected onClick(): void {
    const {$target, config} = this;
    if (!$target || !config.action) return;
    if (config.action in $target && typeof $target[config.action] === 'function') $target[config.action]();
  }

  @listen({
    event: 'esl:media:play esl:media:paused esl:media:ended',
    target: (control: ESLMediaControlMixin) => control.$target,
    condition: (control: ESLMediaControlMixin) => !!control.config.activeCls
  })
  protected onStateChange(e: CustomEvent): void {
    this.$$cls(this.config.activeCls!, e.type === 'esl:media:play');
  }
}

declare global {
  export interface ESLLibrary {
    MediaCOntrol: typeof ESLMediaControlMixin;
  }
}
