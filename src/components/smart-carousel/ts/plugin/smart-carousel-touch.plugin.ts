import SmartCarouselPlugin from './smart-carousel-plugin';

export class SmartCarouselTouchPlugin extends SmartCarouselPlugin {
	public bind(): void {
		console.log('Touch plugin attached successfully to ', this.carousel);
	}

	public unbind(): void {
		console.log('Touch plugin detached successfully from ', this.carousel);
	}
}

customElements.define('smart-carousel-touch-plugin', SmartCarouselTouchPlugin);