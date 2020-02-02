/**
 * Youtube API provider for {@link SmartVideo}
 * @version 1.0.0
 * @author Alexey Stsefanovich (ala'n), Yuliya Adamskaya
 * @extends BaseProvider
 * @protected
 */
import {generateUId, loadScript} from '@helpers/common-utils';
import {SmartVideo, VideoOptions} from '../smart-video';
import {BaseProvider, PlayerStates} from '../smart-video-provider';
import EmbeddedVideoProviderRegistry from '../smart-video-registry';
import PlayerVars = YT.PlayerVars;

declare global {
	interface YT extends Promise<void> {
		Player: YT.Player,
	}
	interface Window {
		YT?: YT;
		onYouTubeIframeAPIReady?: () => void;
	}
}

export class YouTubeProvider extends BaseProvider {
	private _el: HTMLDivElement | HTMLIFrameElement;
	private _api: YT.Player;

	static get videoName() {
		return 'youtube';
	}

	private static _coreApiPromise: Promise<void>;

	protected static getCoreApi() {
		if (!YouTubeProvider._coreApiPromise) {
			YouTubeProvider._coreApiPromise = new Promise((resolve) => {
				if (window.YT && window.YT.Player) {
					return resolve(window.YT);
				}
				loadScript('YT_API_SOURCE', '//www.youtube.com/iframe_api');
				const cbOrigin = window.onYouTubeIframeAPIReady;
				window.onYouTubeIframeAPIReady = () => {
					try {
						(typeof cbOrigin === 'function') && cbOrigin.apply(window);
					} catch (err) { // eslint-disable-line
						// Do Nothing
					}
					return resolve(window.YT);
				};
			});
		}
		return YouTubeProvider._coreApiPromise;
	}

	protected static mapOptions(options: VideoOptions): PlayerVars {
		return {
			enablejsapi: 1,
			origin: location.origin,
			rel: 0,
			showinfo: 0,
			iv_load_policy: 0,
			autoplay: Number(options.autoplay),
			controls: Number(options.controls),
			disablekb: Number(!options.controls), // TODO: criteria
			autohide: Number(!options.controls) // TODO: criteria
		};
	}
	protected static buildIframe(data: VideoOptions) {
		const el = document.createElement('div');
		el.id = 'yt-video-' + generateUId();
		el.className = 'sev-inner sev-youtube';
		el.title = data.title;
		el.setAttribute('aria-label', data.title);
		el.setAttribute('frameborder', '0');
		el.setAttribute('tabindex', '0');
		el.setAttribute('allowfullscreen', 'yes');
		return el;
	}

	public bind() {
		this._el = YouTubeProvider.buildIframe(this.component.buildOptions());
		this.component.appendChild(this._el);
		this._ready = YouTubeProvider.getCoreApi().then(
			() => (new Promise((resolve, reject) => {
				this._api = new YT.Player(this._el.id, {
					videoId: this.component.videoId,
					events: {
						onError: () => reject(this), // TODO do smth with it
						onReady: () => resolve(this),
						onStateChange: this._onStateChange
					},
					playerVars: YouTubeProvider.mapOptions(this.component.buildOptions())
				});
			}))
		);
		this._ready.then(() => {
			this._el = this._api.getIframe();
			if (this.component.muted) {
				this._api.mute()
			}
			this.component._onReady()
		});
	}

	public unbind() {
		this.component._onDetach();
		if (this._api) {
			this._api.destroy();
			this._api = null;
		}
		if (this._el && this._el.parentNode) {
			this._el.parentNode.removeChild(this._el);
		}
	}

	private _onStateChange = (event: YT.OnStateChangeEvent) => {
		switch (+event.data) {
			case PlayerStates.PLAYING:
				this.component._onPlay();
				break;
			case PlayerStates.PAUSED:
				this.component._onPaused();
				break;
			case PlayerStates.ENDED:
				if (this.component.loop) {
					this._api.playVideo();
				} else {
					this.component._onEnded();
				}
				break;
		}
	};

	public focus() {
		if (this._el instanceof HTMLIFrameElement && this._el.contentWindow) {
			this._el.contentWindow.focus();
		}
	}

	public getState() {
		if (this._api && typeof this._api.getPlayerState === 'function') {
			return this._api.getPlayerState();
		}
		return PlayerStates.UNINITIALIZED;
	}

	public seekTo(pos: number) {
		this._api.seekTo(pos, false);
	}

	public play() {
		if (this.getState() === PlayerStates.ENDED) {
			this._api.seekTo(0, false);
		}
		this._api.playVideo();
	}

	public pause() {
		this._api.pauseVideo();
	}

	public stop() {
		this._api.stopVideo();
	}
}

EmbeddedVideoProviderRegistry.register(YouTubeProvider, YouTubeProvider.videoName);
