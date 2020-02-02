/**
 * Simple Video API provider for {@link SmartVideo}
 * @author Yuliya Adamskaya
 */

import {SmartVideo, VideoOptions} from '../smart-video';
import {BaseProvider, PlayerStates} from '../smart-video-provider';
import EmbeddedVideoProviderRegistry from '../smart-video-registry';

export class VideoProvider extends BaseProvider {
    private _el: HTMLVideoElement;

    static get videoName() {
        return 'video';
    }

    protected static buildSrc(src: string, type?: string) {
        return `<source src=${src} type="${type ? type : 'video/mp4'}">`;
    }

    protected static build(data: VideoOptions) {
        const el = document.createElement('video');
        el.innerHTML = VideoProvider.buildSrc(data.videoSrc);
        el.className = 'sev-inner';
        el.autoplay = data.autoplay;
        el.preload = 'auto';
        el.loop = data.loop;
        el.tabIndex = 0;
        el.muted = data.muted;
        el.controls = data.controls;
        return el;
    }

    public bind() {
        this._el = VideoProvider.build(this.component.buildOptions());
        this.component.appendChild(this._el);
        this._el.onerror = this.component._onError;
        this._el.addEventListener('loadedmetadata', () => this.component._onReady());
        this._el.addEventListener('play', () => this.component._onPlay());
        this._el.addEventListener('pause', () => this.component._onPaused());
        this._el.addEventListener('ended', () => this.component._onEnded());
        this._el.addEventListener('error', () => this.component._onError());
    }

    public unbind() {
        this.component._onDetach();
        if (this._el && this._el.parentNode) {
            this._el.parentNode.removeChild(this._el);
        }
    }

    get ready() {
        return Promise.resolve();
    }

    public focus() {
        if (this._el) {
            this._el.focus();
        }
    }

    public getState() {
        return PlayerStates.UNINITIALIZED;
    }

    public seekTo(pos: number) {
        this._el.currentTime = pos;
    }

    public play() {
        return this._el.play();
    }

    public pause() {
        return this._el.pause()
    }

    public stop() {
        return new Promise(() => {
            this._el.pause();
            this._el.currentTime = 0;
        })
    }
}

EmbeddedVideoProviderRegistry.register(VideoProvider, VideoProvider.videoName);

