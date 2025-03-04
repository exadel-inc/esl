import {ESLMixinElement} from '../../esl-mixin-element/core';
import {ESLTraversingQuery} from '../../esl-traversing-query/core/esl-traversing-query';
import {listen, memoize} from '../../esl-utils/decorators';
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
  public static override is = 'esl-media-control';

  public static readonly DEFAULT_CONFIG: ESLMediaControlConfig = {
    action: 'toggle'
  };

  @memoize()
  public get config(): ESLMediaControlConfig {
    const attrVal = this.$$attr(ESLMediaControlMixin.is) || '{}';
    const userConfig = attrVal.trim().startsWith('{') ? evaluate(attrVal, {}) : {target: attrVal};
    return {...ESLMediaControlMixin.DEFAULT_CONFIG, ...userConfig};
  }

  public set config(value: string | ESLMediaControlConfig) {
    const serialized = typeof value === 'string' ? value : JSON.stringify(value);
    this.$$attr(ESLMediaControlMixin.is, serialized);
  }

  public get $target(): ESLMedia | null {
    if (!this.config.target) return null;
    return ESLTraversingQuery.first(this.config.target, this.$host) as ESLMedia | null;
  }

  protected override attributeChangedCallback(): void {
    memoize.clear(this, 'config');
    this.$$on(this.onStateChange);
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
    MediaControlMixin: typeof ESLMediaControlMixin;
  }
}
