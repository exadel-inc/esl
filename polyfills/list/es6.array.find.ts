/**
 * Group: ES6 shim
 * Target Browsers: IE11, Edge < 14
 * Array.prototype.findIndex && Array.prototype.findIndex
 */
if (typeof Array.prototype.findIndex !== 'function') {
	const findHelper = function <T>(predicate: Predicate<T>): { item: T | null, index: number } {
		if (!this) {
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
				return {item: list[i], index: i};
			}
		}
		return {item: null, index: -1};
	};

	Array.prototype.find = function <T>(predicate: Predicate<T>): T | null {
		return findHelper(predicate).item;
	};
	Array.prototype.findIndex = function <T>(predicate: Predicate<T>): number {
		return findHelper(predicate).index;
	};
}

type Predicate<T> = (T: any, index: number, array: T[]) => boolean;
