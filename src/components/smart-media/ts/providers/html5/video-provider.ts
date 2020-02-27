/**
 * Simple Video API provider for {@link SmartMedia}
 * @author Yuliya Adamskaya
 */

import {HTMLMediaProvider} from './media-provider';
import SmartMediaProviderRegistry from '../../smart-media-registry';

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
        return this._el.videoWidth / this._el.videoHeight;
    }
}

SmartMediaProviderRegistry.register(VideoProvider, VideoProvider.providerName);
