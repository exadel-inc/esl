/**
 * Simple Audio API provider for {@link ESLMedia}
 * @version 1.0.0-alpha
 * @author Alexey Stsefanovich (ala'n)
 */

import {HTMLMediaProvider} from './media-provider';
import {BaseProvider} from '../../core/esl-media-provider';

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
