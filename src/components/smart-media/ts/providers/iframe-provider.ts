/**
 * Simple Basic Iframe provider for {@link SmartMedia}
 * @author Alexey Stsefanovich (ala'n)
 */
import {generateUId} from '@helpers/common-utils';
import {SmartMedia} from '../smart-media';
import {BaseProvider, PlayerStates} from '../smart-media-provider';
import EmbeddedVideoProviderRegistry from '../smart-media-registry';


export class IframeBasicProvider extends BaseProvider {
	private _el: HTMLIFrameElement;
	private _state: PlayerStates = PlayerStates.UNINITIALIZED;

	static get providerName() {
		return 'iframe';
	}

	protected static buildIframe(sv: SmartMedia) {
		const el = document.createElement('iframe');
		el.id = 'sev-iframe-' + generateUId();
		el.className = 'sev-inner sev-iframe';
		el.title = sv.title;
		el.setAttribute('aria-label', sv.title);
		el.setAttribute('frameborder', '0');
		el.setAttribute('tabindex', '0');
		el.setAttribute('allowfullscreen', 'yes');
		el.src = sv.mediaSrc;
		return el;
	}

	public bind() {
		if (this._state !== PlayerStates.UNINITIALIZED) return;
		this._ready = new Promise((resolve, reject) => {
			this._el = IframeBasicProvider.buildIframe(this.component);
			this._el.onload = () => resolve();
			this._el.onerror = () => reject();
			this.component.appendChild(this._el);
		});
		this._ready.then(() => {
			this._state = PlayerStates.PLAYING;
			this.component._onReady();
			this.component._onPlay();
		});
		this._ready.catch(() => this.component._onError());
	}

	public unbind() {
		this.component._onDetach();
		if (this._el && this._el.parentNode) {
			this._el.parentNode.removeChild(this._el);
		}
		this._state = PlayerStates.UNINITIALIZED;
	}

	get ready() {
		return Promise.resolve();
	}

	public focus() {
		if (this._el && this._el.contentWindow) {
			this._el.contentWindow.focus();
		}
	}

    setSize(width: number | 'auto', height: number | 'auto'): void {
	    return;
    }

	public getState() {
		return this._state;
	}

    get defaultAspectRatio(): number {
        return 0;
    }

	public seekTo(pos: number) {
		console.error(`[SmartMedia] Unsupported action: can not execute seekTo on abstract iframe provider`);
	}

	public play() {
		if (this.getState() === PlayerStates.UNINITIALIZED) {
			this.bind();
		}
	}
	public pause() {
		this.unbind();
	}
	public stop() {
		this.unbind();
	}
}

EmbeddedVideoProviderRegistry.register(IframeBasicProvider, IframeBasicProvider.providerName);
