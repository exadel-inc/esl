import { toKebabCase } from '../../../esl-utils/misc/format';
import type { ESLBaseElement } from '../esl-base-element';

interface AttrDescriptor {
	name?: string;
	conditional?: boolean;
	readonly?: boolean;
	dataAttr?: boolean;
	defaultValue?: string | boolean | null;
}

function buildSimpleDescriptor(attrName: string, readOnly: boolean, defaultValue: string | boolean | null | undefined) {
	function get() {
		const value = this.getAttribute(attrName);
		return typeof value === 'string' ? value : defaultValue;
	}
	function set(value: string | boolean | null | undefined ) {
		if (value === undefined || value === null || value === false) {
			this.removeAttribute(attrName);
		} else {
			this.setAttribute(attrName, value === true ? '' : value);
		}
	}
	return readOnly ? {get} : {get, set};
}

function buildConditionalDescriptor(attrName: string, readOnly: boolean) {
	function get() {
		return this.hasAttribute(attrName);
	}
	function set(value: boolean) {
		this.toggleAttribute(attrName, value);
	}
	return readOnly ? {get} : {get, set};
}

const buildAttrName =
	(propName: string, dataAttr: boolean) => dataAttr ? `data-${toKebabCase(propName)}` : toKebabCase(propName);

export const attr = (config: AttrDescriptor = {}) => {
	config = Object.assign({defaultValue: '', readonly: false}, config);
	return (target: ESLBaseElement, propName: string) => {
		const attrName = config.name || buildAttrName(propName, !!config.dataAttr);
		const descriptorBuilder = config.conditional ? buildConditionalDescriptor : buildSimpleDescriptor;
		Object.defineProperty(target, propName, descriptorBuilder(attrName, !!config.readonly, config.defaultValue));
	};
};
