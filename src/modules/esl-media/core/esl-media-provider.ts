import {DelayedTask} from '../../esl-utils/async/delayed-task';
import {ESLMediaProviderRegistry} from './esl-media-registry';

import type {ESLMedia} from './esl-media';

export enum PlayerStates {
  BUFFERING = 3,
  ENDED = 0,
  PAUSED = 2,
  PLAYING = 1,
  UNSTARTED = -1,
  VIDEO_CUED = 5,
  UNINITIALIZED = -2
}

export interface MediaProviderConfig {
  mediaSrc?: string;
  mediaId?: string;
  loop: boolean;
  muted: boolean;
  controls: boolean;
  autoplay: boolean;
  title: string;
  preload?: 'none' | 'metadata' | 'auto' | '';
  playsinline?: boolean;
  startTime?: number;
  focusable?: boolean;
}

export type ProviderType = (new(component: ESLMedia, config: MediaProviderConfig) => BaseProvider) & typeof BaseProvider;

export type ProviderObservedParams = 'loop' | 'muted' | 'controls';

/**
 * BaseProvider class for media API providers
 * @author Alexey Stsefanovich (ala'n), Yuliya Adamskaya, Natallia Harshunova
 */
export abstract class BaseProvider {
  static readonly providerName: string;

  static parseUrl(url: string): Partial<MediaProviderConfig> | null {
    return null;
  }
  static parseConfig(component: ESLMedia): MediaProviderConfig {
    const {loop, muted, controls, autoplay, title, preload, playsinline, mediaId, mediaSrc, startTime, focusable} = component;
    const config = {loop, muted, controls, autoplay, title, preload, playsinline, startTime, focusable};
    if (mediaId) Object.assign(config, {mediaId});
    if (mediaSrc) Object.assign(config, {mediaSrc});
    return config;
  }

  protected config: MediaProviderConfig;
  protected component: ESLMedia;
  protected _el: HTMLElement;
  protected _ready: Promise<any>;
  protected _cmdMng: DelayedTask = new DelayedTask();

  public constructor(component: ESLMedia, config: MediaProviderConfig) {
    this.config = config;
    this.component = component;
    if (this.config.autoplay) {
      this.config.autoplay = this.component._onBeforePlay('initial');
    }
    this.bind();
  }

  /** Wraps _ready promise */
  get ready(): Promise<any> {
    if (!this._ready) {
      const res = Promise.reject('Not Initialized');
      res.catch((e) => console.log('Rejected Media Operation: ', e));
      return res;
    }
    return this._ready;
  }

  /** Bind the provider instance to the component */
  public abstract bind(): void;

  /** Unbind the provider instance from the component */
  public unbind(): void {
    Array.from(this.component.querySelectorAll('.esl-media-inner'))
      .forEach((el: Node) => el.parentNode && el.parentNode.removeChild(el));
  }

  /** Provider name */
  public get name(): string {
    return (this.constructor as typeof BaseProvider).providerName;
  }

  /** @returns current state of the player */
  public abstract get state(): PlayerStates;

  /** @returns recommended aspect ratio */
  public abstract get defaultAspectRatio(): number;

  /** @returns resource duration */
  public abstract get duration(): number;

  /** @returns resource current time */
  public abstract get currentTime(): number;

  /** Low-level provider 'seek to' method implementation */
  protected abstract seekTo(pos?: number): void | Promise<any>;

  /** Low-level provider 'play' method implementation */
  protected abstract play(): void | Promise<any>;

  /** Low-level provider 'pause' method implementation */
  protected abstract pause(): void | Promise<any>;

  /** Low-level provider 'stop' method implementation */
  protected abstract stop(): void | Promise<any>;

  /** Set focus to the inner content */
  public focus(): void {
    this._el?.focus();
  }

  protected onConfigChange(param: ProviderObservedParams, value: boolean): void {
    this.config[param] = value;
  }

  /** Set size for inner content */
  public setSize(width: number | 'auto', height: number | 'auto'): void {
    if (!this._el) return;
    this._el.style.setProperty('width', width === 'auto' ? null : `${width}px`);
    this._el.style.setProperty('height', height === 'auto' ? null : `${height}px`);
  }

  public setAspectRatio(aspectRatio: number): void {
    this._el?.style.setProperty('aspect-ratio', aspectRatio > 0 ? `${aspectRatio}` : null);
  }

  /** Executes onConfigChange action when api is ready */
  public onSafeConfigChange(param: ProviderObservedParams, value: boolean): void {
    this.ready.then(() => this.onConfigChange(param, value));
  }

  /** Executes seekTo action when api is ready */
  public safeSeekTo(pos: number): Promise<void> {
    return this.ready.then(() => this.seekTo(pos));
  }

  /** Executes play when api is ready */
  public async safePlay(): Promise<void> {
    await this.ready;
    this._cmdMng.put(() => this.component._onBeforePlay('play') && this.play(), 0);
  }

  /** Executes pause when api is ready */
  public async safePause(): Promise<void> {
    await this.ready;
    this._cmdMng.put(() => this.pause(), 0);
  }

  /**
   * Executes stop when api is ready
   * @returns Promise
   */
  public async safeStop(): Promise<void> {
    await this.ready;
    this._cmdMng.put(() => this.stop(), 0);
  }

  /**
   * Register current provider.
   * Can be used as a decorator.
   */
  public static register(this: ProviderType): void;
  public static register(this: unknown, provider?: ProviderType): void;
  public static register(this: any, provider?: ProviderType): void {
    provider = provider || this;
    if (provider === BaseProvider) throw new Error('`BaseProvider` can\'t be registered.');
    if (!(provider?.prototype instanceof BaseProvider)) throw new Error('Provider should be instanceof `BaseProvider`');
    ESLMediaProviderRegistry.instance.register(provider);
  }
}
