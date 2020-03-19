/**
 * Brightcove API provider for {@link SmartMedia}
 * @version 1.0.0
 * @author Julia Murashko
 * @extends BaseProvider
 * @protected
 */
import {VideoJsPlayer} from 'video.js';
import {generateUId, loadScript} from '../../../../helpers/common-utils';
import {SmartMedia} from '../smart-media';
import {BaseProvider, PlayerStates} from '../smart-media-provider';
import SmartMediaProviderRegistry from '../smart-media-registry';

const API_SCRIPT_ID = 'BC_API_SOURCE';

export interface BCPlayerAccount {
	playerId: string;
	accountId: string;
}

export class BrightcoveProvider extends BaseProvider<HTMLVideoElement |  HTMLDivElement> {

	static get providerName() {
		return 'brightcove';
	}

	protected _api: VideoJsPlayer;
	protected _account: BCPlayerAccount;

	/**
	 * @returns {BCPlayerAccount} settings, get from element by default
	 */
	protected static getAccount(el: SmartMedia): BCPlayerAccount {
		return {
			playerId: el.getAttribute('player-id'),
			accountId: el.getAttribute('account-id')
		};
	}

	/**
	 * Loads player API according defined settings
	 * */
	protected static loadAPI(account: BCPlayerAccount): Promise<Event> {
		const apiSrc =
			`//players.brightcove.net/${account.accountId}/${account.playerId}_default/index.min.js`;
		const apiScript = document.getElementById(API_SCRIPT_ID);
		if (apiScript && apiScript.getAttribute('src') !== apiSrc) {
			apiScript.parentNode.removeChild(apiScript);
		}
		return loadScript(API_SCRIPT_ID, apiSrc);
	}

	/**
	 * Build video brightcove element
	 */
	protected static buildVideo(sm: SmartMedia, account: BCPlayerAccount) {
		const el = document.createElement('video');
		el.id = 'smedia-brightcove-' + generateUId();
		el.className = 'smedia-inner smedia-brightcove video-js vjs-default-skin video-js-brightcove';
		el.style.width = '100%';
		el.style.height = '100%';
		el.title = sm.title;
		el.autoplay = sm.autoplay;
		el.loop = sm.loop;
		el.muted = sm.muted;
		el.controls = sm.controls;
		el.setAttribute('aria-label', el.title);
		el.setAttribute('data-embed', 'default');
		el.setAttribute('data-player', account.playerId);
		el.setAttribute('data-account', account.accountId);
		el.setAttribute('data-video-id', `ref:${sm.mediaId}`);
		return el;
	}

	protected onAPILoaded() {
		if (typeof window.bc !== 'function' || typeof window.videojs !== 'function') {
			throw new Error('Brightcove API is not in the global scope');
		}
		this._api = window.videojs(this._el);
		this.onAPIReady();

		this._api.on('play', () => this.component._onPlay());
		this._api.on('pause', () => this.component._onPaused());
		this._api.on('ended', () => this.component._onEnded());

		this.component._onReady();
	}
	protected onAPIReady() {
		window.bc(this._el);
	}

	public bind() {
		const Provider = (this.constructor as typeof BrightcoveProvider);
		this._account = Provider.getAccount(this.component);
		this._el = Provider.buildVideo(this.component, this._account);
		this.component.appendChild(this._el);

		this._ready = Provider.loadAPI(this._account)
			.then(() => this.onAPILoaded())
			.catch((e) => this.component._onError(e));
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
		if (this._api && typeof this._api.el === 'function') {
			(this._api.el() as HTMLElement).focus();
		}
	}

	public get state() {
		if (this._api) {
			if (this._api.ended()) return PlayerStates.ENDED;
			if (this._api.paused()) return PlayerStates.PAUSED;
			if (!this._api.played()) return PlayerStates.UNSTARTED;
			return PlayerStates.PLAYING;
		}
		return PlayerStates.UNINITIALIZED;
	}

	public get defaultAspectRatio(): number {
		if (!this._api) return 0;
		return this._api.videoWidth() / this._api.videoHeight();
	}

	public get currentTime() {
		return this._api ? this._api.currentTime() : 0;
	}

	public get duration() {
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
		bc?: (el: HTMLElement, ...args: any[]) => any;
		videojs?: (el: HTMLElement, ...args: any[]) => VideoJsPlayer;
	}
}