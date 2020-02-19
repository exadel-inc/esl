/**
 * Simple Media API provider for {@link SmartMedia}
 * @author Yuliya Adamskaya
 */

import {SmartMedia} from '../smart-media';
import {BaseProvider, PlayerStates} from '../smart-media-provider';
import EmbeddedVideoProviderRegistry from '../smart-media-registry';

export class VideoProvider extends BaseProvider {
    private _el: HTMLVideoElement;

    static get providerName() {
        return 'video';
    }

    protected static buildSrc(src: string, type?: string) {
        return `<source src=${src} type="${type ? type : 'video/mp4'}">`;
    }

    protected static build(sv: SmartMedia) {
        const el = document.createElement('video');
        el.innerHTML = VideoProvider.buildSrc(sv.mediaSrc);
        el.className = 'sev-inner';
        el.autoplay = sv.autoplay;
        el.preload = 'auto';
        el.loop = sv.loop;
        el.tabIndex = 0;
        el.muted = sv.muted;
        el.controls = sv.controls;
        return el;
    }

    public bind() {
        this._el = VideoProvider.build(this.component);
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

EmbeddedVideoProviderRegistry.register(VideoProvider, VideoProvider.providerName);

