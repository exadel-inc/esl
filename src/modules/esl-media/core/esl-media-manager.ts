import {ESLEventUtils} from '../../esl-event-listener/core/api';
import {isSafeContains} from '../../esl-utils/dom/traversing';
import {isVisible} from '../../esl-utils/dom/visible';
import {ExportNs} from '../../esl-utils/environment/export-ns';
import {listen, memoize} from '../../esl-utils/decorators';

import type {ESLMedia} from './esl-media';

/**
 * Manager for {@link ESLMedia}
 * Checks whether media can autoplay, stores all active instances and instances marked with `autoplay` attribute
 * Only one media from group can be played
 * @author Alexey Stsefanovich (ala'n), Yuliya Adamskaya
 */

let instance: ESLMediaManager;

@ExportNs('MediaManager')
export class ESLMediaManager {
  /** Media marked as autoplay */
  public instances: Set<ESLMedia> = new Set();
  /** Active media */
  public active: Set<ESLMedia> = new Set();

  @memoize()
  public static get instance(): ESLMediaManager {
    return new ESLMediaManager();
  }

  public constructor() {
    if (instance) return instance;
    ESLEventUtils.subscribe(this);
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    instance = this;
  }

  /** Checks whether media can automatically play */
  public canAutoplay(media: ESLMedia): boolean {
    return media.autoplay && media.autopaused;
  }

  public _onAddMedia(media: ESLMedia): void {
    this.instances.add(media);
  }

  public _onDeleteMedia(media: ESLMedia): void {
    this.instances.delete(media);
  }

  /** Add player to list */
  public _onAddActive(media: ESLMedia): void {
    this.active.add(media);
    this.active.forEach((player: ESLMedia) => {
      if (!media.group || !player.active || player === media) return;
      if (player.group !== media.group) return;
      if (player.$$fire(player.MANAGED_PAUSE_EVENT)) player.pause();
    });
  }

  /** Remove player from list */
  public _onDeleteActive(media: ESLMedia): void {
    this.active.delete(media);
  }

  /** Processes {@link ESLToggleable} show event and defines media than can automatically play */
  @listen({
    event: 'esl:show',
    target: window
  })
  public onContainerShow(e: Event): void {
    this.instances.forEach(($media: ESLMedia) => {
      if (!isSafeContains(e.target as Node, $media)) return;
      if (!isVisible($media, {visibility: true, viewport: $media.playInViewport})) return;
      if (this.canAutoplay($media)) $media.play();
    });
  }

  /** Processes {@link ESLToggleable} hide event and defines media that should be marked with `autopaused` marker before it pause */
  @listen({
    event: 'esl:hide',
    target: window
  })
  protected onContainerHide(e: Event): void {
    this.active.forEach((player: ESLMedia) => {
      if (!isSafeContains(e.target as Node, player) || !player.active) return;
      player.$$attr('autopaused', true);
      player.pause();
    });
  }
}

declare global {
  export interface ESLLibrary {
    ESLMediaManager: typeof ESLMediaManager;
  }
}
