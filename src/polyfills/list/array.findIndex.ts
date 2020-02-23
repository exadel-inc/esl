if (typeof Array.prototype.findIndex !== 'function') {
	Array.prototype.findIndex = function (predicate) {
		if (this == null) {
			throw new TypeError('Array.prototype.findIndex called on null or undefined');
		}
		if (typeof predicate !== 'function') {
			throw new TypeError('predicate must be a function');
		}
		const list = Object(this);
		// tslint:disable-next-line:no-bitwise
		const length = list.length >>> 0;
		const thisArg = arguments[1];

		for (let i = 0; i < length; i++) {
			if (predicate.call(thisArg, list[i], i, list)) {
				return i;
			}
		}
		return -1;
	};
}
