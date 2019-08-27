/**
 * BaseProvider class for video API providers
 * @version 1.0.0
 * @author Alexey Stsefanovich (ala'n)
 */
import SmartVideo from './smart-video';
import PlayerState = YT.PlayerState;

export enum PlayerStates {
	BUFFERING = 3,
	ENDED = 0,
	PAUSED = 2,
	PLAYING = 1,
	UNSTARTED = -1,
	VIDEO_CUED = 5,
	UNINITIALIZED = null
}

export type BaseProviderConstructor = new(component: SmartVideo) => BaseProvider;

export abstract class BaseProvider {
	protected component: SmartVideo;
	protected _ready: Promise<any>;

	public constructor(component: SmartVideo) {
		this.component = component;
	}

	/**
	 * Wraps _ready promise
	 * @returns {Promise}
	 */
	get ready() {
		if (!this._ready) {
			const res = Promise.reject('Not Initialized');
			// eslint-disable-next-line no-console
			res.catch((e) => console.log('Rejected Video Operation: ', e));
			return res;
		}
		return this._ready;
	}

	public abstract bind(): void;
	public abstract unbind(): void;

	public abstract getState(): PlayerStates | PlayerState;

	protected abstract seekTo(pos?: number): void;
	protected abstract play(): void;
	protected abstract pause(): void;
	protected abstract stop(): void;

	public abstract focus(): void;

	protected toggle() {
		if (this.getState() === PlayerStates.PAUSED) {
			this.play();
		} else {
			this.pause();
		}
	}

	// Safe methods executed after api ready
	public safeSeekTo(pos: number) {
		this.ready.then(() => this.seekTo(pos));
	}

	public safePlay() {
		this.ready.then(() => this.play());
	}

	public safePause() {
		this.ready.then(() => this.pause());
	}

	public safeStop() {
		this.ready.then(() => this.stop());
	}

	public safeToggle() {
		this.ready.then(() => this.toggle());
	}
}
