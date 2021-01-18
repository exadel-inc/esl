/**
 * BaseProvider class for media API providers
 * @version 1.0.0-alpha
 * @author Alexey Stsefanovich (ala'n), Yuliya Adamskaya, Natallia Harshunova
 */
import {ESLMedia} from './esl-media';
import {ESLMediaProviderRegistry} from './esl-media-registry';

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
  preload?: string;
  playsinline?: boolean;
}

export type ProviderType = (new(component: ESLMedia, config: MediaProviderConfig) => BaseProvider) & typeof BaseProvider;

export type ProviderObservedParams = 'loop' | 'muted' | 'controls';

export abstract class BaseProvider {
  static readonly providerName: string;

  static parseUrl(url: string): Partial<MediaProviderConfig> | null {
    return null;
  }
  static parseConfig(component: ESLMedia): MediaProviderConfig {
    const {loop, muted, controls, autoplay, title, preload, playsinline, mediaId, mediaSrc} = component;
    const config = {loop, muted, controls, autoplay, title, preload, playsinline};
    if (mediaId) Object.assign(config, {mediaId});
    if (mediaSrc) Object.assign(config, {mediaSrc});
    return config;
  }

  protected config: MediaProviderConfig;
  protected component: ESLMedia;
  protected _el: HTMLElement;
  protected _ready: Promise<any>;

  public constructor(component: ESLMedia, config: MediaProviderConfig) {
    this.config = config;
    this.component = component;
  }

  /**
   * Wraps _ready promise
   * @returns {Promise}
   */
  get ready() {
    if (!this._ready) {
      const res = Promise.reject('Not Initialized');
      // eslint-disable-next-line no-console
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

  /** @returns {PlayerStates} - current state of the player */
  public abstract get state(): PlayerStates;

  /** @returns {number} - recommended aspect ratio */
  public abstract get defaultAspectRatio(): number;

  /** @returns {number} - resource duration */
  public abstract get duration(): number;

  /** @returns {number} - resource current time */
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
  public focus() {
    this._el?.focus();
  }

  protected onConfigChange(param: ProviderObservedParams, value: boolean) {
    this.config[param] = value;
  }

  /** Set size for inner content */
  public setSize(width: number | 'auto', height: number | 'auto'): void {
    if (!this._el) return;
    this._el.style.setProperty('width', width === 'auto' ? null : `${width}px`);
    this._el.style.setProperty('height', height === 'auto' ? null : `${height}px`);
  }

  /**
   * Executes toggle action:
   * If the player is PAUSED then it starts playing otherwise it pause playing
   */
  protected toggle() {
    if (this.state === PlayerStates.PAUSED) {
      return this.play();
    } else {
      return this.pause();
    }
  }

  /**
   * Executes onConfigChange action when api is ready
   * @returns Promise
   */
  public onSafeConfigChange(param: ProviderObservedParams, value: boolean) {
    this.ready.then(() => this.onConfigChange(param, value));
  }

  /**
   * Executes seekTo action when api is ready
   * @returns Promise
   */
  public safeSeekTo(pos: number): Promise<void> {
    return this.ready.then(() => this.seekTo(pos));
  }

  /**
   * Executes play when api is ready
   * @returns Promise
   */
  public safePlay(): Promise<void> {
    return this.ready.then(() => this.play());
  }

  /**
   * Executes pause when api is ready
   * @returns Promise
   */
  public safePause(): Promise<void> {
    return this.ready.then(() => this.pause());
  }

  /**
   * Executes stop when api is ready
   * @returns Promise
   */
  public safeStop(): Promise<void> {
    return this.ready.then(() => this.stop());
  }

  /**
   * Executes toggle when api is ready
   * @returns Promise
   */
  public safeToggle(): Promise<void> {
    return this.ready.then(() => this.toggle());
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
