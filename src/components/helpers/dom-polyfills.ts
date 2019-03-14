/**
 * Element.closest polyfill
 * */
interface Element {
	msMatchesSelector(selectors: string): boolean;
	mozMatchesSelector(selectors: string): boolean;
}

(function (e:Element ) {
	e.matches = e.matches || e.msMatchesSelector || e.mozMatchesSelector || e.webkitMatchesSelector;
	e.closest = e.closest || function (css: any) {
		let node = this;
		while (node) {
			if (node.matches(css)) return node;
			node = node.parentElement;
		}
		return null;
	};
})(Element.prototype);
