import {ESLEventUtils} from '../../esl-event-listener/core/api';
import {isSafeContains} from '../../esl-utils/dom/traversing';
import {isVisible} from '../../esl-utils/dom/visible';
import {ExportNs} from '../../esl-utils/environment/export-ns';
import {listen} from '../../esl-utils/decorators';

import type {ESLMedia} from './esl-media';

/**
 * Manager for {@link ESLMedia}
 * Checks whether media should play inside ESLToggleable container,
 * stores all active instances and instances marked with `autoplay` attribute
 * Restrict that only one media from the group can be played
 *
 * @author Anastasia Lesun
 */
@ExportNs('MediaManager')
export class ESLMediaManager {
  /** Media marked as autoplay */
  public autoplayable: Set<ESLMedia> = new Set();
  /** Active media */
  public active: Set<ESLMedia> = new Set();

  public constructor() {
    ESLEventUtils.subscribe(this);
  }

  /** Hook for {@link ESLMedia} initialization */
  public _onInit(media: ESLMedia): void {
    if (media.autoplay) this.autoplayable.add(media);
  }

  /** Hook for {@link ESLMedia} destroy */
  public _onDestroy(media: ESLMedia): void {
    this.autoplayable.delete(media);
  }

  /** Hook for {@link ESLMedia} which is started to play */
  public _onAfterPlay(media: ESLMedia): void {
    this.active.add(media);
    this.active.forEach((player: ESLMedia) => {
      if (!media.group || !player.active || player === media) return;
      if (player.group !== media.group) return;
      if (player.$$fire(player.MANAGED_PAUSE_EVENT)) player.pause();
    });
  }

  /** Hook for {@link ESLMedia} which has been paused */
  public _onAfterPause(media: ESLMedia): void {
    this.active.delete(media);
  }

  /**
   * Processes {@link ESLToggleable} show event and resumes all media inside.
   * @see {@link ESLMediaManager#releaseAll}
   */
  @listen({event: 'esl:show', target: window})
  public _onContainerShow(e: Event): void {
    this.releaseAll(e.target as Element);
  }

  /**
   * Processes {@link ESLToggleable} hide event and systemically suspend all media instances inside.
   * @see {@link ESLMediaManager#suspendAll}
   */
  @listen({event: 'esl:hide', target: window})
  protected _onContainerHide(e: Event): void {
    this.suspendAll(e.target as Element);
  }

  /** Plays all system-stopped media with autoplay marker */
  protected releaseAll(scope: Element = document.body): void {
    this.autoplayable.forEach(($media: ESLMedia) => {
      if (!isSafeContains(scope, $media)) return;
      if (!isVisible($media, {visibility: true, viewport: $media.playInViewport})) return;
      if (!$media.played || $media.autopaused) $media.play(false, true);
    });
  }

  /** Pauses all active media (using system flow, which means they could be restarted) */
  protected suspendAll(scope: Element = document.body): void {
    this.active.forEach((player: ESLMedia) => {
      if (!isSafeContains(scope, player) || !player.active) return;
      player.pause(true);
    });
  }

  /** Processes request to play/pause media */
  @listen({event: 'esl:media:managedaction', target: window})
  protected _onRequest(e: CustomEvent): void {
    switch (e.detail.action) {
      case 'release':
        this.releaseAll(e.detail.scope);
        break;
      case 'suspend':
        this.suspendAll(e.detail.scope);
        break;
    }
  }
}

declare global {
  export interface ESLLibrary {
    ESLMediaManager: typeof ESLMediaManager;
  }
}
