export interface Point {
	x: number;
	y: number;
}

/**
 * Normalize TouchEvent or PointerEvent
 */
export function normalizeTouchPoint(event: TouchEvent | PointerEvent): Point {
	const source = (event instanceof TouchEvent) ? event.changedTouches[0] : event;
	return {
		x: source.pageX,
		y: source.pageY
	};
}