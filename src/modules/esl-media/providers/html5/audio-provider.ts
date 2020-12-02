/**
 * Simple Audio API provider for {@link ESLMedia}
 * @version 1.0.0-alpha
 * @author Alexey Stsefanovich (ala'n)
 */

import {HTMLMediaProvider} from './media-provider';
import {BaseProvider} from '../../core/esl-media-provider';

@BaseProvider.register
export class AudioProvider extends HTMLMediaProvider {
  static get providerName() {
    return 'audio';
  }

  protected _el: HTMLAudioElement;

  protected createElement(): HTMLAudioElement {
    const el = document.createElement('audio');
    el.src = this.config.mediaSrc || '';
    return el;
  }

  get defaultAspectRatio(): number {
    return 0;
  }
}
