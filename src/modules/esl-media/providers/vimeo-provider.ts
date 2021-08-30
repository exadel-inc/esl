import axios from 'axios';

import {BaseProvider, PlayerStates} from '../core/esl-media-provider';
import {randUID} from '../../esl-utils/misc/uid';
import {loadScript} from '../../esl-utils/dom/script';
import {memoize, tryUntil} from '../../esl-utils/all';

import type {Player, Options, Error} from  '@vimeo/player';
import type {MediaProviderConfig, ProviderObservedParams} from '../core/esl-media-provider';
import type {ESLMedia} from '../core/esl-media';


@BaseProvider.register
export class VimeoProvider extends BaseProvider {
  constructor(component: ESLMedia, config: MediaProviderConfig){
    super(component, config);
    this.config = config;
    this.component = component;
  }
  static readonly providerName: string = 'vimeo';

  static readonly providerRegexp = /(http|https)?:\/\/(www\.|player\.)?vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/([^/]*)\/videos\/|video\/|)(\d+)(?:|\/\?)/i;

  protected _el: HTMLDivElement | HTMLIFrameElement;
  protected _api: Player;
  protected _state: PlayerStates;
  protected _duration: number;
  protected _lastCurrentTime: number = 0;
  protected _defaultAspectRatio: number;
  protected _startData: number = 0;


  // static async parseUrl(url: string) {
  //   const match = url.match(this.providerRegexp);
  //   if (!match) return null;
  //   const mediaId = [].pop.call(match);
  //   const {data} = await axios.get(`https://vimeo.com/api/oembed.json?url=${url}`);
  //   url = 'https://player.vimeo.com/video/' + mediaId;
  //   console.log(data);
  //   return isNaN(mediaId) ? null : {mediaId};
  // }

  static parseUrl(url: string) {
    const match = url.match(this.providerRegexp);
    if (!match) return null;
    const mediaId = [].pop.call(match);
    return isNaN(mediaId) ? null : {mediaId};
  }

  @memoize()
  protected static loadAPI(): any{
    return  loadScript('VIMEO_API_SOURCE', 'https://player.vimeo.com/api/player.js');
  }

  protected static mapOptions(cfg: MediaProviderConfig, component: ESLMedia): Options {
    const options: Options ={};
    if(cfg.mediaId) options.id = +cfg.mediaId;
    Object.assign(options, cfg);
    return options;
  }

  protected static buildIframe(cfg: MediaProviderConfig) {
    const el = document.createElement('iframe');
    el.id = 'esl-media-vimeo-' + randUID();
    el.className = 'esl-media-inner esl-media-vimeo';
    el.title = cfg.title;
    el.setAttribute('aria-label', el.title);
    el.setAttribute('data-vimeo-id', cfg.mediaId!);
    el.setAttribute('src', 'https://player.vimeo.com/video/' + cfg.mediaId!);
    el.setAttribute('allow', 'autoplay; encrypted-media; fullscreen');
    return el;
  }

  public bind() {
    if(!this.config.mediaSrc && !this.config.mediaId) return;
    this._el = VimeoProvider.buildIframe(this.config);
    this.component.append(this._el);
    this._ready = VimeoProvider.loadAPI()
      .then(() => this.onCoreApiReady())
      .then(() => this.onPlayerReady())
      .catch((e:Error) => this.component._onError(e));
  }

  /** Init new Player on target element */
  protected onCoreApiReady(): Promise<void> | void  {
      console.debug('[ESL]: Media Vimeo Player initialization for ', this);
      const options = VimeoProvider.mapOptions(this.config, this.component);
      this._api = new window.Vimeo!.Player(this._el, options);
      return new Promise((resolve, reject) => this._api ? resolve() : reject());
  }

  async getVidioDetails(){
    const height = await this._api.getVideoHeight();
    const width = await this._api.getVideoWidth();
    this._defaultAspectRatio = width/height;
    this._duration = await this._api.getDuration();
  }

  protected onConfigChange(param: ProviderObservedParams, value: boolean) {
    super.onConfigChange(param, value);
    if (param === 'muted') {
      this._api.setMuted(value);
    }
  }

  /** Post Player init actions */
  protected onPlayerReady() {
    console.debug('[ESL]: Media Vimeo Player ready ', this);
    this._state = PlayerStates.UNSTARTED;
    this.getVidioDetails();
    this._api.on('play', () => {
      this._startData = new Date().getTime();
      this._state = PlayerStates.PLAYING;
      this.component._onPlay();
    });
    this._api.on('pause', async () => {
      this._lastCurrentTime = await this._api.getCurrentTime();
      this._startData = 0;
      this._state = PlayerStates.PAUSED;
      this.component._onPaused();
    });
    this._api.on('ended', () => {
      this._state = PlayerStates.ENDED;
      this.component._onEnded();
    });
    this.component._onReady();
    this.config.autoplay && this._api.play();
  }

  public unbind() {
    this.component._onDetach();
    this._api && this._api.destroy();
    super.unbind();
  }

  public focus() {
    if (this._el instanceof HTMLIFrameElement && this._el.contentWindow) {
      this._el.contentWindow.focus();
    }
  }

  public get state(): PlayerStates {
    return this._state || PlayerStates.UNINITIALIZED;
  }

  public get duration() {
    return this._duration;
  }

  public get currentTime() {
    if(!this._startData && !this._lastCurrentTime) return 0;
    if(!this._startData) return this._lastCurrentTime;
    const timeNow = new Date().getTime();
    return (timeNow - this._startData) /1000 + this._lastCurrentTime;
  }

  public get defaultAspectRatio() {
     return this._defaultAspectRatio;
  }

  public async seekTo(pos: number) {
    await this._api.setCurrentTime(pos);
  }

  public async play() {
    if (this.state === PlayerStates.ENDED) {
      await this._api.setCurrentTime(0);
    }
    await this._api.play();
  }

  public async pause() {
    await this._api.pause();
  }

  public async stop() {
    this._lastCurrentTime = 0;
    this._startData = 0;
    await this._api.setCurrentTime(0);
    await this._api.pause();
  }
}

declare global {

  interface Window {
    Vimeo?: {
      Player: typeof Player,
    };
  }
}
