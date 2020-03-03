import {DeviceDetector} from '@helpers/device-utils';

export interface Point {
	x: number;
	y: number;
}

// TODO: too heavy, simplify
export interface TouchEventDetails {
	name: 'move' | 'swipe',
	event: TouchEvent | PointerEvent,
	target: HTMLElement,
	start: Point,
	end: Point,
	offset: Point
}

export class TouchObserver {
	// static TOUCH_TOLERANCE = 100;

	private readonly callback: (event: TouchEventDetails) => void;
	private startPoint: Point = null;
	private isEnabled = false;

	constructor(callback: (event: TouchEventDetails) => void) {
		this.callback = callback;
	}

	observe(el: HTMLElement) {
		const events = TouchObserver.TOUCH_EVENTS;

		el.addEventListener(events.START, this.onTouchStart);
		el.addEventListener(events.MOVE, this.onTouchMove);
		el.addEventListener(events.END, this.onTouchEnd);
	}

	unobserve(el: HTMLElement) {
		const events = TouchObserver.TOUCH_EVENTS;

		el.removeEventListener(events.START, this.onTouchStart);
		el.removeEventListener(events.MOVE, this.onTouchMove);
		el.removeEventListener(events.END, this.onTouchEnd);
	}

	onTouchStart = (event: TouchEvent | PointerEvent) => {
		if ((event instanceof TouchEvent && event.touches.length !== 1) ||
			(event instanceof PointerEvent && event.pointerType !== 'touch')) {
			this.isEnabled = false;
			return;
		}
		this.isEnabled = true;
		this.startPoint = TouchObserver.normalizeTouchPoint(event);
	};

	onTouchMove = (event: TouchEvent | PointerEvent) => {
		if (!this.isEnabled) return;

		const point = TouchObserver.normalizeTouchPoint(event);
		const offset = {
			x: point.x - this.startPoint.x,
			y: point.y - this.startPoint.y
		};

		this.callback({
			event,
			target: event.target as HTMLElement,
			name: 'move',
			start: this.startPoint,
			end: point,
			offset
		});
	};

	onTouchEnd = (event: TouchEvent | PointerEvent) => {
		if (!this.isEnabled) return;
		const point = TouchObserver.normalizeTouchPoint(event);
		const offset = {
			x: point.x - this.startPoint.x,
			y: point.y - this.startPoint.y
		};

		this.callback({
			event,
			target: event.target as HTMLElement,
			name: 'swipe',
			start: this.startPoint,
			end: point,
			offset
		});
		this.isEnabled = false;
	};

	static get TOUCH_EVENTS() {
		const isTouch = DeviceDetector.isTouchDevice;
		return {
			START: isTouch ? 'touchstart' : 'pointerdown',
			MOVE: isTouch ? 'touchmove' : 'pointermove',
			END: isTouch ? 'touchend' : 'pointerup'
		};
	}

	static normalizeTouchPoint(event: TouchEvent | PointerEvent) {
		const source = (event instanceof TouchEvent) ? event.changedTouches[0] : event;
		return {
			x: source.pageX,
			y: source.pageY
		};
	}
}