import {ExportNs} from '../../esl-utils/environment/export-ns';
import {ESLMixinElement} from '../../esl-mixin-element/core';
import {listen, attr, ready} from '../../esl-utils/decorators';
import {ESLMediaQuery} from '../../esl-media-query/core';
import {ESLToggleable} from '../../esl-toggleable/core';

import type {ESLMediaChangeEvent} from '../../esl-media-query/core';

/**
 * ESLOpenState mixin element
 * @author Yuliya Adamskaya, Alexey Stsefanovich (ala'n)
 *
 * ESLOpenState is a custom mixin element that can be used with {@link ESLToggleable}s to request opening/closing it by the media query condition
 */
@ExportNs('OpenState')
export class ESLOpenState extends ESLMixinElement {
  static override is = 'esl-open-state';

  public override $host: ESLToggleable;

  /** Open state {@link ESLMediaQuery} condition from query string */
  @attr({name: ESLOpenState.is, parser: ESLMediaQuery.for}) public media: ESLMediaQuery;

  @ready
  protected override connectedCallback(): void {
    super.connectedCallback();
    ESLToggleable.registered.then(() => this.onMediaChange());
  }

  /** Handles query change and processes {@link ESLToggleable} toggle event in case query value is matched */
  @listen({event: 'change', target: ($this: ESLMediaChangeEvent) => $this.media})
  protected onMediaChange(event?: ESLMediaChangeEvent): void {
    this.$host.toggle(this.media.matches, {
      event,
      initiator: (this.constructor as typeof ESLOpenState).is,
      activator: this.$host
    });
  }
}
