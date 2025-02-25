import {ESLBaseElement} from '../../esl-base-element/core';
import {ExportNs} from '../../esl-utils/environment/export-ns';
import {isSafeContains} from '../../esl-utils/dom/traversing';
import {CSSClassUtils} from '../../esl-utils/dom/class';
import {SPACE, PAUSE} from '../../esl-utils/dom/keys';
import {prop, attr, boolAttr, listen, memoize} from '../../esl-utils/decorators';
import {debounce} from '../../esl-utils/async';
import {parseAspectRatio, parseBoolean} from '../../esl-utils/misc/format';

import {ESLMediaQuery} from '../../esl-media-query/core';
import {ESLResizeObserverTarget} from '../../esl-event-listener/core';
import {ESLTraversingQuery} from '../../esl-traversing-query/core';

import {getIObserver} from './esl-media-iobserver';
import {PlayerStates} from './esl-media-provider';
import {ESLMediaProviderRegistry} from './esl-media-registry';
import {ESLMediaManager} from './esl-media-manager';

import type {BaseProvider} from './esl-media-provider';
import type {ESLMediaRegistryEvent} from './esl-media-registry.event';

export type ESLMediaFillMode = 'cover' | 'inscribe' | '';

export type ESLMediaLazyMode = 'auto' | 'manual' | 'none';
const isLazyAttr = (v: string): v is ESLMediaLazyMode => ['auto', 'manual', 'none'].includes(v);
const parseLazyAttr = (v: string): ESLMediaLazyMode => isLazyAttr(v) ? v : 'auto';

/**
 * ESLMedia - custom element, that provides an ability to add and configure media (video / audio)
 * using a single tag as well as work with external providers using simple native-like API.
 *
 * @author Alexey Stsefanovich (ala'n), Yuliya Adamskaya
 */
@ExportNs('Media')
export class ESLMedia extends ESLBaseElement {
  public static override is = 'esl-media';
  public static observedAttributes = [
    'load-condition',
    'media-type',
    'media-id',
    'media-src',
    'fill-mode',
    'aspect-ratio',
    'play-in-viewport',
    'muted',
    'loop',
    'controls',
    'lazy',
    'start-time'
  ];

  /** Singleton instance of {@link ESLMediaManager} */
  @memoize()
  public static get manager(): ESLMediaManager {
    return new ESLMediaManager();
  }

  /** Event to dispatch on ready state */
  @prop('esl:media:ready') public READY_EVENT: string;
  /** Event to dispatch on error state */
  @prop('esl:media:error') public ERROR_EVENT: string;
  /** Event to dispatch before player provider requested to play (cancelable) */
  @prop('esl:media:before:play') public BEFORE_PLAY_EVENT: string;
  /** Event to dispatch when player plays */
  @prop('esl:media:play') public PLAY_EVENT: string;
  /** Event to dispatch when player paused */
  @prop('esl:media:paused') public PAUSED_EVENT: string;
  /** Event to dispatch when player ended */
  @prop('esl:media:ended') public ENDED_EVENT: string;
  /** Event to dispatch when player detached */
  @prop('esl:media:detached') public DETACHED_EVENT: string;
  /** Event to dispatch when player paused by another instance in group (cancelable) */
  @prop('esl:media:managedpause') public MANAGED_PAUSE_EVENT: string;
  /** Event to dispatch when user decides to play/pause all media */
  @prop('esl:media:managedaction') public MANAGED_ACTION_EVENT: string;

  /** Media resource identifier */
  @attr() public mediaId: string;
  /** Media resource src/url path */
  @attr() public mediaSrc: string;
  /** Media resource type. 'auto' (auto detection from src) by default */
  @attr() public mediaType: string;

  /** Media elements group name */
  @attr() public group: string;
  /** Media resource rendering strategy relative to the element area: 'cover', 'inscribe' or not defined */
  @attr() public fillMode: ESLMediaFillMode;
  /** Strict aspect ratio definition */
  @attr() public aspectRatio: string;
  /** Allows lazy load resource */
  @attr({parser: parseLazyAttr, defaultValue: 'none'}) public lazy: ESLMediaLazyMode;
  /** Autoplay resource marker */
  @boolAttr() public autoplay: boolean;

  /** Autofocus on play marker */
  @boolAttr() public override autofocus: boolean;
  /** Mute resource marker */
  @boolAttr() public muted: boolean;
  /** Loop resource play */
  @boolAttr() public loop: boolean;
  /** Marker to show controls for resource player */
  @boolAttr() public controls: boolean;
  /** Allow media to play inline (see HTML video/audio spec) */
  @boolAttr() public playsinline: boolean;
  /** Allows play resource only in viewport area */
  @boolAttr() public playInViewport: boolean;
  /** Allows to start viewing a resource from a specific time offset. */
  @attr({parser: parseInt}) public startTime: number;
  /** Allows player to accept focus */
  @attr({parser: parseBoolean, defaultValue: ($this: ESLMedia) => $this.controls}) public focusable: boolean;


  /** Preload resource */
  @attr({defaultValue: 'auto'}) public preload: 'none' | 'metadata' | 'auto' | '';

  /** Ready state class/classes */
  @attr() public readyClass: string;
  /** Ready state class/classes target */
  @attr() public readyClassTarget: string;

  /** Condition {@link ESLMediaQuery} to allow load of media resource. Default: `all` */
  @attr({defaultValue: 'all'}) public loadCondition: string;
  /** Class / classes to add when load media is accepted. Supports multiple and inverted classes */
  @attr() public loadConditionClass: string;
  /** Target element {@link ESLTraversingQuery} select to toggle {@link loadConditionClass} classes */
  @attr({defaultValue: '::parent'}) public loadConditionClassTarget: string;

  /** @readonly Ready state marker */
  @boolAttr({readonly: true}) public ready: boolean;
  /** @readonly Active state marker */
  @boolAttr({readonly: true}) public active: boolean;
  /** @readonly Resource played marker */
  @boolAttr({readonly: true}) public played: boolean;
  /** @readonly Error state marker */
  @boolAttr({readonly: true}) public error: boolean;
  /** @readonly Width is greater than height state marker */
  @boolAttr({readonly: true}) public wide: boolean;
  /** @readonly Autopaused state marker (video has been stopped by system) */
  @boolAttr({readonly: true}) public autopaused: boolean;

  private _systemAction: string;
  private _provider: BaseProvider | null;
  private deferredReinitialize = debounce(() => this.reinitInstance());

  /**
   * Map object with possible Player States, values:
   * BUFFERING, ENDED, PAUSED, PLAYING, UNSTARTED, VIDEO_CUED, UNINITIALIZED
   */
  static get PLAYER_STATES(): typeof PlayerStates {
    return PlayerStates;
  }

  static supports(name: string): boolean {
    return ESLMediaProviderRegistry.instance.has(name);
  }

  protected get manager(): ESLMediaManager {
    return (this.constructor as typeof ESLMedia).manager;
  }

  protected override connectedCallback(): void {
    super.connectedCallback();
    this.manager._onInit(this);
    if (!this.hasAttribute('role')) {
      this.setAttribute('role', 'application');
    }
    this.innerHTML += '<!-- Inner Content, do not modify it manually -->';
    this.deferredReinitialize();
    this.reattachViewportConstraint();
  }

  protected override disconnectedCallback(): void {
    this.manager._onDestroy(this);
    super.disconnectedCallback();
    this.detachViewportConstraint();
    this._provider && this._provider.unbind();
  }

  protected override attributeChangedCallback(attrName: string, oldVal: string, newVal: string): void {
    if (!this.connected || oldVal === newVal) return;
    switch (attrName) {
      case 'media-id':
      case 'media-src':
      case 'media-type':
      case 'start-time':
        this.deferredReinitialize();
        break;
      case 'lazy':
        this.reattachViewportConstraint();
        this.deferredReinitialize();
        break;
      case 'loop':
      case 'muted':
      case 'controls':
        this._provider && this._provider.onSafeConfigChange(attrName, newVal !== null);
        break;
      case 'fill-mode':
      case 'aspect-ratio':
        this.$$on(this._onResize);
        this._onResize();
        break;
      case 'play-in-viewport':
        this.reattachViewportConstraint();
        break;
      case 'load-condition':
        this.$$on(this._onConditionChange);
        this.deferredReinitialize();
        break;
    }
  }

  public canActivate(): boolean {
    return this.lazy === 'none' && this.conditionQuery.matches;
  }

  private reinitInstance(): void {
    console.debug('[ESL] Media reinitialize ', this);
    this._systemAction = 'initial';
    this._provider && this._provider.unbind();
    this._provider = null;

    if (this.canActivate()) {
      this._provider = ESLMediaProviderRegistry.instance.createFor(this);
      if (!this._provider) this._onError();
    }

    this.updateContainerMarkers();
  }

  public updateContainerMarkers(): void {
    const $target = ESLTraversingQuery.first(this.loadConditionClassTarget, this) as HTMLElement;
    $target && CSSClassUtils.toggle($target, this.loadConditionClass, this.conditionQuery.matches);
  }

  /** Seek to given position of media */
  public seekTo(pos: number): Promise<void> | null {
    return this._provider && this._provider.safeSeekTo(pos);
  }

  /**
   * Start playing media
   * @param allowActivate - allows to remove manual lazy loading restrictions
   * @param system - marks that the action was initiated by the system
   */
  public play(allowActivate: boolean = false, system = false): Promise<void> | null {
    if (!this.ready && allowActivate) {
      this.lazy = 'none';
      this.deferredReinitialize.cancel();
      this.reinitInstance();
    }
    this._systemAction = system ? 'play' : 'user';
    return this._provider && this._provider.safePlay(system);
  }

  /** Pause playing media */
  public pause(system = false): Promise<void> | null {
    this._systemAction = system ? 'pause' : 'user';
    return this._provider && this._provider.safePause();
  }

  /** Stop playing media */
  public stop(system = false): Promise<void> | null {
    this._systemAction = system ? 'stop' : 'user';
    return this._provider && this._provider.safeStop();
  }

  /**
   * Executes toggle action:
   * If the player is PAUSED then it starts playing otherwise it pause playing
   */
  public toggle(allowActivate: boolean = false): Promise<void> | null {
    const shouldActivate = [PlayerStates.PAUSED, PlayerStates.UNSTARTED, PlayerStates.VIDEO_CUED, PlayerStates.UNINITIALIZED].includes(this.state);
    return shouldActivate ? this.play(allowActivate) : this.pause();
  }

  /** Clear user interaction state */
  public clearUserInteraction(): void {
    this._systemAction = 'initial';
  }

  /** Focus inner player **/
  public focusPlayer(): void {
    this._provider && this._provider.focus();
  }

  // media live-cycle handlers
  public _onReady(): void {
    this.$$attr('ready', true);
    this.$$attr('error', false);
    this.updateReadyClass();
    this.$$fire(this.READY_EVENT);
    this._onResize();
  }

  public _onError(detail?: any, setReadyState = true): void {
    this.$$attr('ready', true);
    this.$$attr('error', true);
    this.$$fire(this.ERROR_EVENT, {detail});
    setReadyState && this.$$fire(this.READY_EVENT);
  }

  public _onDetach(): void {
    this.$$attr('active', false);
    this.$$attr('ready', false);
    this.$$attr('played', false);
    this.updateReadyClass();
    this.$$fire(this.DETACHED_EVENT);
  }

  public _onBeforePlay(initiator: string): boolean {
    const detail = {initiator};
    return this.$$fire(this.BEFORE_PLAY_EVENT, {detail});
  }

  public _onPlay(): void {
    if (this._systemAction !== 'play' && this._systemAction !== 'initial') {
      this._systemAction = 'user';
    }
    if (this.autofocus) this.focus();
    this.$$attr('active', true);
    this.$$attr('played', true);
    this.$$fire(this.PLAY_EVENT);
    this.manager._onAfterPlay(this);
    this._onResize();
  }

  public _onPaused(): void {
    if (this._systemAction !== 'pause' && this._systemAction !== 'initial') {
      this._systemAction = 'user';
    }
    this.removeAttribute('active');
    this.$$fire(this.PAUSED_EVENT);
  }

  public _onEnded(): void {
    if (this._systemAction !== 'stop' && this._systemAction !== 'initial') {
      this._systemAction = 'user';
    }
    this.removeAttribute('active');
    this.$$fire(this.ENDED_EVENT);
  }

  @listen({
    event: 'resize',
    target: ESLResizeObserverTarget.for,
    condition: ($this: ESLMedia) => $this.fillModeEnabled
  })
  protected _onResize(): void {
    if (!this._provider) return;
    const {actualAspectRatio} = this;
    this.$$attr('wide', this.offsetWidth / this.offsetHeight > actualAspectRatio);
    this._provider.setAspectRatio(actualAspectRatio);
  }

  @listen({
    event: ($this: ESLMedia) => $this.REFRESH_EVENT,
    target: window
  })
  protected _onRefresh(e: Event): void {
    const {target} = e;
    if (isSafeContains(target as Node, this)) this._onResize();
  }

  @listen({
    event: 'change',
    target: () => ESLMediaProviderRegistry.instance
  })
  protected _onRegistryStateChange(e: ESLMediaRegistryEvent): void {
    if (e.isRelates(this.mediaType)) this.reinitInstance();
  }

  @listen({
    event: 'change',
    target: ($this: ESLMedia) => $this.conditionQuery
  })
  protected _onConditionChange(): void {
    this.deferredReinitialize();
  }

  @listen('keydown')
  protected _onKeydown(e: KeyboardEvent): void {
    if (e.target !== this) return;
    if ([SPACE, PAUSE].includes(e.key)) {
      e.preventDefault();
      e.stopPropagation();
      this.toggle();
    }
  }

  /** Update ready class state */
  protected updateReadyClass(): void {
    const target = ESLTraversingQuery.first(this.readyClassTarget, this) as HTMLElement;
    target && CSSClassUtils.toggle(target, this.readyClass, this.ready);
  }

  /** Applied provider */
  public get providerType(): string {
    return this._provider ? this._provider.name : '';
  }

  public get isUserAction(): boolean {
    return this._systemAction === 'user';
  }

  /** Current player state, see {@link ESLMedia.PLAYER_STATES} values */
  public get state(): PlayerStates {
    return this._provider ? this._provider.state : PlayerStates.UNINITIALIZED;
  }

  /** Duration of the media resource */
  public get duration(): number {
    return this._provider ? this._provider.duration : 0;
  }

  /** Current time of media resource */
  public get currentTime(): number {
    return this._provider ? this._provider.currentTime : 0;
  }

  /** Set current time of media resource */
  public set currentTime(time: number) {
    (this._provider) && this._provider.safeSeekTo(time);
  }

  /** ESLMediaQuery to limit ESLMedia loading */
  public get conditionQuery(): ESLMediaQuery {
    return ESLMediaQuery.for(this.loadCondition);
  }

  /** Fill mode should be handled for element */
  public get fillModeEnabled(): boolean {
    return this.fillMode === 'cover' || this.fillMode === 'inscribe';
  }

  /** Used resource aspect ratio forced by attribute or returned by provider */
  public get actualAspectRatio(): number {
    if (this.aspectRatio && this.aspectRatio !== 'auto') return parseAspectRatio(this.aspectRatio);
    return this._provider ? this._provider.defaultAspectRatio : 0;
  }

  protected reattachViewportConstraint(): void {
    this.detachViewportConstraint();
    if (!this.playInViewport && this.lazy !== 'auto') return;
    getIObserver().observe(this);
  }
  protected detachViewportConstraint(): void {
    const observer = getIObserver(true);
    observer && observer.unobserve(this);
  }
}

declare global {
  export interface ESLLibrary {
    Media: typeof ESLMedia;
  }
  export interface HTMLElementTagNameMap {
    'esl-media': ESLMedia;
  }
}
