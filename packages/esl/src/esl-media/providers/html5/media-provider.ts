import {isMobileIOS} from '../../../esl-utils/environment';
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

  protected abstract createElement(): HTMLMediaElement;
  protected applyElementSettings(cfg: MediaProviderConfig): void {
    this._el.classList.add('esl-media-inner');
    this._el.autoplay = cfg.autoplay;
    this._el.preload = cfg.preload || 'auto' ;
    this._el.loop = cfg.loop;
    this._el.muted = cfg.muted;
    this._el.controls = cfg.controls;
    this._el.currentTime = cfg.startTime || 0;
    this._el.tabIndex = cfg.focusable ? 0 : -1;
  }

  public override onConfigChange(param: ProviderObservedParams, value: boolean): void {
    super.onConfigChange(param, value);
    this.applyElementSettings(this.config);
  }

  public bind(): void {
    this._el = this.createElement();
    this.applyElementSettings(this.config);
    this.component.appendChild(this._el);
    // iOS needs additional kick to start loading metadata
    if (isMobileIOS) {
      this._el.load();
      this._el.currentTime = this.config.startTime || 0;
    }
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
