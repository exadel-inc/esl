import {BaseProvider} from '../../core/esl-media-provider';
import {HTMLMediaProvider} from './media-provider';

/**
 * Simple Audio API provider for {@link ESLMedia}
 * @author Alexey Stsefanovich (ala'n)
 */
@BaseProvider.register
export class AudioProvider extends HTMLMediaProvider {
  static readonly providerName: string = 'audio';
  static readonly urlPattern = /\.(mp3|wav|aac)(\?|$)/;

  protected _el: HTMLAudioElement;

  protected createElement(): HTMLAudioElement {
    const el = document.createElement('audio');
    el.src = this.config.mediaSrc || '';
    return el;
  }

  public get defaultAspectRatio(): number {
    return 0;
  }
}
