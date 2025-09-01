import {ESLEventUtils} from '../../esl-event-listener/core/api';
import {isSafeContains} from '../../esl-utils/dom/traversing';
import {isVisible} from '../../esl-utils/dom/visible';
import {listen} from '../../esl-utils/decorators';
import {ESLMediaHookEvent} from './esl-media.events';

import type {ESLMedia} from './esl-media';

/**
 * Manager for {@link ESLMedia}
 * Checks whether media should play inside ESLToggleable container,
 * stores all active instances and instances marked with `autoplay` attribute
 * Restrict that only one media from the group can be played
 *
 * @author Anastasia Lesun
 */
export class ESLMediaManager {
  /** All managed instances */
  public instances: Set<ESLMedia> = new Set();

  /** Active instances */
  public get active(): ESLMedia[] {
    return Array.from(this.instances).filter((player: ESLMedia) => player.active);
  }

  /** Instances with autoplay marker */
  public get autoplayable(): ESLMedia[] {
    return Array.from(this.instances).filter((player: ESLMedia) => player.autoplay);
  }

  public constructor() {
    ESLEventUtils.subscribe(this);
  }

  /** Hook for {@link ESLMedia} initialization */
  public _onInit(media: ESLMedia): void {
    this.instances.add(media);
  }

  /** Hook for {@link ESLMedia} destroy */
  public _onDestroy(media: ESLMedia): void {
    this.instances.delete(media);
  }

  /** Hook for {@link ESLMedia} which is started to play */
  public _onAfterPlay(media: ESLMedia): void {
    this.active.forEach((player: ESLMedia) => {
      if (player === media) return;
      if (!media.group || player.group !== media.group) return;
      const event = new ESLMediaHookEvent(player.MANAGED_PAUSE_EVENT, {
        initiator: 'system',
        relatedMedia: media
      });
      if (player.dispatchEvent(event)) player.pause(true);
    });
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

  /**
   * Starts all system-stopped media with autoplay marker
   * @param scope - the scope to search for media
   * @param system - whether to start only system-stopped media
   */
  protected releaseAll(scope: Element = document.body, system = true): void {
    this.autoplayable.forEach(($media: ESLMedia) => {
      if (system && $media.isUserInitiated) return;
      if (!$media.autoplay) return;
      if (!isSafeContains(scope, $media)) return;
      if (!isVisible($media, {visibility: true, viewport: !!$media.playInViewport})) return;
      $media.play(false, true);
    });
  }

  /**
   * Pauses all active media that was not started manually
   * @param scope - the scope to search for media
   * @param system - whether to pause only system-active media
   */
  protected suspendAll(scope: Element = document.body, system = true): void {
    // Pause all instances (to notify an inner player about the pause)
    // Note: Chrome may try to play automatically paused video even if it in paused state
    this.instances.forEach(($media: ESLMedia) => {
      if (system && $media.isUserInitiated) return;
      if (!isSafeContains(scope, $media)) return;
      $media.pause(true);
    });
  }

  /** Processes request to play/pause media */
  @listen({event: 'esl:media:managedaction', target: window})
  protected _onRequest(e: CustomEvent): void {
    switch (e.detail.action) {
      case 'release':
        this.releaseAll(e.detail.scope, !e.detail.force);
        break;
      case 'suspend':
        this.suspendAll(e.detail.scope, !e.detail.force);
        break;
    }
  }
}

declare global {
  export interface ESLLibrary {
    ESLMediaManager: typeof ESLMediaManager;
  }
}
