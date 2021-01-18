/**
 * Simple Video API provider for {@link ESLMedia}
 * @version 1.0.0-alpha
 * @author Yuliya Adamskaya
 */

import {HTMLMediaProvider} from './media-provider';
import {BaseProvider} from '../../core/esl-media-provider';

@BaseProvider.register
export class VideoProvider extends HTMLMediaProvider {
  static readonly providerName: string = 'video';
  static readonly urlPattern = /\.(mp4|webm|ogv|mov)(\?|$)/;

  protected _el: HTMLVideoElement;

  protected createElement(): HTMLVideoElement {
    const el = document.createElement('video');
    el.src = this.config.mediaSrc || '';
    return el;
  }

  get defaultAspectRatio(): number {
    return this._el.videoWidth / this._el.videoHeight;
  }
}
