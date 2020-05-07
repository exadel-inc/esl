
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

/**
 * Extended selector support
 */
export function findTarget(query: string, root: HTMLElement = document.body) {
	if (query === 'parent') return root.parentElement;
	if (query === 'next') return root.nextElementSibling;
	if (query === 'prev') return root.previousElementSibling;
	return document.querySelector(query);
	// .parent |> .child
	// group:groupName
}