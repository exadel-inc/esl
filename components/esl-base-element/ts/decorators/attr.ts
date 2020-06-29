import { toKebabCase } from '../../../smart-utils/misc/format';
import type { ESLBaseElement } from '../esl-base-element';

interface AttrDescriptor {
	conditional?: boolean;
	readonly?: boolean;
	dataAttr?: boolean;
	defaultValue?: string;
}

function buildSimpleDescriptor(attrName: string, readOnly: boolean, defaultValue: string) {
	function get() {
		const value = this.getAttribute(attrName);
		return typeof value === 'string' ? value : defaultValue;
	}
	function set(value: string | false | null | undefined ) {
		if (value === undefined || value === null || value === false) {
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
	return (target: ESLBaseElement, propName: string) => {
		const attrName = config.dataAttr ? `data-${toKebabCase(propName)}` : toKebabCase(propName);
		const descriptorBuilder = config.conditional ? buildConditionalDescriptor : buildSimpleDescriptor;
		Object.defineProperty(target, propName, descriptorBuilder(attrName, config.readonly, config.defaultValue));
	};
};
