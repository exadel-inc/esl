import SmartCarouselPlugin from './smart-carousel-plugin';
import {TouchEventDetails, TouchObserver} from '@helpers/touch-observer';

/**
 * WIP Slide Carousel Touch plugin
 * TODO: discuss: should it be core / plugin / or plugin with the core hooks ?
 */
class SmartCarouselTouchPlugin extends SmartCarouselPlugin {
	public static is = 'smart-carousel-touch-plugin';

	private manager = new TouchObserver(this._onTouchMove.bind(this));

	public bind() {
		this.manager.observe(this.carousel);
	}

	public unbind() {
		this.manager.unobserve(this.carousel);
	}

	private _onTouchMove(e: TouchEventDetails) {
		console.log(e);

		if (e.name !== 'swipe') return;
		// TODO: we need to track direction and delegate slide move to the views
		// Some markers will be needed for the move state
		if (Math.abs(e.offset.x) < Math.abs(e.offset.y)) return; // Direction
		if (Math.abs(e.offset.x) < 100) return; // Tolerance

		// Swipe gesture example
		// TODO: should set direct slide based on move offset state
		if (e.offset.x < 0) {
			this.carousel.next();
		} else {
			this.carousel.prev();
		}
		e.event.preventDefault();
		e.event.stopPropagation();
	}
}

export default SmartCarouselTouchPlugin;