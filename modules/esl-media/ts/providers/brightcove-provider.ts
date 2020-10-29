/**
 * Brightcove API provider for {@link ESLMedia}
 * @version 1.3.0
 * @author Julia Murashko
 * @extends BaseProvider
 * @protected
 */
import {VideoJsPlayer} from 'video.js';

import {loadScript} from '../../../esl-utils/dom/script';
import {ESLMedia} from '../esl-media';
import {BaseProvider, PlayerStates} from '../esl-media-provider';
import ESLMediaProviderRegistry from '../esl-media-registry';
import {generateUId} from '../../../esl-utils/misc/uid';

const API_SCRIPT_ID = 'BC_API_SOURCE';

export interface BCPlayerAccount {
  playerId: string | null;
  accountId: string | null;
}

export class BrightcoveProvider extends BaseProvider<HTMLVideoElement | HTMLDivElement> {
  static get providerName() {
    return 'brightcove';
  }

  static readonly providerRegexp = /(?:http(?:s)?:\/\/)(?:www\.)?players.brightcove/;
  static readonly idParam = 'videoId';

  static parseURL(url: string) {
    if (this.providerRegexp.test(url)) {
      try {
        const id = new URL(url).searchParams.get(this.idParam) || null;
        return id ? {mediaId: id} : null;
      } catch {
        return null;
      }
    }
    return null;
  }

  protected videojsClasses = 'video-js vjs-default-skin video-js-brightcove';

  protected _api: VideoJsPlayer;
  protected _account: BCPlayerAccount;

  /**
   * @returns {BCPlayerAccount} settings, get from element by default
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
    const el = document.createElement('video');
    el.id = 'esl-media-brightcove-' + generateUId();
    el.className = 'esl-media-inner esl-media-brightcove ' + this.videojsClasses;
    el.title = this.config.title;
    el.loop = this.config.loop;
    el.muted = this.config.muted;
    el.controls = this.config.controls;
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
  protected $$fromEvent(eventName: string) {
    if (!this._api) return Promise.reject();
    return new Promise((resolve, reject) => this._api ? this._api.one(eventName, resolve) : reject());
  }

  /**
   * Executes as soon as api script detected or loaded.
   * @returns {Promise<VideoJsPlayer>} - promise with provided API
   */
  protected onAPILoaded(): Promise<VideoJsPlayer> {
    if (typeof window.bc !== 'function' || typeof window.videojs !== 'function') {
      throw new Error('Brightcove API is not in the global scope');
    }
    window.bc(this._el);
    this._api = window.videojs(this._el);
    return new Promise((resolve, reject) => this._api ? this._api.ready(resolve) : reject());
  }

  /**
   * Executes after API ready state resolved
   * Basic onAPIReady should be called to subscribe to API state
   * @returns {Promise | void}
   */
  protected onAPIReady() {
    // Set autoplay though js because BC is unresponsive while processing it natively
    this._api.autoplay(this.config.autoplay);

    this._api.on('play', () => this.component._onPlay());
    this._api.on('pause', () => this.component._onPaused());
    this._api.on('ended', () => this.component._onEnded());
    this.component._onReady();

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

  public onConfigChange(cfgParam: string, newVal: string) {

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
    this._api.pause();
    this._api.currentTime(0);
  }
}

ESLMediaProviderRegistry.register(BrightcoveProvider, BrightcoveProvider.providerName);

// typings
declare global {
  interface Window {
    bc?: (el: HTMLElement, ...args: any[]) => any;
    videojs?: (el: HTMLElement, ...args: any[]) => VideoJsPlayer;
  }
}
