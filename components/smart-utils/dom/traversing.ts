const tuple = <T> (arr: T[]): [T,T][] => arr.reduce((acc, el) => {
	if (acc.length === 0 || acc[acc.length - 1].length >= 2) acc.push([]);
	acc[acc.length - 1].push(el);
	return acc;
}, []);

type PseudoProcessor = (base: Element, sel?: string, multiple?: boolean) => Element | Element[] | null;
type PseudoProcessorMap = {[key: string]: PseudoProcessor};

/**
 * Find sibling element by selector and direction
 * */
export const findSibling = (base: Element, sel?: string, backward = false) => {
	for(let target = base; (target = backward ? target.previousElementSibling : target.nextElementSibling);) {
		if (!sel || target.matches(sel)) return target;
	}
	return null;
};

const SELECTORS: PseudoProcessorMap = {
	'::next': (base: Element, sel?: string) => findSibling(base, sel, false),
	'::prev': (base: Element, sel?: string) => findSibling(base, sel, true),
	'::child': (base: Element, sel?: string, multiple = false) => {
		if (multiple) {
			return Array.from(sel ? base.querySelectorAll(sel) : base.children);
		}
		return sel ? base.querySelector(sel) : base.firstElementChild;
	},
	'::parent': (base: Element, sel?: string) => {
		return sel ? base.parentElement.closest(sel) : base.parentElement;
	}
};
// /(::parent|::child|::next|::prev)/
const PSEUDO_SELECTORS_REGEX = new RegExp(`(${Object.keys(SELECTORS).join('|')})`, 'g');

/**
 * Extended selector support
 * Supports plain CSS selectors, extended ::parent, ::child, ::next and ::prev pseudo-selectors
 *
 * @example "#id .class [attr]" - find by CSS selector in current document
 * @example "" - get current target
 * @example "::next" - get next element
 * @example "::prev" - get previous element
 * @example "::parent" - get target parent
 * @example "::parent(#id .class [attr])" - find closest parent matching passed selector
 * @example "::child(#id .class [attr])" - find child element(s) that match passed selector
 * @example "::parent::child(some-tag)" - find child element(s) that match tag 'some-tag' in the parent
 * @example "#id .class [attr]::parent" - find parent of element matching selector '#id .class [attr]' in document
 */
export function findTarget(query: string, current: HTMLElement, multiple = false) {
	const parts = query.split(PSEUDO_SELECTORS_REGEX).map((term) => term.trim());
	const rootSel = parts.shift();
	const initialEl = rootSel ? document.querySelector(rootSel): current;
	if (!current && parts.length) {
		console.warn(`root is not specified for extended selector '${query}'`);
		return null;
	}
	return tuple(parts).reduce((target, [name, selString]) => {
		if (!target) return null;
		const base = Array.isArray(target) ? target[0] : target;
		const sel = (selString || '').replace(/^\(/, '').replace(/\)$/, '');
		return SELECTORS[name](base, sel, multiple);
	}, initialEl);
}
