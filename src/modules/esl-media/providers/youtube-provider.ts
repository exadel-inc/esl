import {loadScript} from '../../esl-utils/dom/script';
import {BaseProvider, PlayerStates} from '../core/esl-media-provider';
import {generateUId} from '../../esl-utils/misc/uid';
import PlayerVars = YT.PlayerVars;

import type {MediaProviderConfig, ProviderObservedParams} from '../core/esl-media-provider';

const DEFAULT_ASPECT_RATIO = 16 / 9;

/**
 * Youtube API provider for {@link ESLMedia}
 * @author Alexey Stsefanovich (ala'n), Yuliya Adamskaya
 */
@BaseProvider.register
export class YouTubeProvider extends BaseProvider {
  static readonly providerName: string = 'youtube';
  static readonly idRegexp = /(?:v\/|v=|vi=|vi\/|e\/|embed\/|user\/.*\/u\/\d+\/)([_0-9a-zA-Z-]+)/i;
  static readonly providerRegexp = /^\s*(?:http(?:s)?:\/\/)?(?:www\.)?(?:youtu\.be|youtube(-nocookie)?\.com)/i;

  protected _el: HTMLDivElement | HTMLIFrameElement;
  protected _api: YT.Player;

  static parseUrl(url: string) {
    if (this.providerRegexp.test(url)) {
      const [, id] = url.match(this.idRegexp) || [];
      return id ? {mediaId: id} : null;
    }
    return null;
  }

  private static _coreApiPromise: Promise<void>;
  protected static getCoreApi() {
    if (!YouTubeProvider._coreApiPromise) {
      YouTubeProvider._coreApiPromise = new Promise((resolve) => {
        if (window.YT && window.YT.Player) return resolve(window.YT);
        loadScript('YT_API_SOURCE', '//www.youtube.com/iframe_api');
        const cbOrigin = window.onYouTubeIframeAPIReady;
        window.onYouTubeIframeAPIReady = () => {
          try {
            (typeof cbOrigin === 'function') && cbOrigin.apply(window);
          } catch (err) { // eslint-disable-line
            // Do Nothing
          }
          return resolve(window.YT);
        };
      });
    }
    return YouTubeProvider._coreApiPromise;
  }

  protected static mapOptions(cfg: MediaProviderConfig): PlayerVars {
    return {
      enablejsapi: 1,
      origin: location.origin,
      rel: 0,
      showinfo: 0,
      iv_load_policy: 0, // eslint-disable-line
      autoplay: Number(cfg.autoplay),
      controls: Number(cfg.controls),
      playsinline: Number(cfg.playsinline),
      disablekb: Number(!cfg.controls), // TODO: criteria
      autohide: Number(!cfg.controls) // TODO: criteria
    };
  }

  protected static buildIframe(sm: MediaProviderConfig) {
    const el = document.createElement('div');
    el.id = 'esl-media-yt-' + generateUId();
    el.className = 'esl-media-inner esl-media-youtube';
    el.title = sm.title;
    el.setAttribute('aria-label', el.title);
    el.setAttribute('frameborder', '0');
    el.setAttribute('tabindex', '0');
    el.setAttribute('allowfullscreen', 'yes');
    return el;
  }

  public bind() {
    this._el = YouTubeProvider.buildIframe(this.config);
    this.component.appendChild(this._el);
    this._ready = YouTubeProvider.getCoreApi()
      .then(() => this.onCoreApiReady())
      .then(() => this.onPlayerReady())
      .catch((e) => this.component._onError(e));
  }

  /** Init YT.Player on target element */
  protected onCoreApiReady() {
    return new Promise((resolve, reject) => {
      console.debug('[ESL]: Media Youtube Player initialization for ', this);
      this._api = new YT.Player(this._el.id, {
        videoId: this.config.mediaId,
        events: {
          onError: (e) => reject(e),
          onReady: () => resolve(this),
          onStateChange: (e) => this._onStateChange(e)
        },
        playerVars: YouTubeProvider.mapOptions(this.config)
      });
    });
  }
  /** Post YT.Player init actions */
  protected onPlayerReady() {
    console.debug('[ESL]: Media Youtube Player ready ', this);
    this._el = this._api.getIframe();
      if (this.config.muted) {
      this._api.mute();
    }
    this.component._onReady();
  }

  public unbind() {
    this.component._onDetach();
    this._api && this._api.destroy();
    super.unbind();
  }

  private _onStateChange(event: YT.OnStateChangeEvent) {
    switch (+event.data) {
      case PlayerStates.PLAYING:
        this.component._onPlay();
        break;
      case PlayerStates.PAUSED:
        this.component._onPaused();
        break;
      case PlayerStates.ENDED:
        if (this.config.loop) {
          this._api.playVideo();
        } else {
          this.component._onEnded();
        }
        break;
    }
  }

  protected onConfigChange(param: ProviderObservedParams, value: boolean) {
    super.onConfigChange(param, value);
    if (param === 'muted') {
      value ? this._api.mute() : this._api.unMute();
    }
  }

  public focus() {
    if (this._el instanceof HTMLIFrameElement && this._el.contentWindow) {
      this._el.contentWindow.focus();
    }
  }

  public get state() {
    if (this._api && typeof this._api.getPlayerState === 'function') {
      return this._api.getPlayerState() as number as PlayerStates;
    }
    return PlayerStates.UNINITIALIZED;
  }

  public get duration() {
    return this._api ? this._api.getDuration() : 0;
  }

  public get currentTime() {
    return this._api ? this._api.getCurrentTime() : 0;
  }

  public get defaultAspectRatio(): number {
    return DEFAULT_ASPECT_RATIO;
  }

  public seekTo(pos: number) {
    this._api.seekTo(pos, false);
  }

  public play() {
    if (this.state === PlayerStates.ENDED) {
      this._api.seekTo(0, false);
    }
    this._api.playVideo();
  }

  public pause() {
    this._api.pauseVideo();
  }

  public stop() {
    this._api.stopVideo();
  }
}

// typings
declare global {
  interface YT extends Promise<void> {
    Player: YT.Player,
  }

  interface Window {
    YT?: YT;
    onYouTubeIframeAPIReady?: () => void;
  }
}
