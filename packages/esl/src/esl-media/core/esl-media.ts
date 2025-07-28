import {ESLBaseElement} from '../../esl-base-element/core';
import {ExportNs} from '../../esl-utils/environment/export-ns';
import {isSafeContains} from '../../esl-utils/dom/traversing';
import {CSSClassUtils} from '../../esl-utils/dom/class';
import {PAUSE, SPACE} from '../../esl-utils/dom/keys';
import {isInViewport} from '../../esl-utils/dom/visible';
import {attr, boolAttr, listen, memoize, prop} from '../../esl-utils/decorators';
import {debounce} from '../../esl-utils/async';
import {parseAspectRatio, parseBoolean, parseLazyAttr} from '../../esl-utils/misc/format';

import {ESLMediaQuery} from '../../esl-media-query/core';
import {ESLResizeObserverTarget} from '../../esl-event-listener/core';
import {ESLTraversingQuery} from '../../esl-traversing-query/core';

import {getIObserver} from './esl-media-iobserver';
import {PlayerStates} from './esl-media-provider';
import {ESLMediaProviderRegistry} from './esl-media-registry';
import {ESLMediaManager} from './esl-media-manager';
import {ESLMediaHookEvent} from './esl-media.events';

import type {BaseProvider} from './esl-media-provider';
import type {ESLMediaRegistryEvent} from './esl-media-registry.event';

export type ESLMediaFillMode = 'cover' | 'inscribe' | '';

function parsePlayInViewportAttr(value: string | null): 'restart' | boolean {
  if (typeof value !== 'string') return false;
  const v = value.trim().toLowerCase();
  if (v === 'none') return false;
  return v === 'restart' ? v : true;
}

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

  /** A minimum ratio to init media (in case of lazy=auto) */
  @prop(0.05) public RATIO_TO_ACTIVATE: number;
  /** A minimum ratio to stop media (in case of play in viewport option) */
  @prop(0.2) public RATIO_TO_STOP: number;
  /** A minimum ratio to play media (in case of play in viewport option) */
  @prop(0.33) public RATIO_TO_PLAY: number;

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
  @attr({parser: parseLazyAttr}) public lazy: 'auto' | 'manual' | 'none';
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
  @boolAttr({name: 'playsinline'}) public playsInline: boolean;
  /**
   * Prevents the browser from suggesting a Picture-in-Picture context menu or
   * to request Picture-in-Picture automatically in some cases.
   */
  @boolAttr({name: 'disablepictureinpicture'}) public disablePictureInPicture: boolean;
  /** Allows play resource only in viewport area */
  @attr({parser: parsePlayInViewportAttr}) public playInViewport: 'restart' | boolean;
  /** Allows to start viewing a resource from a specific time offset. */
  @attr({defaultValue: 0, parser: parseInt}) public startTime: number;
  /** Allows player to accept focus */
  @attr({
    parser: parseBoolean,
    defaultValue: ($this: ESLMedia) => $this.controls
  }) public focusable: boolean;


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

  /** Private property to mark if the element is visible */
  public _isVisible: boolean;
  /** Marker if the last action (play/pause/stop) was initiated by the user */
  protected _isManualAction: boolean;
  /** Applied provider instance */
  protected _provider: BaseProvider | null;
  /** Deferred reinitialize handler, to prevent multiple reinitialization calls in bound of the macro-task */
  protected deferredReinitialize = debounce(() => this.reinitInstance());

  /**
   * Map object with possible Player States, values:
   * BUFFERING, ENDED, PAUSED, PLAYING, UNSTARTED, VIDEO_CUED, UNINITIALIZED
   */
  static get PLAYER_STATES(): typeof PlayerStates {
    return PlayerStates;
  }

  /** Returns true if the provider with given name is supported */
  static supports(name: string): boolean {
    return ESLMediaProviderRegistry.instance.has(name);
  }

  /** @readonly {@link ESLMediaManager} used for current instance */
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
    this._provider?.unbind();
    this._provider = null;
    this._isManualAction = false;

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
    return this._provider?.safeSeekTo(pos) || null;
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
    this._isManualAction = !system;
    return this._provider?.safePlay(system) || null;
  }

  /** Pause playing media */
  public pause(system = false): Promise<void> | null {
    this._isManualAction = !system;
    return this._provider?.safePause() || null;
  }

  /** Stop playing media */
  public stop(system = false): Promise<void> | null {
    this._isManualAction = !system;
    return this._provider?.safeStop() || null;
  }

  /**
   * Executes toggle action:
   * If the player is PAUSED then it starts playing otherwise it pause playing
   */
  public toggle(allowActivate: boolean = false): Promise<void> | null {
    const shouldActivate = [PlayerStates.PAUSED, PlayerStates.UNSTARTED, PlayerStates.VIDEO_CUED, PlayerStates.UNINITIALIZED].includes(this.state);
    return shouldActivate ? this.play(allowActivate) : this.pause();
  }

  /** Focus inner player **/
  public focusPlayer(): void {
    this._provider?.focus();
  }

  /** Detects if the user manipulate trough native controls */
  protected detectUserInteraction(cmd: string): void {
    // Pause on ended state is usually system action
    if (this.state === PlayerStates.ENDED && cmd === 'pause') {
      this._isManualAction = false;
      this._provider?.resetLastCommand();
      return;
    }
    if (!this.controls || this._isManualAction) return;
    if (this._provider?.lastCommand === cmd) return;
    // User cannot manipulate the player outside the viewport
    const tolerance = this.RATIO_TO_ACTIVATE * this.clientWidth * this.clientHeight;
    if (!isInViewport(this, tolerance)) return;
    console.debug('[ESL]: User %s interaction detected', cmd);
    this._isManualAction = true;
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

  public _onBeforePlay(initiator: 'initial' | 'user' | 'system'): boolean {
    const event = new ESLMediaHookEvent(this.BEFORE_PLAY_EVENT, {initiator});
    return this.dispatchEvent(event);
  }

  public _onPlay(): void {
    this.detectUserInteraction('play');
    if (this.autofocus) this.focus();
    this.$$attr('active', true);
    this.$$attr('played', true);
    this.$$fire(this.PLAY_EVENT);
    this.manager._onAfterPlay(this);
    this._onResize();
  }

  public _onPaused(): void {
    this.detectUserInteraction('pause');
    this.$$attr('active', false);
    this.$$fire(this.PAUSED_EVENT);
  }

  public _onEnded(): void {
    this.detectUserInteraction('pause');
    this.$$attr('active', false);
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
    if (!isSafeContains(e.target as Node, this)) return;
    this._onResize();
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
    if (![SPACE, PAUSE].includes(e.key)) return;
    e.preventDefault();
    e.stopPropagation();
    this.toggle();
  }

  /** Update ready class state */
  protected updateReadyClass(): void {
    const target = ESLTraversingQuery.first(this.readyClassTarget, this) as HTMLElement;
    target && CSSClassUtils.toggle(target, this.readyClass, this.ready);
  }

  /** Applied provider */
  public get providerType(): string {
    return this._provider?.name || '';
  }

  /**
   * Marker if the last action (play/pause/stop) was initiated by the user
   * (direct method call or by embed player controls)
   */
  public get isUserInitiated(): boolean {
    return this._isManualAction;
  }

  /** Current player state, see {@link ESLMedia.PLAYER_STATES} values */
  public get state(): PlayerStates {
    return this._provider ? this._provider.state : PlayerStates.UNINITIALIZED;
  }

  /** Duration of the media resource */
  public get duration(): number {
    return this._provider?.duration || 0;
  }

  /** Current time of media resource */
  public get currentTime(): number {
    return this._provider?.currentTime || 0;
  }

  /** Set current time of media resource */
  public set currentTime(time: number) {
    this._provider?.safeSeekTo(time);
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
    return this._provider?.defaultAspectRatio || 0;
  }

  protected reattachViewportConstraint(): void {
    this.detachViewportConstraint();
    if (!this.playInViewport && this.lazy !== 'auto') return;
    getIObserver().observe(this);
  }
  protected detachViewportConstraint(): void {
    getIObserver(true)?.unobserve(this);
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
