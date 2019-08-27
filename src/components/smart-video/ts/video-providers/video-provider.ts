/**
 * Simple Video API provider for {@link SmartVideo}
 * @author Yuliya Adamskaya
 */

import SmartVideo from '../smart-video';
import {BaseProvider, PlayerStates} from '../smart-video-provider';
import EmbeddedVideoProviderRegistry from '../smart-video-registry';

interface VideoOptions {
    autoplay: boolean,
    muted: boolean,
    hideControls: boolean,
    dataSrc: string,
}

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
        el.innerHTML = VideoProvider.buildSrc(data.dataSrc);
        el.className = 'sev-inner';
        el.autoplay = data.autoplay;
        el.preload = 'auto';
        el.loop = false;
        el.tabIndex = 0;
        el.muted = data.muted;
        if (!data.hideControls) {
            el.controls = true;
        }
        return el;
    }

    public bind() {
        this._el = VideoProvider.build(this.component.buildOptions());
        this.component.appendChild(this._el);
        this._el.onerror = this.component._onError;
        this._el.addEventListener('loadedmetadata', () => this.component._onReady());
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

