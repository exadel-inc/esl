import {BaseProvider, PlayerStates} from '../../core/esl-media-provider';

import type {MediaProviderConfig, ProviderObservedParams} from '../../core/esl-media-provider';

/**
 * Simple Native Media API provider for {@link ESLMedia}
 * @author Yuliya Adamskaya, Alexey Stsefanovich (ala'n)
 */
export abstract class HTMLMediaProvider extends BaseProvider {
  static readonly urlPattern: RegExp;

  static override parseUrl(mediaSrc: string): Partial<MediaProviderConfig> | null {
    if (this.urlPattern.test(mediaSrc)) {
      return {mediaSrc};
    }
    return null;
  }

  protected override _el: HTMLMediaElement;

  protected static applyElementSettings(el: HTMLMediaElement, cfg: MediaProviderConfig): HTMLMediaElement {
    el.classList.add('esl-media-inner');
    el.autoplay = !!cfg.autoplay;
    el.preload = cfg.preload || 'auto' ;
    el.loop = cfg.loop;
    el.muted = cfg.muted;
    el.controls = cfg.controls;
    el.tabIndex = cfg.focusable ? 0 : -1;
    el.toggleAttribute('playsinline', cfg.playsinline);
    return el;
  }

  protected abstract createElement(): HTMLMediaElement;

  public override onConfigChange(param: ProviderObservedParams, value: boolean): void {
    super.onConfigChange(param, value);
    HTMLMediaProvider.applyElementSettings(this._el, this.config);
  }

  public bind(): void {
    this._el = this.createElement();
    HTMLMediaProvider.applyElementSettings(this._el, this.config);
    this.component.appendChild(this._el);
    this.bindListeners();
  }

  protected bindListeners(): void {
    this._el.addEventListener('loadedmetadata', () => this.component._onReady());
    this._el.addEventListener('play', () => this.component._onPlay());
    this._el.addEventListener('pause', () => this.component._onPaused());
    this._el.addEventListener('ended', () => this.component._onEnded());
    this._el.addEventListener('error', (e) => this.component._onError(e));
  }

  public override unbind(): void {
    this.component._onDetach();
    super.unbind();
  }

  override get ready(): Promise<any> {
    return Promise.resolve();
  }

  protected get src(): string {
    return `${this.config.mediaSrc}${this.config.startTime ? `#t=${this.config.startTime}` : ''}`;
  }

  public get state(): PlayerStates {
    if (!this._el) return PlayerStates.UNINITIALIZED;
    if (this._el.ended) return PlayerStates.ENDED;
    if (!this._el.played || !this._el.played.length) return PlayerStates.UNSTARTED;
    if (this._el.paused) return PlayerStates.PAUSED;
    return PlayerStates.PLAYING;
  }

  public get duration(): number {
    return this._el ? this._el.duration : 0;
  }

  public get currentTime(): number {
    return this._el ? this._el.currentTime : 0;
  }

  public seekTo(pos: number): void {
    this._el.currentTime = pos;
  }

  public play(): Promise<any> {
    return this._el.play();
  }

  public pause(): void {
    this._el.pause();
  }

  public stop(): void {
    this._el.pause();
    this._el.currentTime = 0;
  }
}
