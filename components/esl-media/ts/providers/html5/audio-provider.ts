/**
 * Simple Audio API provider for {@link ESLMedia}
 * @author Alexey Stsefanovich (ala'n)
 */

import {HTMLMediaProvider} from './media-provider';
import ESLMediaProviderRegistry from '../../esl-media-registry';

export class AudioProvider extends HTMLMediaProvider<HTMLAudioElement> {
  static get providerName() {
    return 'audio';
  }

  protected createElement(): HTMLAudioElement {
    const el = document.createElement('audio');
    el.src = this.config.mediaSrc || '';
    return el;
  }

  get defaultAspectRatio(): number {
    return 0;
  }
}

ESLMediaProviderRegistry.register(AudioProvider, AudioProvider.providerName);
