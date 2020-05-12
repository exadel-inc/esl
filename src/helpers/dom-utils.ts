
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
 * BackForward extended selector support.
 */
function findBackForward(root: HTMLElement, query: string, multiple = false): Element | NodeListOf<Element>  {
	const [parent, child] = query.split('>>').map((term) => term.trim());
	if (parent.substr(0, 2) === '<<') {
		const parentSel = parent.substr(2);
		root = root.parentElement;
		root = parentSel ? root.closest(parentSel) : root;
	}
	if (child) {
		return multiple ? root.querySelectorAll(child) : root.querySelector(child);
	}
	return root;
}

/**
 * Check is the {@param query}  back-forward selector
 */
export const isBFSelector = (query: string) => /^\s*<<|>>/.test(query);

/**
 * Extended selector support
 * Supports special queries and back forward
 *
 * @example "" - get current target
 * @example "next" - get next element
 * @example "prev" - get previous element
 * @example "#id .class [attr]" - find by CSS selector in current document
 * @example "<<" - get target parent
 * @example "<< .parent" - find closest parent matching class .parent
 * @example "::parent()::child()" - get child(ren)
 * @example ">> some-tag" - find child element(s) that match tag some-tag
 * @example "<< >> some-tag" - find child element(s) that match tag some-tag in the parent
 * @example "<< .parent >> .child" - find child element(s) that match class in the
 * closest parent component with class .parent
 */
export function findTarget(root: HTMLElement, query: string, multiple = false) {
	query = query.trim();
	if (!query) return root;
	if (query === 'next') return root.nextElementSibling;
	if (query === 'prev') return root.previousElementSibling
	if (isBFSelector(query)) {
		console.warn(`You use "back-forward" syntax in "${query}" query, it is experimental feature and could be changed or removed without major release`);
		return findBackForward(root, query, multiple);
	}
	return multiple ? document.querySelectorAll(query) : document.querySelector(query);
}