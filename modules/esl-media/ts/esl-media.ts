/**
 * ESL Media
 * @version 1.2.0
 * @author Alexey Stsefanovich (ala'n), Yuliya Adamskaya
 */

import {ExportNs} from '../../esl-utils/enviroment/export-ns';
import {ESLBaseElement, attr, boolAttr} from '../../esl-base-element/esl-base-element';
import {debounce} from '../../esl-utils/async/debounce';
import {rafDecorator} from '../../esl-utils/async/raf';
import {ESLMediaQuery} from '../../esl-utils/conditions/esl-media-query';
import {parseAspectRatio} from '../../esl-utils/misc/format';

import {getIObserver} from './esl-media-iobserver';
import {BaseProvider, PlayerStates} from './esl-media-provider';
import ESLMediaRegistry from './esl-media-registry';
import MediaGroupRestrictionManager from './esl-media-manager';
import {CSSUtil} from '../../esl-utils/dom/styles';

@ExportNs('Media')
export class ESLMedia extends ESLBaseElement {
  public static is = 'esl-media';
  public static eventNs = 'esl:media';

  @attr() public mediaId: string;
  @attr() public mediaSrc: string;
  @attr() public mediaType: string;
  @attr() public group: string;
  @attr() public fillMode: string;
  @attr() public aspectRatio: string;

  @boolAttr() public disabled: boolean;
  @boolAttr() public autoplay: boolean;
  @boolAttr() public autofocus: boolean;
  @boolAttr() public muted: boolean;
  @boolAttr() public loop: boolean;
  @boolAttr() public controls: boolean;
  @boolAttr() public playsinline: boolean;
  @boolAttr() public playInViewport: boolean;

  @attr({defaultValue: 'auto'}) public preload: string;

  @boolAttr({readonly: true}) public ready: boolean;
  @boolAttr({readonly: true}) public active: boolean;
  @boolAttr({readonly: true}) public played: boolean;
  @boolAttr({readonly: true}) public error: boolean;

  private _provider: BaseProvider<HTMLElement> | null;
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
    return ['media-type', 'disabled', 'media-id', 'media-src', 'fill-mode', 'aspect-ratio', 'play-in-viewport', 'playsinline', 'muted', 'loop', 'autoplay', 'controls'];
  }

  static support(name: string): boolean {
    return ESLMediaRegistry.has(name);
  }

  protected connectedCallback() {
    super.connectedCallback();
    if (!this.hasAttribute('role')) {
      this.setAttribute('role', 'application');
    }
    this.innerHTML += '<!-- Inner Content, do not modify it manually -->';
    ESLMediaRegistry.addListener(this._onRegistryStateChange);
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
    ESLMediaRegistry.removeListener(this._onRegistryStateChange);
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
    if (!this.connected && oldVal === newVal) return;
    switch (attrName) {
      case 'disabled':
        (oldVal !== null) && this.deferredReinitialize();
        break;
      case 'loop':
      case 'muted':
      case 'autoplay':
      case 'controls':
      case 'playsinline':
        this._provider && this._provider.safeChangeConfig(attrName, newVal !== null);
        break;
      case 'media-id':
      case 'media-src':
      case 'media-type':
        this.deferredReinitialize();
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
    // TODO: optimize, constraint for simple changes
    this._provider && this._provider.unbind();
    this._provider = null;
    if (this.canActivate()) {
      this._provider = ESLMediaRegistry.createProvider(this);
      if (this._provider) {
        this._provider.bind();
      } else {
        this._onError();
      }

    }
    this._updateContainerMarkers();
  }

  private _updateContainerMarkers() {
    const target = this.getAttribute('load-cls-target');
    const targetEl = !target || target === 'parent' ? this.parentNode as HTMLElement : this.closest(target);

    const activeCls = this.getAttribute('load-accepted-cls');
    const inactiveCls = this.getAttribute('load-declined-cls');

    const active = this.canActivate();
    (targetEl && activeCls) && targetEl.classList.toggle(activeCls, active);
    (targetEl && inactiveCls) && targetEl.classList.toggle(inactiveCls, !active);
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
      this.autoplay = true;
    }
    if (!this.canActivate()) return;
    this.deferredReinitialize.then(() => {
      this._provider && this._provider.safePlay();
    }, true);
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

  /**
   * @override
   */
  public focus() {
    this._provider && this._provider.focus();
  }

  // media live-cycle handlers
  public _onReady() {
    this.setAttribute('ready', '');
    CSSUtil.addCls(this, this.getAttribute('ready-class'));
    this.deferredResize();
    this.$$fireNs('ready');
  }

  public _onError(detail?: any, setReadyState = true) {
    this.setAttribute('ready', '');
    this.setAttribute('error', '');
    this.$$fireNs('error', {detail});
    setReadyState && this.$$fireNs('ready');
  }

  public _onDetach() {
    this.removeAttribute('active');
    this.removeAttribute('ready');
    this.removeAttribute('played');
    CSSUtil.removeCls(this, this.getAttribute('ready-class'));
    this.$$fireNs('detach');
  }

  public _onPlay() {
    if (this.autofocus) this.focus();
    this.deferredResize();
    this.setAttribute('active', '');
    this.setAttribute('played', '');
    this.$$fireNs('play');
    MediaGroupRestrictionManager.registerPlay(this);
  }

  public _onPaused() {
    this.removeAttribute('active');
    this.$$fireNs('paused');
    MediaGroupRestrictionManager.unregister(this);
  }

  public _onEnded() {
    this.removeAttribute('active');
    this.$$fireNs('ended');
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

  /**
   * Current player state, see {@link ESLMedia.PLAYER_STATES} values
   */
  get state() {
    return this._provider ? this._provider.state : PlayerStates.UNINITIALIZED;
  }

  /**
   * Duration of the media resource
   */
  public get duration() {
    return this._provider ? this._provider.duration : 0;
  }

  /**
   * Current time of media resource
   */
  public get currentTime() {
    return this._provider ? this._provider.currentTime : 0;
  }

  /**
   * Set current time of media resource
   */
  public set currentTime(time: number) {
    (this._provider) && this._provider.safeSeekTo(time);
  }

  get conditionQuery() {
    if (!this._conditionQuery && this._conditionQuery !== null) {
      const query = this.getAttribute('load-condition');
      this._conditionQuery = query ? new ESLMediaQuery(query) : null;
    }
    return this._conditionQuery;
  }

  get fillModeEnabled() {
    return this.fillMode === 'cover' || this.fillMode === 'inscribe';
  }

  get actualAspectRatio() {
    if (this.aspectRatio && this.aspectRatio !== 'auto') return parseAspectRatio(this.aspectRatio);
    return this._provider ? this._provider.defaultAspectRatio : 0;
  }

  private _onRegistryStateChange = (name: string) => {
    if (name === this.mediaType) {
      this.reinitInstance();
    }
  };

  public attachViewportConstraint() {
    if (this.playInViewport) {
      getIObserver().observe(this);
    }
  }

  public detachViewportConstraint() {
    const observer = getIObserver(true);
    observer && observer.unobserve(this);
  }
}

export default ESLMedia;
