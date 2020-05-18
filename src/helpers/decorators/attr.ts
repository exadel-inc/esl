import { toKebabCase } from '../format-utils';

interface AttrDescriptor {
	conditional?: boolean;
	readonly?: boolean;
	dataAttr?: boolean;
	defaultValue?: string;
}

function buildSimpleDescriptor(attrName: string, readOnly: boolean, defaultValue: string) {
	function get() {
		return this.getAttribute(attrName) || defaultValue;
	}
	function set(value: string) {
		// @ts-ignore
		if (value === null || value === false) {
			this.removeAttribute(attrName);
		} else {
			this.setAttribute(attrName, value);
		}
	}
	return readOnly ? {get} : {get, set};
}

function buildConditionalDescriptor(attrName: string, readOnly: boolean) {
	function get() {
		return this.hasAttribute(attrName);
	}
	function set(value: boolean) {
		value ? this.setAttribute(attrName, '') : this.removeAttribute(attrName);
	}
	return readOnly ? {get} : {get, set};
}

export const attr = (config: AttrDescriptor = {defaultValue: '', readonly: false}) => {
	return (target: object, propName: string) => {
		const attrName = config.dataAttr ? `data-${toKebabCase(propName)}` : toKebabCase(propName);
		const descriptorBuilder = config.conditional ? buildConditionalDescriptor : buildSimpleDescriptor;
		Object.defineProperty(target, propName, descriptorBuilder(attrName, config.readonly, config.defaultValue));
	};
};
