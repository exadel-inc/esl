/**
 * Smart Media
 * @version 1.0.2
 * @author Alexey Stsefanovich (ala'n), Yuliya Adamskaya
 *
 * @description:
 * SmartMedia - custom element, that provides ability to add and configure media using one tag.
 * Supported features:
 * TODO: update
 * - extendable 'Providers' realization for different media types, support 'youtube' and 'brightcove' out of box
 * - single active player restriction by grouping elements
 * - provides events on state change
 * - provides 'HTMLMedia like' API that is safe and will executed after real api will be ready
 * - manual initialization - disabled component will not be initialized until it not enabled or play action triggered
 * - hot changes
 *
 * Attributes:
 * {String} media-src - media resource src
 * {String} media-id - id of media
 * {String} media-type - type of media provider ('youtube', 'video')
 *
 * {String} [group] - group name, only one media player in group can be active
 *
 * {Boolean} [disabled] - prevents media api initialization
 *
 * {Boolean} [autofocus] - set focus to player on play
 * {Boolean} [autoplay] - start play automatically on initialization (note initialization not happens until media is disabled)
 * {Boolean} [controls] - show media player controls
 *
 * // [no support] {Boolean} [hide-subtitles] - disable subtitles settings if player supports subtitles
 *
 *
 * @readonly {Boolean} error - marker that indicates that media initialized with error
 * @readonly {Boolean} ready - marker that indicates that media api loaded
 * @readonly {Boolean} played - marker that indicates that media payed
 * @readonly {Boolean} active - marker that indicates that media paying
 *
 *
 * @event error - (bubbles) happens when media api is initialized with error
 * @event smedia:ready - (bubbles) happens when media api is ready
 * @event smedia:play - (bubbles) happens when media starts playing
 * @event smedia:paused - (bubbles) happens when media paused
 * @event smedia:ended - (bubbles) happens when media ends
 *
 * @event smedia:mangedpause - (bubbles) happens when media paused by media group restriction manager
 *
 * @example:
 * <smart-media
 *    [disabled]
 *    title="Video Title"
 *    [group="mediaGroup"]
 *    media-type="youtube|video"
 *    media-id="##MEDIAID##"></smart-media-embedded>
 */
import {CustomElement} from '@helpers/custom-element';
import {attr} from '@helpers/decorators/attr';
import {debounce, rafDecorator} from '@helpers/function-utils';
import {getIObserver} from './smart-media-iobserver';
import SmartQuery from '@components/smart-query/ts/smart-query';
import {BaseProvider, PlayerStates} from './smart-media-provider';
import SmartMediaRegistry from './smart-media-registry';
import MediaGroupRestrictionManager from './smart-media-manager';
import {parseAspectRatio} from '@helpers/format-utils';

export class SmartMedia extends CustomElement {
    public static is = 'smart-media';
    public static eventNs = 'smedia';

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

    private _provider: BaseProvider<HTMLElement>;
    private _conditionQuery: SmartQuery;

    private deferredReinit = debounce(() => this.reinitInstance());
    private deferredChangeFillMode = rafDecorator(() => this._onChangeFillMode());

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
        if (this.isFillModeEnabled()) {
            window.addEventListener('resize', this.deferredChangeFillMode);
        }
        this.deferredReinit();
    }

    private disconnectedCallback() {
        SmartMediaRegistry.removeListener(this._onRegistryStateChange);
        if (this.conditionQuery) {
            this.conditionQuery.removeListener(this.deferredReinit);
        }
        if (this.isFillModeEnabled()) {
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
                if (this.isFillModeEnabled()) {
                    this.deferredChangeFillMode();
                } else {
                    this._provider.setSize('auto', 'auto');
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

    /**
     * @override
     */
    public focus() {
        this._provider && this._provider.focus();
    }

    // media live-cycle handlers
    public _onReady() {
        this.setAttribute('ready', '');
        if (this.hasAttribute('ready-class')) {
            this.classList.add(this.getAttribute('ready-class'));
        }
        if (this.isFillModeEnabled()) {
            this.deferredChangeFillMode();
        }
        this.dispatchCustomEvent('ready');
    }

    public _onError(detail?: any, setReadyState = true) {
        this.setAttribute('ready', '');
        this.setAttribute('error', '');
        this.dispatchCustomEvent('error', {
            bubbles: true,
            detail
        });
        setReadyState && this.dispatchCustomEvent('ready');
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
        this.dispatchCustomEvent('play');
        MediaGroupRestrictionManager.registerPlay(this);
    }

    public _onPaused() {
        this.removeAttribute('active');
        this.dispatchCustomEvent('paused');
        MediaGroupRestrictionManager.unregister(this);
    }

    public _onEnded() {
        this.removeAttribute('active');
        this.dispatchCustomEvent('ended');
        MediaGroupRestrictionManager.unregister(this);
    }

    public _onChangeFillMode() {
        if (!this._provider) return;
        if (this.actualAspectRatio <= 0) {
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

    isFillModeEnabled() {
        return this.fillMode === 'cover' || this.fillMode === 'inscribe';
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
