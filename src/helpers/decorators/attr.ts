interface AttrDescriptor {
	conditional?: boolean;
	readonly?: boolean;
	dataAttr?: boolean;
	defaultValue?: string;
}

export const toKebabCase = (str: string) => {
	return str.replace(/([a-z])([A-Z])/g, '$1-$2').replace(/[\s_]+/g, '-').toLowerCase();
};

function buildSimpleMapping(target: object, propName: string, attrName: string, defaultValue: string) {

	function get() {
		return this.getAttribute(attrName) || defaultValue;
	}
	function set(value: string) {
		this.setAttribute(attrName, value);
	}

	Object.defineProperty(target, propName, {get, set});
}

function buildConditionalMapping(target: object, propName: string, attrName: string, readOnly: boolean) {

	function get() {
		return this.hasAttribute(attrName);
	}
	function set(value: string) {
		value ? this.setAttribute(attrName, 'true') : this.removeAttribute(attrName);
	}

	readOnly ? Object.defineProperty(target, propName, {get}) : Object.defineProperty(target, propName, {get, set});
}

export const attr = (config: AttrDescriptor = {defaultValue: '', readonly: false}) => {
	return (target: object, propName: string) => {
		const attrName = config.dataAttr ? `data-${toKebabCase(propName)}` : toKebabCase(propName);
		config.conditional ? buildConditionalMapping(target, propName, attrName, config.readonly) : buildSimpleMapping(target, propName, attrName, config.defaultValue);
	};
};
