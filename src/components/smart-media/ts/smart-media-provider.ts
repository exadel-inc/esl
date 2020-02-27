/**
 * BaseProvider class for media API providers
 * @version 1.0.0
 * @author Alexey Stsefanovich (ala'n)
 */
import SmartMedia from './smart-media';

export enum PlayerStates {
    BUFFERING = 3,
    ENDED = 0,
    PAUSED = 2,
    PLAYING = 1,
    UNSTARTED = -1,
    VIDEO_CUED = 5,
    UNINITIALIZED = null
}

export type BaseProviderConstructor = new(component: SmartMedia) => BaseProvider<HTMLElement>;

export abstract class BaseProvider<T extends HTMLElement> {
    protected component: SmartMedia;
    protected _el: T;
    protected _ready: Promise<any>;

    public constructor(component: SmartMedia) {
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
            res.catch((e) => console.log('Rejected Media Operation: ', e));
            return res;
        }
        return this._ready;
    }

    /**
     * Bind the provider instance to the component
     */
    public abstract bind(): void;

    /**
     * Unbind the provider instance from the component
     */
    public abstract unbind(): void;

    /**
     * @returns {PlayerStates} - current state of the player
     */
    public abstract getState(): PlayerStates;

    /**
     * @returns {number} - recommended aspect ratio
     */
    public abstract get defaultAspectRatio(): number;

    protected abstract seekTo(pos?: number): void | Promise<any>;

    protected abstract play(): void | Promise<any>;

    protected abstract pause(): void | Promise<any>;

    protected abstract stop(): void | Promise<any>;

    /**
     * Set focus to the inner content
     */
    public abstract focus(): void;

    /**
     * Set size for inner content
     */
    setSize(width: number | 'auto', height: number | 'auto'): void {
        if (!this._el) return;
        this._el.style.setProperty('width', width === 'auto' ? null : `${width}px`);
        this._el.style.setProperty('height', height === 'auto' ? null : `${height}px`);
    }
    /**
     * Executes toggle action:
     * If the player is PAUSED then it starts playing otherwise it pause playing
     */
    protected toggle() {
        if (this.getState() === PlayerStates.PAUSED) {
            return this.play();
        } else {
            return this.pause();
        }
    }

    /**
     * Executes seekTo action when api is ready
     * @returns Promise
     */
    public safeSeekTo(pos: number) {
        this.ready.then(() => this.seekTo(pos));
    }

    /**
     * Executes play when api is ready
     * @returns Promise
     */
    public safePlay() {
        this.ready.then(() => this.play());
    }

    /**
     * Executes pause when api is ready
     * @returns Promise
     */
    public safePause() {
        this.ready.then(() => this.pause());
    }

    /**
     * Executes stop when api is ready
     * @returns Promise
     */
    public safeStop() {
        this.ready.then(() => this.stop());
    }

    /**
     * Executes toggle when api is ready
     * @returns Promise
     */
    public safeToggle() {
        return this.ready.then(() => this.toggle());
    }
}
