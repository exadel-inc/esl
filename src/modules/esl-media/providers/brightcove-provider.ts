/**
 * Brightcove API provider for {@link ESLMedia}
 * @version 1.0.0-alpha
 * @author Julia Murashko
 */
import {loadScript} from '../../esl-utils/dom/script';
import {ESLMedia} from '../core/esl-media';
import {BaseProvider, ProviderObservedParams, PlayerStates} from '../core/esl-media-provider';
import {generateUId} from '../../esl-utils/misc/uid';

import type {VideoJsPlayer} from 'video.js';

const API_SCRIPT_ID = 'BC_API_SOURCE';

export interface BCPlayerAccount {
  playerId: string | null;
  accountId: string | null;
}

@BaseProvider.register
export class BrightcoveProvider extends BaseProvider {
  static readonly providerName: string = 'brightcove';

  protected videojsClasses = 'video-js vjs-default-skin video-js-brightcove';

  protected _api: VideoJsPlayer;
  protected _account: BCPlayerAccount;
  protected _autoplay: boolean;

  /**
   * @returns settings, get from element by default
   */
  protected static getAccount(el: ESLMedia): BCPlayerAccount {
    return {
      playerId: el.getAttribute('player-id'),
      accountId: el.getAttribute('player-account')
    };
  }

  /**
   * Loads player API according defined settings
   * */
  protected static loadAPI(account: BCPlayerAccount): Promise<Event> {
    const apiSrc =
      `//players.brightcove.net/${account.accountId}/${account.playerId}_default/index.min.js`;
    const apiScript = document.getElementById(API_SCRIPT_ID);
    if (apiScript && apiScript.parentNode && apiScript.getAttribute('src') !== apiSrc) {
      apiScript.parentNode.removeChild(apiScript);
    }
    return loadScript(API_SCRIPT_ID, apiSrc);
  }

  /**
   * Build video brightcove element
   */
  protected buildVideo() {
    const el = document.createElement('video-js');
    el.id = 'esl-media-brightcove-' + generateUId();
    el.className = 'esl-media-inner esl-media-brightcove ' + this.videojsClasses;
    el.title = this.config.title;
    el.toggleAttribute('loop', this.config.loop);
    el.toggleAttribute('muted', this.config.muted);
    el.toggleAttribute('controls', this.config.controls);
    el.setAttribute('aria-label', el.title);
    el.setAttribute('data-embed', 'default');
    el.setAttribute('data-video-id', `ref:${this.config.mediaId}`);
    el.toggleAttribute('playsinline', this.config.playsinline);
    this._account.playerId && el.setAttribute('data-player', this._account.playerId);
    this._account.accountId && el.setAttribute('data-account', this._account.accountId);
    return el;
  }

  /**
   * Utility method to convert api event to promise
   */
  protected $$fromEvent(eventName: string): Promise<void> {
    if (!this._api) return Promise.reject();
    return new Promise((resolve, reject) => this._api ? this._api.one(eventName, resolve) : reject());
  }

  /**
   * Executes as soon as api script detected or loaded.
   * @returns {Promise<VideoJsPlayer>} - promise with provided API
   */
  protected onAPILoaded(): Promise<void> | void {
    if (typeof window.bc !== 'function' || typeof window.videojs !== 'function') {
      throw new Error('Brightcove API is not in the global scope');
    }
    console.debug('ESL Media: Brightcove API init for ', this);
    this._api = window.bc(this._el);
    return new Promise((resolve, reject) => this._api ? this._api.ready(resolve) : reject());
  }

  /**
   * Executes after API ready state resolved
   * Basic onAPIReady should be called to subscribe to API state
   * @returns {Promise | void}
   */
  protected onAPIReady(): Promise<void> | void {
    console.debug('ESL Media: Brightcove API is ready ', this);
    // Set autoplay though js because BC is unresponsive while processing it natively
    this._api.autoplay(this._autoplay || this.config.autoplay);

    // Listeners to control player state
    this._api.on('play', () => this.component._onPlay());
    this._api.on('pause', () => this.component._onPaused());
    this._api.on('ended', () => this.component._onEnded());
    this.component._onReady();

    // Can handle query only when loadedmetadata have happened
    return this.$$fromEvent('loadedmetadata');
  }

  public bind() {
    const Provider = (this.constructor as typeof BrightcoveProvider);
    this._account = Provider.getAccount(this.component);
    this._el = this.buildVideo();
    this.component.appendChild(this._el);

    this._ready = Provider.loadAPI(this._account)
      .then(() => this.onAPILoaded())
      .then(() => this.onAPIReady())
      .catch((e) => this.component._onError(e));
  }

  public unbind() {
    this.component._onDetach();
    this._api && this._api.dispose();
    super.unbind();
  }

  protected onConfigChange(param: ProviderObservedParams, value: boolean) {
    super.onConfigChange(param, value);
    if (typeof this._api[param] === 'function') {
      this._api[param](value);
    }
  }

  public focus() {
    this._api && this._api.focus();
  }

  public get state() {
    if (this._api) {
      if (this._api.ended()) return PlayerStates.ENDED;
      if (this._api.paused()) return PlayerStates.PAUSED;
      if (!this._api.played()) return PlayerStates.UNSTARTED;
      return PlayerStates.PLAYING;
    }
    return PlayerStates.UNINITIALIZED;
  }

  public get defaultAspectRatio(): number {
    if (!this._api) return 0;
    return this._api.videoWidth() / this._api.videoHeight();
  }

  public get currentTime() {
    return this._api ? this._api.currentTime() : 0;
  }

  public get duration() {
    return this._api ? this._api.duration() : 0;
  }

  public seekTo(pos: number) {
    this._api.currentTime(pos);
  }

  public play() {
    this._api.play();
  }

  public pause() {
    this._api.pause();
  }

  public stop() {
    this._api.currentTime(0);
    this._api.pause();
  }

  // Overrides to set tech autoplay marker
  public safePlay() {
    this._autoplay = true;
    return super.safePlay();
  }
  public safeStop() {
    this._autoplay = true;
    return super.safeStop();
  }
}

// root typing
declare global {
  interface Window {
    bc?: (el: HTMLElement, ...args: any[]) => VideoJsPlayer;
  }
}
