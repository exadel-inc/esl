/**
 * Brightcove API provider for {@link SmartMedia}
 * @version 1.0.0
 * @author Julia Murashko
 * @extends BaseProvider
 * @protected
 */
import {VideoJsPlayer} from 'video.js';
import {generateUId, loadScript} from '../../../../../helpers/common-utils';
import {SmartMedia} from '../../smart-media';
import {BaseProvider, PlayerStates} from '../../smart-media-provider';
import SmartMediaProviderRegistry from '../../smart-media-registry';

const API_SCRIPT_ID = 'BC_API_SOURCE';

export class BrightcoveProvider extends BaseProvider<HTMLVideoElement |  HTMLDivElement> {

	protected _api: VideoJsPlayer;
	protected _playerId: string;
	protected _accountId: string;

	static get providerName() {
		return 'brightcove';
	}

	protected buildVideo(sm: SmartMedia) {
		const el = document.createElement('video');
		el.id = 'smedia-brightcove-' + generateUId();
		el.className = 'smedia-inner smedia-brightcove video-js vjs-default-skin video-js-brightcove';
		el.title = sm.title;
		el.style.width = '100%';
		el.style.height = '100%';
		el.autoplay = sm.autoplay;
		el.loop = sm.loop;
		el.muted = sm.muted;
		el.controls = sm.controls;
		el.setAttribute('aria-label', el.title);
		el.setAttribute('data-embed', 'default');
		el.setAttribute('data-account', this._accountId);
		el.setAttribute('data-player', sm.getAttribute('player-id'));
		el.setAttribute('data-video-id', `ref:${sm.mediaId}`);
		return el;
	}

	protected initializePlayer() {
		const apiSrc = `//players.brightcove.net/${this._accountId}/${this._playerId}_default/index.min.js`;
		const apiScript = document.getElementById(API_SCRIPT_ID);
		if (apiScript && apiScript.getAttribute('src') !== apiSrc) {
			apiScript.parentNode.removeChild(apiScript);
		}
		this._ready = loadScript(API_SCRIPT_ID, apiSrc);

		this._ready = this._ready.then(() => {
            if (typeof window.bc !== 'function' || typeof window.videojs !== 'function') {
                throw new Error('Brightcove API is not in the global scope');
            }
            this._api = window.videojs(this._el);
            this.onAPIReady();

            this._api.on('play', () => this.component._onPlay());
            this._api.on('pause', () => this.component._onPaused());
            this._api.on('ended', () => this.component._onEnded());
			// API replaced element
			this._el = this._api.el() as HTMLDivElement;
            this.component._onReady();
        });
	}

	public bind() {
        this._playerId = this.component.getAttribute('player-id');
        this._accountId = this.component.getAttribute('account-id');
		this._el = this.buildVideo(this.component);
		this.component.appendChild(this._el);

		this.initializePlayer();
	}

	protected onAPIReady() {
		window.bc(this._el);
	}

	public unbind() {
		this.component._onDetach();
		if (this._api) {
			this._api.dispose();
			this._api = null;
		}
		const embedded = this.component.querySelectorAll('.smedia-brightcove');
		Array.from(embedded || []).forEach((el: Node) => el.parentNode.removeChild(el));
	}

	public focus() {
		this._el && this._el.focus();
	}

	get state() {
		if (this._api) {
			if (this._api.ended()) return PlayerStates.ENDED;
			if (this._api.paused()) return PlayerStates.PAUSED;
			if (!this._api.played()) return PlayerStates.UNSTARTED;
			return PlayerStates.PLAYING;
		}
		return PlayerStates.UNINITIALIZED;
	}

	get defaultAspectRatio(): number {
		if (!this._api) return 0;
		return this._api.videoWidth() / this._api.videoHeight();
	}

	get currentTime() {
		return this._api ? this._api.currentTime() : 0;
	}

	get duration() {
		return this._api ? this._api.duration() : 0;
	}

	public seekTo(pos: number) {
		this._api.currentTime(pos);
	}

	public play() {
		this._api.play();
	}

	public pause() {
		this._api.pause();
	}

	public stop() {
		this._api.pause();
		this._api.currentTime(0);
	}
}

SmartMediaProviderRegistry.register(BrightcoveProvider, BrightcoveProvider.providerName);

// typings
declare global {
	interface Window {
		bc?: (el: HTMLElement) => void;
		videojs?: (el: HTMLElement) => VideoJsPlayer;
	}
}