/**
 * Smart Video Embedded
 * @version 1.0.2
 * @author Alexey Stsefanovich (ala'n)
 *
 * @description:
 * SmartVideoEmbedded - custom element, that provides ability to add and configure embedded video using one tag.
 * Supported features:
 * - extendable 'Providers' realization for different video types, support 'youtube' and 'brightcove' out of box
 * - single active player restriction by grouping elements
 * - provides events on state change
 * - provides 'HTMLMedia like' API that is safe and will executed after real api will be ready
 * - manual initialization - disabled component will not be initialized until it not enabled or play action triggered
 * - hot changes
 *
 * Attributes:
 * {String} video-id - id of embedded video
 * {String} video-type - type of video provider ('youtube', 'brightcove')
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
 * <smart-video-embedded
 *    [disabled]
 *    title="Video Title"
 *    [group="videoGroup"]
 *    video-type="youtube|brightcove"
 *    video-id="##VIDEOID##"></smart-video-embedded>
 */
import {debounce} from '../../../helpers/function-utils';

import VideoGroupRestrictionManager from './smart-video-manager';

import {attr} from '../../../helpers/custom-element-utils';
import {BaseProvider, PlayerStates} from './smart-video-provider';
import providerRegistry from './smart-video-registry';

export class SmartVideoEmbedded extends HTMLElement {
	@attr() public videoId: string;
	@attr() public videoType: string;
	@attr() public group: string;
	@attr({conditional: true}) public disabled: boolean;
	@attr({conditional: true}) private autoplay: boolean;
	@attr({conditional: true}) private autofocus: boolean;
	@attr({conditional: true}) private hideControls: boolean;
	@attr({conditional: true}) private hideSubtitles: boolean;
	@attr({conditional: true, readonly: true}) public ready: boolean;
	@attr({conditional: true, readonly: true}) public active: boolean;

	private _provider: BaseProvider;

	static get is() {
		return 'smart-video-embedded';
	}

	/**
	 * @enum Map with possible Player States
	 * values: BUFFERING, ENDED, PAUSED, PLAYING, UNSTARTED, VIDEO_CUED, UNINITIALIZED
	 */
	static get PLAYER_STATES() {
		return PlayerStates;
	}

	static get observedAttributes() {
		return ['video-id', 'video-type', 'disabled'];
	}

	private connectedCallback() {
		this.classList.add(SmartVideoEmbedded.is);
		this.setAttribute('role', 'application');
		this.innerHTML += '<!-- Inner Content, do not modify it manually -->';
		providerRegistry.addListener(this._onRegistryStateChange);
		!this.disabled && this.reinitInstance();
	}

	private disconnectedCallback() {
		providerRegistry.removeListener(this._onRegistryStateChange);
		this._provider && this._provider.unbind();
	}

	private attributeChangedCallback(attrName: string, oldVal: string, newVal: string) {
		if (oldVal === newVal) return;
		switch (attrName) {
			case 'video-id':
			case 'video-type':
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

			const provider = providerRegistry.getProvider(this.videoType);
			if (provider) {
				this._provider = new provider(this);
				this._provider.bind();
			} else {
				this._provider = null;
			}
		}
	}

	public deferedReinit = debounce(() => this.reinitInstance());

	public buildOptions() {
		return {
			title: this.title,
			videoId: this.videoId,
			autoplay: this.autoplay,
			hideControls: this.hideControls
		};
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
	public play() {
		if (this.disabled) {
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

	/**
	 * Current player state, see {@link SmartVideoEmbedded.PLAYER_STATES} values
	 */
	get state() {
		return this._provider ? this._provider.getState() : PlayerStates.UNINITIALIZED;
	}

	private _onRegistryStateChange = (name: string) => {
		if (name === this.videoType) {
			this.reinitInstance();
		}
	};
}

customElements.define(SmartVideoEmbedded.is, SmartVideoEmbedded);
export default SmartVideoEmbedded;
