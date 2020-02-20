/**
 * Simple Audio API provider for {@link SmartMedia}
 * @author Alexey Stsefanovich (ala'n)
 */

import {SmartMedia} from '../../smart-media';
import {HTMLMediaProvider} from './media-provider';
import EmbeddedVideoProviderRegistry from '../../smart-media-registry';

export class AudioProvider extends HTMLMediaProvider<HTMLAudioElement> {
	static get providerName() {
		return 'audio';
	}

	protected createElement(): HTMLAudioElement {
		const el = document.createElement('audio');
		el.innerHTML = HTMLMediaProvider.buildSrc(this.component.mediaSrc, 'video/mp3');
		return el;
	}
}

EmbeddedVideoProviderRegistry.register(AudioProvider, AudioProvider.providerName);
