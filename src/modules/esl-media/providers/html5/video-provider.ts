import {BaseProvider} from '../../core/esl-media-provider';
import {HTMLMediaProvider} from './media-provider';

/**
 * Simple Video API provider for {@link ESLMedia}
 * @author Yuliya Adamskaya
 */
@BaseProvider.register
export class VideoProvider extends HTMLMediaProvider {
  static override readonly providerName: string = 'video';
  static override readonly urlPattern = /\.(mp4|webm|ogv|mov)(\?|$)/;

  protected override _el: HTMLVideoElement;

  protected createElement(): HTMLVideoElement {
    const el = document.createElement('video');
    el.src = this.mediaSrc || '';
    return el;
  }

  get defaultAspectRatio(): number {
    return this._el.videoWidth / this._el.videoHeight;
  }
}
