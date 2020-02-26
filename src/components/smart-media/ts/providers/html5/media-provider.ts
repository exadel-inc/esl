/**
 * Simple Native Media API provider for {@link SmartMedia}
 * @author Yuliya Adamskaya, Alexey Stsefanovich (ala'n)
 */

import {SmartMedia} from '../../smart-media';
import {BaseProvider, PlayerStates} from '../../smart-media-provider';

export abstract class HTMLMediaProvider<T extends HTMLMediaElement> extends BaseProvider<T> {
	protected static buildSrc(src: string, type: string) {
		return `<source src=${src} type="${type}">`;
	}

	protected static applyElementSettings(el: HTMLMediaElement, sm: SmartMedia) {
		el.classList.add('smedia-inner');
		el.autoplay = sm.autoplay;
		el.preload = 'auto';
		el.loop = sm.loop;
		el.muted = sm.muted;
		el.controls = sm.controls;
		el.tabIndex = 0;
		return el;
	}

	protected abstract createElement(): T;

	public bind() {
		this._el = this.createElement();
		HTMLMediaProvider.applyElementSettings(this._el, this.component);
		this.component.appendChild(this._el);
		this.bindListeners();
	}

	protected bindListeners() {
		this._el.addEventListener('loadedmetadata', () => this.component._onReady());
		this._el.addEventListener('play', () => this.component._onPlay());
		this._el.addEventListener('pause', () => this.component._onPaused());
		this._el.addEventListener('ended', () => this.component._onEnded());
		this._el.addEventListener('error', () => this.component._onError());
	}

	public unbind() {
		this.component._onDetach();
		if (this._el && this._el.parentNode) {
			this._el.parentNode.removeChild(this._el);
		}
	}

	get ready() {
		return Promise.resolve();
	}

	public focus() {
		if (this._el) {
			this._el.focus();
		}
	}

	public getState() {
		return PlayerStates.UNINITIALIZED;
	}

	public seekTo(pos: number) {
		this._el.currentTime = pos;
	}

	public play() {
		return this._el.play();
	}

	public pause() {
		return this._el.pause()
	}

	public stop() {
		return new Promise(() => {
			this._el.pause();
			this._el.currentTime = 0;
		})
	}
}
