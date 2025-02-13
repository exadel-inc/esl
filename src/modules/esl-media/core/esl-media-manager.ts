import {ESLEventUtils} from '../../esl-event-listener/core/api';
import {isSafeContains} from '../../esl-utils/dom/traversing';
import {isVisible} from '../../esl-utils/dom/visible';
import {ESLTraversingQuery} from '../../esl-traversing-query/core/esl-traversing-query';
import {ExportNs} from '../../esl-utils/environment/export-ns';
import {listen} from '../../esl-utils/decorators/listen';
import {memoize} from '../../esl-utils/decorators/memoize';

import type {ESLMedia} from './esl-media';
import type {ESLToggleable} from '../../esl-toggleable/core/esl-toggleable';

/**
 * Restriction manager for {@link ESLMedia}
 * Defines media that can play from active list
 * Only one media from group can be played
 * @author Alexey Stsefanovich (ala'n), Yuliya Adamskaya, Anastasiya Lesun
 */

@ExportNs('MediaRestrictionManager')
export class ESLMediaRestrictionManager {
  public active: Set<ESLMedia> = new Set();

  @memoize()
  public static get instance(): ESLMediaRestrictionManager {
    return new ESLMediaRestrictionManager();
  }

  public init(): void {
    ESLEventUtils.subscribe(this);
  }

  public canAutoplay(player: ESLMedia): boolean {
    return player.autoplay && player.autopaused;
  }

  /** Add player to list */
  public _onAddActiveMedia(instance: ESLMedia): void {
    this.active.add(instance);
    this.active.forEach((player: ESLMedia) => {
      if (!instance.group || !player.active || player === instance) return;
      if (player.group !== instance.group) return;
      if (player.$$fire(player.MANAGED_PAUSE_EVENT)) player.pause();
    });
  }

  /** Remove player from list */
  public _onDeleteInactiveMedia(instance: ESLMedia): void {
    this.active.delete(instance);
  }

  protected findAllMedia(target: ESLToggleable): ESLMedia[] {
    return ESLTraversingQuery.all('.esl-media', target, target) as ESLMedia[];
  }

  @listen({
    event: 'esl:show',
    target: window
  })
  public onContainerShow(e: Event): void {
    const {target} = e;
    const innerMedia = this.findAllMedia(target as ESLToggleable);
    if (innerMedia.length < 1) return;

    innerMedia.forEach(($media: ESLMedia) => {
      if (!isSafeContains(target as Node, $media)) return;
      if (!isVisible($media, {visibility: true, viewport: $media.playInViewport})) return;
      if (this.canAutoplay($media)) $media.play();
    });
  }

  @listen({
    event: 'esl:hide',
    target: window
  })
  protected onContainerHide(e: Event): void {
    const {target} = e;
    const innerMedia = this.findAllMedia(target as ESLToggleable);
    if (innerMedia.length < 1) return;

    this.active.forEach((player: ESLMedia) => {
      if (!innerMedia.includes(player) || !isSafeContains(target as Node, player) || !player.active) return;
      player.$$attr('autopaused', true);
      player.pause();
    });
  }
}

declare global {
  export interface ESLLibrary {
    ESLMediaRestrictionManager: typeof ESLMediaRestrictionManager;
  }
}
