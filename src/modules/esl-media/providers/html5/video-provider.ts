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
  static override readonly isReplacable = true;

  protected override _el: HTMLVideoElement;

  protected createElement(): HTMLVideoElement {
    const el = document.createElement('video');
    el.src = this.config.mediaSrc || '';
    return el;
  }

  public override updateFitMode(): void {
    if (!this._el) return;
    const {fillMode} = this.component;
    this._el.style.setProperty('object-fit', fillMode === 'inscribe' ? 'contain' : fillMode === 'cover' ? 'cover' : 'auto');
  }

  get defaultAspectRatio(): number {
    return this._el.videoWidth / this._el.videoHeight;
  }
}
