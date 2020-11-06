/**
 * Simple Video API provider for {@link ESLMedia}
 * @author Yuliya Adamskaya
 */

import {HTMLMediaProvider} from './media-provider';
import ESLMediaProviderRegistry from '../../core/esl-media-registry';

export class VideoProvider extends HTMLMediaProvider<HTMLVideoElement> {
  static get providerName() {
    return 'video';
  }

  protected createElement(): HTMLVideoElement {
    const el = document.createElement('video');
    el.src = this.component.mediaSrc;
    return el;
  }

  get defaultAspectRatio(): number {
    return this._el.videoWidth / this._el.videoHeight;
  }
}

ESLMediaProviderRegistry.register(VideoProvider, VideoProvider.providerName);
