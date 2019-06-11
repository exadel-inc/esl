/**
 * Youtube API provider for {@link SmartVideoEmbedded}
 * @version 1.0.0
 * @author Alexey Stsefanovich (ala'n)
 * @extends BaseProvider
 * @protected
 */
import {generateUId, loadScript} from '../../../../helpers/common-utils';
import SmartVideoEmbedded from '../smart-video-embedded';
import {BaseProvider, PlayerStates} from '../smart-video-provider';
import EmbeddedVideoProviderRegistry from '../smart-video-registry';

interface YT extends Promise<void> {
	Player: YT.Player,
}

declare global {
	interface Window {
		YT?: YT;
		onYouTubeIframeAPIReady?: () => void;
	}
}

interface VideoOptions {
	title: string,
	videoId: string,
	autoplay: boolean,
	hideControls: boolean
}

export class YouTubeProvider extends BaseProvider {
	private _el: HTMLIFrameElement;
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

	protected static buildIframeUrl(id: string, autoplay: boolean) {
		return `//www.youtube.com/embed/${id}?wmode=transparent&rel=0&showinfo=0&iv_load_policy=3&enablejsapi=1&autoplay=${Number(autoplay)}`;
	}

	protected static buildIframe(data: VideoOptions) {
		const el = document.createElement('iframe');
		el.id = 'yt-video-' + generateUId();
		el.className = 'sev-inner sev-youtube';
		el.style.width = '100%';
		el.style.height = '100%';
		el.title = data.title;
		el.setAttribute('aria-label', data.title);
		el.setAttribute('frameborder', '0');
		el.setAttribute('tabindex', '0');
		el.setAttribute('allowfullscreen', 'yes');
		el.src = YouTubeProvider.buildIframeUrl(data.videoId, data.autoplay);
		return el;
	}

	public bind() {
		const iframeLoad = new Promise((resolve) => {
			this._el = YouTubeProvider.buildIframe(this.component.buildOptions());
			this._el.onload = function () {
				resolve();
			};
			this.component.appendChild(this._el);
		});

		this._ready = Promise.all([YouTubeProvider.getCoreApi(), iframeLoad]).then(
			() => (new Promise((resolve, reject) => {
				this._api = new YT.Player(this._el, {
					events: {
						onError: () => reject(this), // TODO do smth with it
						onReady: () => resolve(this),
						onStateChange: this._onStateChange
					}
				});
			}))
		);
		this._ready.then(() => this.component._onReady());
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
				this.component._onEnded();
				break;
		}
	};

	public focus() {
		if (this._el && this._el.contentWindow) {
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

		setTimeout(() => {
			if (this.getState() !== PlayerStates.PLAYING) {
				this._api.mute();
				this._api.playVideo();
			}
		}, 100)
	}

	public pause() {
		this._api.pauseVideo();
	}

	public stop() {
		this._api.stopVideo();
	}
}

EmbeddedVideoProviderRegistry.register(YouTubeProvider, YouTubeProvider.videoName);

