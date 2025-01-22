import {ESLMixinElement} from '../../esl-mixin-element/core';
import {ESLTraversingQuery} from '../../esl-traversing-query/core/esl-traversing-query';
import {jsonAttr, listen, memoize} from '../../esl-utils/decorators';
import {ExportNs} from '../../esl-utils/environment/export-ns';

import type {ESLMedia} from '../core/esl-media';

export interface ESLMediaControlConfig {
  target?: string;
  action?: 'play' | 'pause' | 'stop' | 'toggle';
  activeCls?: string;
}

@ExportNs('MediaControlMixin')
export class ESLMediaControlMixin extends ESLMixinElement {
  public static override is = 'esl-media-contol';

  protected readonly actionMap: Record<string, () => Promise<void> | null | undefined> = {
    play: () => this.$target?.play(),
    pause: () => this.$target?.pause(),
    toggle: () => this.$target?.toggle(),
    stop: () => this.$target?.stop(),
  };

  public static defaultConfig: ESLMediaControlConfig = {
    action: 'toggle',
  };

  @jsonAttr({name: ESLMediaControlMixin.is})
  public userConfig?: ESLMediaControlConfig;

  @memoize()
  protected get config(): ESLMediaControlConfig {
    return Object.assign({}, ESLMediaControlMixin.defaultConfig, this.userConfig);
  }

  @memoize()
  public get $target(): ESLMedia | null {
    if (!this.config.target) return null;
    return ESLTraversingQuery.first(this.config.target, this.$host) as ESLMedia | null;
  }

  @listen('click')
  protected onClick(): void {
    const {$target, config, actionMap} = this;
    if (!$target || !config.action) return;

    const action = actionMap[config.action];
    if (action) action();
  }

  @listen({
    event: 'esl:media:play esl:media:paused esl:media:ended',
    target: (control: ESLMediaControlMixin) => control.$target
  })
  protected onPlay(e: Event): void {
    if (this.config.activeCls) this.$$cls(this.config.activeCls, e.type === 'esl:media:play');
  }
}

declare global {
  export interface ESLLibrary {
    MediaCOntrol: typeof ESLMediaControlMixin;
  }
}
