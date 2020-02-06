import {attr} from '@helpers/decorators/attr';
import SmartCarouselPlugin from './smart-carousel-plugin';

export class SmartCarouselAutoAdvancePlugin extends SmartCarouselPlugin {
	public static is = 'smart-carousel-auto-advance-plugin';

	@attr({defaultValue: 'next'}) public direction: string;
	@attr({defaultValue: '1000'}) public timeout: number;

	private _interval: number;

	constructor() {
		super();
		this._onInterval = this._onInterval.bind(this);
		this._onInteract = this._onInteract.bind(this);
	}

	public bind(): void {
		this._interval = setTimeout(this._onInterval, this.timeout);
		this.carousel.addEventListener('mouseover', this._onInteract);
		this.carousel.addEventListener('mouseout', this._onInteract);
		this.carousel.addEventListener('focusin', this._onInteract);
		this.carousel.addEventListener('focusout', this._onInteract);
		this.carousel.addEventListener('sc:slide:changed', this._onInteract);
		console.log('Auto-advance plugin attached successfully to ', this.carousel);
	}

	public unbind(): void {
		clearInterval(this._interval);
		this.carousel.removeEventListener('mouseover', this._onInteract);
		this.carousel.removeEventListener('mouseout', this._onInteract);
		this.carousel.removeEventListener('focusin', this._onInteract);
		this.carousel.removeEventListener('focusout', this._onInteract);
		this.carousel.removeEventListener('sc:slide:changed', this._onInteract);
		console.log('Auto-advance plugin detached successfully from ', this.carousel);
	}

	protected _onInterval() {
		switch (this.direction) {
			case 'next':
				this.carousel.next();
				return;
			case 'prev':
				this.carousel.prev();
				return
		}
	}

	protected _onInteract(e: Event) {
		switch (e.type) {
			case 'mouseover':
			case 'focusin':
				clearTimeout(this._interval);
				return;
			case 'mouseout':
			case 'focusout':
				this._interval = setTimeout(this._onInterval, this.timeout);
				return;
			case 'sc:slide:changed':
				clearTimeout(this._interval);
				this._interval = setTimeout(this._onInterval, this.timeout);
				return;
		}
	}
}

customElements.define(SmartCarouselAutoAdvancePlugin.is, SmartCarouselAutoAdvancePlugin);
