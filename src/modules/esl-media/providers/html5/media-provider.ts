/**
 * Simple Native Media API provider for {@link ESLMedia}
 * @version 1.0.0-alpha
 * @author Yuliya Adamskaya, Alexey Stsefanovich (ala'n)
 */

import {BaseProvider, MediaProviderConfig, PlayerStates, ProviderObservedParams} from '../../core/esl-media-provider';

export abstract class HTMLMediaProvider extends BaseProvider {
  static readonly urlPattern: RegExp;

  static parseUrl(mediaSrc: string) {
    if (this.urlPattern.test(mediaSrc)) {
      return {mediaSrc};
    }
    return null;
  }

  protected _el: HTMLMediaElement;

  protected static applyElementSettings(el: HTMLMediaElement, cfg: MediaProviderConfig) {
    el.classList.add('esl-media-inner');
    el.autoplay = cfg.autoplay;
    el.preload = cfg.preload || 'auto';
    el.loop = cfg.loop;
    el.muted = cfg.muted;
    el.controls = cfg.controls;
    el.tabIndex = 0;
    el.toggleAttribute('playsinline', cfg.playsinline);
    return el;
  }

  protected abstract createElement(): HTMLMediaElement;

  public onConfigChange(param: ProviderObservedParams, value: boolean) {
    super.onConfigChange(param, value);
    HTMLMediaProvider.applyElementSettings(this._el, this.config);
  }

  public bind() {
    this._el = this.createElement();
    HTMLMediaProvider.applyElementSettings(this._el, this.config);
    this.component.appendChild(this._el);
    this.bindListeners();
  }

  protected bindListeners() {
    this._el.addEventListener('loadedmetadata', () => this.component._onReady());
    this._el.addEventListener('play', () => this.component._onPlay());
    this._el.addEventListener('pause', () => this.component._onPaused());
    this._el.addEventListener('ended', () => this.component._onEnded());
    this._el.addEventListener('error', (e) => this.component._onError(e));
  }

  public unbind() {
    this.component._onDetach();
    super.unbind();
  }

  get ready() {
    return Promise.resolve();
  }

  public get state() {
    if (!this._el) return PlayerStates.UNINITIALIZED;
    if (this._el.ended) return PlayerStates.ENDED;
    if (!this._el.played || !this._el.played.length) return PlayerStates.UNSTARTED;
    if (this._el.paused) return PlayerStates.PAUSED;
    return PlayerStates.PLAYING;
  }

  public get duration() {
    return this._el ? this._el.duration : 0;
  }

  public get currentTime() {
    return this._el ? this._el.currentTime : 0;
  }

  public seekTo(pos: number) {
    this._el.currentTime = pos;
  }

  public play() {
    return this._el.play();
  }

  public pause() {
    return this._el.pause();
  }

  public stop() {
    this._el.pause();
    this._el.currentTime = 0;
  }
}
