interface PropertyDefinition {
	name: string;
	conditional?: boolean;
}

function buildSimpleProperty(proto: HTMLElement, attrName: string) {
	const propName = attrName.replace(/-([a-zA-Z])/g, (lex: string, symbol: string) => symbol.toUpperCase());
	Object.defineProperty(proto, propName, {
		get() {
			return this.getAttribute(attrName);
		},
		set(val) {
			this.setAttribute(attrName, val);
		}
	});
}

function buildConditionalProperty(proto: HTMLElement, attrName: string) {
	const propName = attrName.replace(/-([a-zA-Z])/g, (lex: string, symbol: string) => symbol.toUpperCase());
	Object.defineProperty(proto, propName, {
		get() {
			return this.hasAttribute(attrName);
		},
		set(val) {
			val ? this.setAttribute(attrName, 'true') : this.removeAttribute(attrName);
		}
	});
}

/**
 * Define attribute accessors on html element
 * @param proto - html element prototype
 * @param attrList - attributes config, could be just properties name or PropertyDefinition
 */
export function buildProperties(proto: HTMLElement, attrList: Array<string | PropertyDefinition>) {
	attrList.forEach(function (attr: any) {
		const name = attr.name || attr;
		if (attr.conditional) {
			buildConditionalProperty(proto, name);
		} else {
			buildSimpleProperty(proto, name);
		}
	});
}
