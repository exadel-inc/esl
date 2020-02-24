/**
 * Smart Media Embedded
 * @version 1.0.2
 * @author Alexey Stsefanovich (ala'n), Yuliya Adamskaya
 *
 * @description:
 * SmartMediaEmbedded - custom element, that provides ability to add and configure embedded video using one tag.
 * Supported features:
 * TODO: update
 * - extendable 'Providers' realization for different video types, support 'youtube' and 'brightcove' out of box
 * - single active player restriction by grouping elements
 * - provides events on state change
 * - provides 'HTMLMedia like' API that is safe and will executed after real api will be ready
 * - manual initialization - disabled component will not be initialized until it not enabled or play action triggered
 * - hot changes
 *
 * Attributes:
 * {String} media-src - media resource src
 * {String} media-id - id of embedded video
 * {String} media-type - type of video provider ('youtube', 'video')
 *
 * {String} [group] - group name, only one video player in group can be active
 *
 * {Boolean} [disabled] - prevents video api initialization
 *
 * {Boolean} [autofocus] - set focus to player on play
 * {Boolean} [autoplay] - start play automatically on initialization (note initialization not happens until video is disabled)
 * {Boolean} [controls] - show video player controls
 *
 * // [no support] {Boolean} [hide-subtitles] - disable subtitles settings if player supports subtitles
 *
 *
 * @readonly {Boolean} error - marker that indicates that video initialized with error
 * @readonly {Boolean} ready - marker that indicates that video api loaded
 * @readonly {Boolean} played - marker that indicates that video payed
 * @readonly {Boolean} active - marker that indicates that video paying
 *
 *
 * @event error - (bubbles) happens when video api is initialized with error
 * @event evideo:ready - (bubbles) happens when video api is ready
 * @event evideo:play - (bubbles) happens when video starts playing
 * @event evideo:paused - (bubbles) happens when video paused
 * @event evideo:ended - (bubbles) happens when video ends
 *
 * @event evideo:mangedpause - (bubbles) happens when video paused by video group restriction manager
 *
 * @example:
 * <smart-media
 *    [disabled]
 *    title="Video Title"
 *    [group="videoGroup"]
 *    media-type="youtube|video"
 *    media-id="##MEDIAID##"></smart-media-embedded>
 */
import {CustomElement} from '@helpers/custom-element';
import {attr} from '@helpers/decorators/attr';
import {debounce} from '@helpers/function-utils';
import {getIObserver} from './smart-media-iobserver';
import SmartQuery from '@components/smart-query/ts/smart-query';
import {BaseProvider, PlayerStates} from './smart-media-provider';
import SmartMediaRegistry from './smart-media-registry';
import {triggerComponentEvent} from '@helpers/component-utils';
import VideoGroupRestrictionManager from './smart-media-manager';
import {parseAspectRatio, DEFAULT_ASPECT_RATIO} from '@helpers/format-utils';

export class SmartMedia extends CustomElement {
    public static is = 'smart-media';

    @attr() public mediaId: string;
    @attr() public mediaSrc: string;
    @attr() public mediaType: string;
    @attr() public group: string;
    @attr() public fillMode: string;
    @attr() public aspectRatio: string;
    @attr({conditional: true}) public disabled: boolean;
    @attr({conditional: true}) public autoplay: boolean;
    @attr({conditional: true}) public autofocus: boolean;
    @attr({conditional: true}) public preload: boolean;
    @attr({conditional: true}) public muted: boolean;
    @attr({conditional: true}) public loop: boolean;
    @attr({conditional: true}) public controls: boolean;
    @attr({conditional: true}) public playInViewport: boolean;
    @attr({conditional: true, readonly: true}) public ready: boolean;
    @attr({conditional: true, readonly: true}) public active: boolean;
    @attr({conditional: true, readonly: true}) public played: boolean;
    @attr({conditional: true, readonly: true}) public error: boolean;

    private _provider: BaseProvider;
    private _conditionQuery: SmartQuery;

    private deferredReinit = debounce(() => this.reinitInstance());
    private deferredChangeFillMode = debounce(() => this._onChangeFillMode(), 200);

    /**
     * @enum Map with possible Player States
     * values: BUFFERING, ENDED, PAUSED, PLAYING, UNSTARTED, VIDEO_CUED, UNINITIALIZED
     */
    static get PLAYER_STATES() {
        return PlayerStates;
    }

    static get observedAttributes() {
        return ['media-type', 'disabled', 'media-id', 'media-src', 'fill-mode', 'aspect-ratio', 'play-in-viewport'];
    }

    constructor() {
        super();

        this._onError = this._onError.bind(this);
        this._onChangeFillMode = this._onChangeFillMode.bind(this);
    }

    private connectedCallback() {
        this.classList.add(SmartMedia.is);
        if (!this.hasAttribute('role')) {
            this.setAttribute('role', 'application');
        }
        this.innerHTML += '<!-- Inner Content, do not modify it manually -->';
        SmartMediaRegistry.addListener(this._onRegistryStateChange);
        if (this.conditionQuery) {
            this.conditionQuery.addListener(this.deferredReinit);
        }
        if (this.playInViewport) {
            this.attachViewportConstraint();
        }
        if (this.fillModeCover) {
            window.addEventListener('resize', this.deferredChangeFillMode);
        }
        this.deferredReinit();
    }

    private disconnectedCallback() {
        SmartMediaRegistry.removeListener(this._onRegistryStateChange);
        if (this.conditionQuery) {
            this.conditionQuery.removeListener(this.deferredReinit);
        }
        if (this.fillModeCover) {
            window.removeEventListener('resize', this.deferredChangeFillMode);
        }
        this.detachViewportConstraint();
        this._provider && this._provider.unbind();
    }

    private attributeChangedCallback(attrName: string, oldVal: string, newVal: string) {
        if (oldVal === newVal) return;
        switch (attrName) {
            case 'media-id':
            case 'media-src':
            case 'media-type':
            case 'disabled':
                this.deferredReinit();
                break;
            case 'fill-mode':
            case 'aspect-ratio':
                if (this.fillModeCover) {
                    this.deferredChangeFillMode();
                }
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
            const provider = SmartMediaRegistry.getProvider(this.mediaType);
            if (provider) {
                this._provider = new provider(this);
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
     * Seek to given position of video
     * @returns {Promise | void}
     */
    public seekTo(pos: number) {
        return this._provider && this._provider.safeSeekTo(pos);
    }

    /**
     * Start playing video
     * @param {boolean} allowActivate
     * @returns {Promise | void}
     */
    public play(allowActivate: boolean = false) {
        if (this.disabled && allowActivate) {
            this.disabled = false;
        }
        if (!this.canActivate()) return;
        return this._provider && this._provider.safePlay();
    }

    /**
     * Pause playing video
     * @returns {Promise | void}
     */
    public pause() {
        return this._provider && this._provider.safePause();
    }

    /**
     * Stop playing video
     * @returns {Promise | void}
     */
    public stop() {
        return this._provider && this._provider.safeStop();
    }

    /**
     * Toggle play/pause state of the video
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

    // Video live-cycle handlers
    public _onReady() {
        this.setAttribute('ready', '');
        if (this.hasAttribute('ready-class')) {
            this.classList.add(this.getAttribute('ready-class'));
        }
        this.dispatchEvent(new Event('evideo:ready', {bubbles: true}));
    }

    public _onError() {
        this.setAttribute('ready', '');
        this.setAttribute('error', '');
        triggerComponentEvent(this, 'error');
        triggerComponentEvent(this, 'ready');
    }

    public _onDetach() {
        this.removeAttribute('active');
        this.removeAttribute('ready');
        this.removeAttribute('played');
        if (this.hasAttribute('ready-class')) {
            this.classList.remove(this.getAttribute('ready-class'));
        }
    }

    public _onPlay() {
        if (this.autofocus) this.focus();
        this.setAttribute('active', '');
        this.setAttribute('played', '');
        this.dispatchEvent(new Event('evideo:play', {bubbles: true}));
        VideoGroupRestrictionManager.registerPlay(this);
    }

    public _onPaused() {
        this.removeAttribute('active');
        this.dispatchEvent(new Event('evideo:paused', {bubbles: true}));
        VideoGroupRestrictionManager.unregister(this);
    }

    public _onEnded() {
        this.removeAttribute('active');
        this.dispatchEvent(new Event('evideo:ended', {bubbles: true}));
        VideoGroupRestrictionManager.unregister(this);
    }

    // consider IE/EDGE detection + object-fit and JS fallback (old smart-media) for videos and just JS option for iframes
    // for you-tube it definitely will be a aspect-ratio based calculation
    public _onChangeFillMode() {
        // TODO
        if (this._provider) {
            if (!this.actualAspectRatio) {
                this._provider.setSize('auto', 'auto');
            } else {
                this.actualAspectRatio < DEFAULT_ASPECT_RATIO ?
                    this._provider.setSize(this.actualAspectRatio * this.offsetHeight, this.offsetHeight) :
                    this._provider.setSize(this.offsetWidth, this.offsetWidth / this.actualAspectRatio);
                console.log(this._provider.defaultAspectRatio);
            }
        }
    }

    /**
     * Current player state, see {@link SmartMedia.PLAYER_STATES} values
     */
    get state() {
        return this._provider ? this._provider.getState() : PlayerStates.UNINITIALIZED;
    }

    get conditionQuery() {
        if (!this._conditionQuery && this._conditionQuery !== null) {
            const query = this.getAttribute('load-condition');
            this._conditionQuery = query ? new SmartQuery(query) : null;
        }
        return this._conditionQuery;
    }

    get fillModeCover() {
        return this.fillMode === 'cover';
    }

    get actualAspectRatio() {
        if (this.aspectRatio) {
            return parseAspectRatio(this.aspectRatio);
        }
        return this._provider ? this._provider.defaultAspectRatio : 0;
    }

    private _onRegistryStateChange = (name: string) => {
        if (name === this.mediaType) {
            this.reinitInstance();
        }
    };

    public attachViewportConstraint() {
        getIObserver().observe(this);
    }

    public detachViewportConstraint() {
        const observer = getIObserver(true);
        observer && observer.unobserve(this);
    }
}

export default SmartMedia;
