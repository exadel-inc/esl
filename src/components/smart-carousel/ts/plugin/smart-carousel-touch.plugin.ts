import SmartCarouselPlugin from './smart-carousel-plugin';
import {DeviceDetector} from '../../../../helpers/device-utils';
import {normalizeTouchPoint, Point} from '../../../../helpers/dom-utils';

/**
 * Slide Carousel Touch plugin
 */
class SmartCarouselTouchPlugin extends SmartCarouselPlugin {
	public static is = 'smart-carousel-touch-plugin';

	private isTouchStarted = false;
	private startPoint: Point = null;

	public bind() {
		const events = DeviceDetector.TOUCH_EVENTS;

		this.carousel.addEventListener(events.START, this.onTouchStart);
		this.carousel.addEventListener(events.MOVE, this.onTouchMove);
		this.carousel.addEventListener(events.END, this.onTouchEnd);
	}

	public unbind() {
		const events = DeviceDetector.TOUCH_EVENTS;

		this.carousel.removeEventListener(events.START, this.onTouchStart);
		this.carousel.removeEventListener(events.MOVE, this.onTouchMove);
		this.carousel.removeEventListener(events.END, this.onTouchEnd);
	}

	onTouchStart = (event: TouchEvent | PointerEvent) => {
		// TODO: precondition for focused element ?
		if ((event instanceof TouchEvent && event.touches.length !== 1) ||
			(event instanceof PointerEvent && event.pointerType !== 'touch')) {
			this.isTouchStarted = false;
			return;
		}
		this.isTouchStarted = true;
		this.startPoint = normalizeTouchPoint(event);
	};

	onTouchMove = (event: TouchEvent | PointerEvent) => {
		if (!this.isTouchStarted) return;
		// const point = normalizeTouchPoint(event);
		// const offset = {
		// 	x: point.x - this.startPoint.x,
		// 	y: point.y - this.startPoint.y
		// };
	};

	onTouchEnd = (event: TouchEvent | PointerEvent) => {
		if (!this.isTouchStarted) return;
		const point = normalizeTouchPoint(event);
		const offset = {
			x: point.x - this.startPoint.x,
			y: point.y - this.startPoint.y
		};
		this.isTouchStarted = false;

		// TODO: temporary, update according final implementation
		if (Math.abs(offset.x) < Math.abs(offset.y)) return; // Direction
		if (Math.abs(offset.x) < 100) return; // Tolerance

		// Swipe gesture example
		if (offset.x < 0) {
			this.carousel.next();
		} else {
			this.carousel.prev();
		}
		event.preventDefault();
		event.stopPropagation();
	};
}

export default SmartCarouselTouchPlugin;