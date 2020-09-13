/**
 * Group: ES6 shims
 * Target Browsers: IE11
 * DOMTokenList.toggle polyfill to support force option
 */
(function (DOMTokenListProto) {
	const nativeToggle = DOMTokenListProto.toggle;
	const testTokenList = window.document.createElement('div').classList;

	if (!DOMTokenListProto.toggle) return;
	if (testTokenList.toggle('a', false) === false) return;

	DOMTokenListProto.toggle = function toggle(val:string, force?: boolean) {
		if (arguments.length > 1) {
			this[force ? 'add' : 'remove'](val);
			return !!force;
		}
		return nativeToggle.call(this, val);
	};
})(window.DOMTokenList.prototype);
