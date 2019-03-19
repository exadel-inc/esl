/**
 * Element.closest polyfill
 * */

/**
 * Cross-browser Element interface
 * */
interface ElementEx extends Element{
	msMatchesSelector(selectors: string): boolean;
	mozMatchesSelector(selectors: string): boolean;
}

(function (e: ElementEx) {
	e.matches = e.matches || e.msMatchesSelector || e.mozMatchesSelector || e.webkitMatchesSelector;
	e.closest = e.closest || function (css: string) {
		let node = this;
		while (node) {
			if (node.matches(css)) return node;
			node = node.parentElement;
		}
		return null;
	};
})(Element.prototype as ElementEx);
