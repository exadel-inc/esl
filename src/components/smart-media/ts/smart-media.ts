/**
 * Smart Media Embedded
 * @version 1.0.2
 * @author Alexey Stsefanovich (ala'n), Yuliya Adamskaya
 *
 * @description:
 * SmartMediaEmbedded - custom element, that provides ability to add and configure embedded video using one tag.
 * Supported features:
 * - extendable 'Providers' realization for different video types, support 'youtube' and 'brightcove' out of box
 * - single active player restriction by grouping elements
 * - provides events on state change
 * - provides 'HTMLMedia like' API that is safe and will executed after real api will be ready
 * - manual initialization - disabled component will not be initialized until it not enabled or play action triggered
 * - hot changes
 *
 * Attributes:
 * {String} media-id - id of embedded video
 * {String} media-type - type of video provider ('youtube', 'video')
 *
 * {String} [group] - group name, only one video player in group can be active
 *
 * {Boolean} [disabled] - prevents video api initialization
 *
 * {Boolean} [autofocus] - set focus to player on play
 * {Boolean} [autoplay] - start play automatically on initialization (note initialization not happens until video is disabled)
 * {Boolean} [hide-controls] - hiding video player controls
 * {Boolean} [hide-subtitles] - disable subtitles settings if player supports subtitles
 *
 *
 * @readonly {Boolean} ready - marker that indicates that video api loaded
 * @readonly {Boolean} active - marker that indicates that video paying
 *
 *
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

export class SmartMedia extends CustomElement {
    public static is = 'smart-media';

    @attr() public mediaId: string;
    @attr() public mediaSrc: string;
    @attr() public mediaType: string;
    @attr() public group: string;
    @attr() public fillMode: string;
    @attr({conditional: true}) public disabled: boolean;
    @attr({conditional: true}) public autoplay: boolean;
    @attr({conditional: true}) public autofocus: boolean;
    @attr({conditional: true}) public preload: boolean;
    @attr({conditional: true}) public muted: boolean;
    @attr({conditional: true}) public loop: boolean;
    @attr({conditional: true}) public controls: boolean;
    @attr({conditional: true}) public hideSubtitles: boolean;
    @attr({conditional: true, readonly: true}) public ready: boolean;
    @attr({conditional: true, readonly: true}) public active: boolean;
    @attr({conditional: true, readonly: true}) public playInViewport: boolean;

    private _provider: BaseProvider;
    private _conditionQuery: SmartQuery;

    /**
     * @enum Map with possible Player States
     * values: BUFFERING, ENDED, PAUSED, PLAYING, UNSTARTED, VIDEO_CUED, UNINITIALIZED
     */
    static get PLAYER_STATES() {
        return PlayerStates;
    }

    static get observedAttributes() {
        return ['media-type', 'disabled', 'media-id', 'media-src', 'fill-mode', 'video-aspect-ratio'];
    }

    constructor() {
        super();

        this._onError = this._onError.bind(this);
        this._onConditionStateChange = this._onConditionStateChange.bind(this);
        this._onChangeFillMode = this._onChangeFillMode.bind(this);
    }

    private connectedCallback() {
        this.classList.add(SmartMedia.is);
        this.setAttribute('role', 'application');
        this.innerHTML += '<!-- Inner Content, do not modify it manually -->';
        SmartMediaRegistry.addListener(this._onRegistryStateChange);
        this._onConditionStateChange();
        if (this.conditionQuery) {
            this.conditionQuery.addListener(this._onConditionStateChange);
        }

        // TODO: window throttled resize manager
        // TODO: subscribe only if needed
        // TODO: remove on unbind
        // window.addEventListener('resize', this._onChangeFillMode);
        !this.disabled && this.reinitInstance();
    }

    private disconnectedCallback() {
        SmartMediaRegistry.removeListener(this._onRegistryStateChange);
        if (this.conditionQuery) {
            this.conditionQuery.removeListener(this._onConditionStateChange);
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
                if (this._provider || this._provider === null) {
                    this.deferedReinit();
                }
                break;
            case 'disabled':
                if (!this._provider) {
                    this.deferedReinit();
                }
                break;
        }
    }

    private reinitInstance() {
        if (!this.disabled) {
            this._provider && this._provider.unbind();

            const provider = SmartMediaRegistry.getProvider(this.mediaType);
            if (provider) {
                this._provider = new provider(this);
                this._provider.bind();
                if (this.playInViewport) {
                    this.attachViewportConstraint();
                }
            } else {
                this._provider = null;
            }
        }
    }

    public deferedReinit = debounce(() => this.reinitInstance());

    private _updateMarkers(addValue: string, removeValue: string) {
        const target = this.getAttribute('marker-target');
        const targetEl = target ? this.closest(target) : this;
        (targetEl && addValue) && targetEl.classList.add(addValue);
        (targetEl && removeValue) && targetEl.classList.remove(removeValue);
    }

    private _onConditionStateChange() {
        if (!this.conditionQuery || this.conditionQuery.matches) {
            this.deferedReinit();
            if (this.state === PlayerStates.PAUSED) {
                this.play(true);
            }
            this._updateMarkers(
                this.getAttribute('load-condition-marker'),
                this.getAttribute('load-condition-declined-marker')
            );
        } else {
            this.pause();
            this._updateMarkers(
                this.getAttribute('load-condition-declined-marker'),
                this.getAttribute('load-condition-marker')
            );
        }
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
     * @returns {Promise | void}
     */
    public play(reset: boolean = false) {
        if (this.disabled && reset) {
            this.disabled = false;
        }
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
        this.setAttribute('ready', 'true');
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
        if (this.hasAttribute('ready-class')) {
            this.classList.remove(this.getAttribute('ready-class'));
        }
    }

    public _onPlay() {
        if (this.autofocus) {
            this.focus();
        }
        this.setAttribute('active', '');
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
        if (this.fillMode) {
            this.classList.add('fill');
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
