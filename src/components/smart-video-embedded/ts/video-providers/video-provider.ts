/**
 * Video API provider for {@link SmartVideoEmbedded}
 */

import SmartVideoEmbedded from '../smart-video-embedded';
import {BaseProvider, PlayerStates} from '../smart-video-provider';
import EmbeddedVideoProviderRegistry from '../smart-video-registry';

interface VideoOptions {
    videoSrc: string,
    videoType?: string;
    hideControls: boolean,
}

export class VideoProvider extends BaseProvider {
    private _el: HTMLVideoElement;

    static get videoName() {
        return 'video';
    }

    protected static buildSrc(src: string, type?: string) {
        return `<source src=${src} type="${type ? type : 'video/mp4'}">`;
    }

    protected static buildIframe(data: VideoOptions) {
        const el = document.createElement('video');
        el.innerHTML = VideoProvider.buildSrc(data.videoSrc);
        el.style.width = '100%;';
        el.style.height = '100%;';
        el.className = 'sev-inner';
        el.setAttribute('controls', '');
        return el;
    }

    public bind() {
        this._el = VideoProvider.buildIframe(this.component.buildOptions());
        this.component.appendChild(this._el);
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
    }

    public play() {
        this._el.play();
    }

    public pause() {
        this._el.pause()
    }

    public stop() {
        this._el.load();
    }
}

EmbeddedVideoProviderRegistry.register(VideoProvider, VideoProvider.videoName);

