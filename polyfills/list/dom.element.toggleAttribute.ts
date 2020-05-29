/**
 * Group: DOM API shims
 * Target Browsers: IE11, Edge < 18, Safari < 13
 */
if (!Element.prototype.toggleAttribute) {
	Element.prototype.toggleAttribute = function (name: string, force: boolean | undefined): boolean {
		if (force !== void 0) force = !!force;

		if (this.hasAttribute(name)) {
			if (force) return true;
			this.removeAttribute(name);
			return false;
		}

		if (force === false) return false;
		this.setAttribute(name, '');
		return true;
	};
}
