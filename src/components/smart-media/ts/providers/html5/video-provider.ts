/**
 * Simple Video API provider for {@link SmartMedia}
 * @author Yuliya Adamskaya
 */

import {HTMLMediaProvider} from './media-provider';
import EmbeddedVideoProviderRegistry from '../../smart-media-registry';

export class VideoProvider extends HTMLMediaProvider<HTMLVideoElement> {
    static get providerName() {
        return 'video';
    }

    protected createElement(): HTMLVideoElement {
        const el = document.createElement('video');
        el.innerHTML = HTMLMediaProvider.buildSrc(this.component.mediaSrc, 'video/mp4');
        return el;
    }

    get defaultAspectRatio(): number {
        return this._el.offsetWidth / this._el.offsetHeight;
    }
}

EmbeddedVideoProviderRegistry.register(VideoProvider, VideoProvider.providerName);
