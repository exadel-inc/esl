/**
 * Video API provider for {@link SmartVideoEmbedded}
 */

import SmartVideoEmbedded from '../smart-video-embedded';
import {BaseProvider, PlayerStates} from '../smart-video-provider';
import EmbeddedVideoProviderRegistry from '../smart-video-registry';

interface VideoOptions {
    autoplay: boolean,
    muted: boolean,
    hideControls: boolean,
    dataSrc: string,
    dataType?: string,
    dataScale: string,
}

export class VideoProvider extends BaseProvider {
    private _el: HTMLVideoElement;

    static get videoName() {
        return 'video';
    }

    protected static buildSrc(src: string, type: string) {
        return `<source src=${src} type="${type ? type : 'video/mp4'}">`;
    }

    protected static build(data: VideoOptions) {
        const el = document.createElement('video');
        el.innerHTML = VideoProvider.buildSrc(data.dataSrc, data.dataType);
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
        // if (this.component.buildOptions().dataScale === 'fill') {
        //     window.addEventListener('resize', this.recalculatePosition);
        // }
        // if (playInViewport) {
        //     this.attachViewportConstraint();
        // }
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

    // public recalculatePosition() {
    //     if (this._el ) {
    //         if (this._el.videoWidth > 0 && this.component.offsetWidth * this._el .videoHeight < this.component.offsetHeight * this._el .videoWidth) {
    //             this._el.style.width = 'auto';
    //             this._el.style.height = '100%';
    //         } else {
    //             this._el.style.width = '100%';
    //             this._el.style.height = 'auto';
    //         }
    //     }
    // }

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

