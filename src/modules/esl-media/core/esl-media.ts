import {ExportNs} from '../../esl-utils/environment/export-ns';
import {ESLBaseElement, attr, boolAttr} from '../../esl-base-element/core';
import {bind} from '../../esl-utils/decorators/bind';
import {CSSUtil} from '../../esl-utils/dom/styles';
import {rafDecorator} from '../../esl-utils/async/raf';
import {debounce} from '../../esl-utils/async/debounce';
import {EventUtils} from '../../esl-utils/dom/events';
import {parseAspectRatio} from '../../esl-utils/misc/format';

import {ESLMediaQuery} from '../../esl-media-query/core';
import {TraversingQuery} from '../../esl-traversing-query/core';

import {getIObserver} from './esl-media-iobserver';
import {BaseProvider, PlayerStates} from './esl-media-provider';
import {ESLMediaProviderRegistry} from './esl-media-registry';
import {MediaGroupRestrictionManager} from './esl-media-manager';

export type ESLMediaFillMode = 'cover' | 'inscribe' | '';

/**
 * ESL Media
 * @author Alexey Stsefanovich (ala'n), Yuliya Adamskaya
 */
@ExportNs('Media')
export class ESLMedia extends ESLBaseElement {
  public static is = 'esl-media';
  public static eventNs = 'esl:media:';

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


  /** Disabled marker to prevent rendering */
  @boolAttr() public disabled: boolean;
  /** Autoplay resource marker */
  @boolAttr() public autoplay: boolean;
  /** Autofocus on play marker */
  @boolAttr() public autofocus: boolean;
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

  /** Preload resource */
  @attr({defaultValue: 'auto'}) public preload: string;

  /** Ready state class/classes */
  @attr() public readyClass: string;
  /** Ready state class/classes target */
  @attr() public readyClassTarget: string;

  /** Class / classes to add when media is accepted */
  @attr() public loadClsAccepted: string;
  /** Class / classes to add when media is declined */
  @attr() public loadClsDeclined: string;
  /** Target element {@link TraversingQuery} select to add accepted/declined classes */
  @attr({defaultValue: '::parent'}) public loadClsTarget: string;

  /** @readonly Ready state marker */
  @boolAttr({readonly: true}) public ready: boolean;
  /** @readonly Active state marker */
  @boolAttr({readonly: true}) public active: boolean;
  /** @readonly Resource played marker */
  @boolAttr({readonly: true}) public played: boolean;
  /** @readonly Error state marker */
  @boolAttr({readonly: true}) public error: boolean;

  private _provider: BaseProvider | null;
  private _conditionQuery: ESLMediaQuery | null;

  private deferredResize = rafDecorator(() => this._onResize());
  private deferredReinitialize = debounce(() => this.reinitInstance());

  /**
   * @enum Map with possible Player States
   * values: BUFFERING, ENDED, PAUSED, PLAYING, UNSTARTED, VIDEO_CUED, UNINITIALIZED
   */
  static get PLAYER_STATES() {
    return PlayerStates;
  }

  static get observedAttributes() {
    return [
      'disabled',
      'media-type',
      'media-id',
      'media-src',
      'fill-mode',
      'aspect-ratio',
      'play-in-viewport',
      'muted',
      'loop',
      'controls'
    ];
  }

  static supports(name: string): boolean {
    return ESLMediaProviderRegistry.instance.has(name);
  }

  protected connectedCallback() {
    super.connectedCallback();
    if (!this.hasAttribute('role')) {
      this.setAttribute('role', 'application');
    }
    this.innerHTML += '<!-- Inner Content, do not modify it manually -->';
    ESLMediaProviderRegistry.instance.addListener(this._onRegistryStateChange);
    if (this.conditionQuery) {
      this.conditionQuery.addListener(this.deferredReinitialize);
    }
    if (this.fillModeEnabled) {
      window.addEventListener('resize', this.deferredResize);
    }
    this.attachViewportConstraint();
    this.deferredReinitialize();
  }

  protected disconnectedCallback() {
    super.disconnectedCallback();
    ESLMediaProviderRegistry.instance.removeListener(this._onRegistryStateChange);
    if (this.conditionQuery) {
      this.conditionQuery.removeListener(this.deferredReinitialize);
    }
    if (this.fillModeEnabled) {
      window.removeEventListener('resize', this.deferredResize);
    }
    this.detachViewportConstraint();
    this._provider && this._provider.unbind();
  }

  private attributeChangedCallback(attrName: string, oldVal: string, newVal: string) {
    if (!this.connected || oldVal === newVal) return;
    switch (attrName) {
      case 'disabled':
      case 'media-id':
      case 'media-src':
      case 'media-type':
        this.deferredReinitialize();
        break;
      case 'loop':
      case 'muted':
      case 'controls':
        this._provider && this._provider.onSafeConfigChange(attrName, newVal !== null);
        break;
      case 'fill-mode':
      case 'aspect-ratio':
        this.deferredResize();
        break;
      case 'play-in-viewport':
        this.playInViewport ?
          this.attachViewportConstraint() :
          this.detachViewportConstraint();
        break;
    }
  }

  public canActivate() {
    if (this.disabled) return false;
    if (this.conditionQuery) return this.conditionQuery.matches;
    return true;
  }

  private reinitInstance() {
    console.debug('[ESL] Media reinitialize ', this);
    this._provider && this._provider.unbind();
    this._provider = null;

    if (this.canActivate()) {
      this._provider = ESLMediaProviderRegistry.instance.createFor(this);
      if (this._provider) {
        this._provider.bind();
        console.debug('[ESL] Media provider bound', this._provider);
      } else {
        this._onError();
      }
    }

    this.updateContainerMarkers();
  }

  public updateContainerMarkers() {
    const targetEl = TraversingQuery.first(this.loadClsTarget, this) as HTMLElement;
    if (!targetEl) return;

    const active = this.canActivate();
    CSSUtil.toggleClsTo(targetEl, this.loadClsAccepted, active);
    CSSUtil.toggleClsTo(targetEl, this.loadClsDeclined, !active);
  }

  /**
   * Seek to given position of media
   * @returns {Promise | void}
   */
  public seekTo(pos: number) {
    return this._provider && this._provider.safeSeekTo(pos);
  }

  /**
   * Start playing media
   * @param {boolean} allowActivate
   * @returns {Promise | void}
   */
  public play(allowActivate: boolean = false) {
    if (this.disabled && allowActivate) {
      this.disabled = false;
      this.deferredReinitialize.cancel();
      this.reinitInstance();
    }
    if (!this.canActivate()) return;
    return this._provider && this._provider.safePlay();
  }

  /**
   * Pause playing media
   * @returns {Promise | void}
   */
  public pause() {
    return this._provider && this._provider.safePause();
  }

  /**
   * Stop playing media
   * @returns {Promise | void}
   */
  public stop() {
    return this._provider && this._provider.safeStop();
  }

  /**
   * Toggle play/pause state of the media
   * @returns {Promise | void}
   */
  public toggle() {
    return this._provider && this._provider.safeToggle();
  }

  /** @override */
  public focus() {
    this._provider && this._provider.focus();
  }

  // media live-cycle handlers
  public _onReady() {
    this.toggleAttribute('ready', true);
    this.toggleAttribute('error', false);
    this.updateReadyClass();
    this.deferredResize();
    this.$$fire('ready');
  }

  public _onError(detail?: any, setReadyState = true) {
    this.toggleAttribute('ready', true);
    this.toggleAttribute('error', true);
    this.$$fire('error', {detail});
    setReadyState && this.$$fire('ready');
  }

  public _onDetach() {
    this.removeAttribute('active');
    this.removeAttribute('ready');
    this.removeAttribute('played');
    this.updateReadyClass();
    this.$$fire('detach');
  }

  public _onPlay() {
    if (this.autofocus) this.focus();
    this.deferredResize();
    this.setAttribute('active', '');
    this.setAttribute('played', '');
    this.$$fire('play');
    MediaGroupRestrictionManager.registerPlay(this);
  }

  public _onPaused() {
    this.removeAttribute('active');
    this.$$fire('paused');
    MediaGroupRestrictionManager.unregister(this);
  }

  public _onEnded() {
    this.removeAttribute('active');
    this.$$fire('ended');
    MediaGroupRestrictionManager.unregister(this);
  }

  public _onResize() {
    if (!this._provider) return;
    if (!this.fillModeEnabled || this.actualAspectRatio <= 0) {
      this._provider.setSize('auto', 'auto');
    } else {
      let stretchVertically = this.offsetWidth / this.offsetHeight < this.actualAspectRatio;
      if (this.fillMode === 'inscribe') stretchVertically = !stretchVertically; // Inscribe behaves inversely
      stretchVertically ?
        this._provider.setSize(this.actualAspectRatio * this.offsetHeight, this.offsetHeight) : // h
        this._provider.setSize(this.offsetWidth, this.offsetWidth / this.actualAspectRatio);   // w
    }
  }

  /** Update ready class state */
  protected updateReadyClass() {
    const target = TraversingQuery.first(this.readyClassTarget, this) as HTMLElement;
    target && CSSUtil.toggleClsTo(target, this.readyClass, this.ready);
  }

  /** Applied provider */
  public get providerType() {
    return this._provider ? this._provider.name : '';
  }

  /** Current player state, see {@link ESLMedia.PLAYER_STATES} values */
  public get state() {
    return this._provider ? this._provider.state : PlayerStates.UNINITIALIZED;
  }

  /** Duration of the media resource */
  public get duration() {
    return this._provider ? this._provider.duration : 0;
  }

  /** Current time of media resource */
  public get currentTime() {
    return this._provider ? this._provider.currentTime : 0;
  }

  /** Set current time of media resource */
  public set currentTime(time: number) {
    (this._provider) && this._provider.safeSeekTo(time);
  }

  /** ESLMediaQuery to limit ESLMedia loading */
  public get conditionQuery() {
    if (!this._conditionQuery && this._conditionQuery !== null) {
      const query = this.getAttribute('load-condition');
      this._conditionQuery = query ? new ESLMediaQuery(query) : null;
    }
    return this._conditionQuery;
  }

  /** Fill mode should be handled for element */
  public get fillModeEnabled() {
    return this.fillMode === 'cover' || this.fillMode === 'inscribe';
  }

  /** Used resource aspect ratio forced by attribute or returned by provider */
  public get actualAspectRatio() {
    if (this.aspectRatio && this.aspectRatio !== 'auto') return parseAspectRatio(this.aspectRatio);
    return this._provider ? this._provider.defaultAspectRatio : 0;
  }

  @bind
  protected _onRegistryStateChange(name: string) {
    if (name === this.mediaType) {
      this.reinitInstance();
    }
  }

  protected attachViewportConstraint() {
    if (this.playInViewport) {
      getIObserver().observe(this);
    }
  }
  protected detachViewportConstraint() {
    const observer = getIObserver(true);
    observer && observer.unobserve(this);
  }

  public $$fire(eventName: string, eventInit?: CustomEventInit): boolean {
    const ns = (this.constructor as typeof ESLMedia).eventNs;
    return EventUtils.dispatch(this, ns + eventName, eventInit);
  }
}
