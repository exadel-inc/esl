export function buildProperties(proto: object, attrList: Array<any>) {
	attrList.forEach(function (attr: any) {
		let name = attr.name || attr;
		if (attr.conditional) {
			buildConditionalProperty(proto, name);
		} else {
			buildSimpleProperty(proto, name);
		}
	});
}

export function buildSimpleProperty(proto: object, attrName: string) {
	let propName = attrName.replace(/-([a-zA-Z])/g, (lex: string, symbol: string) => symbol.toUpperCase());
	Object.defineProperty(proto, propName, {
		get: function () {
			return this.getAttribute(attrName);
		},
		set: function (val) {
			this.setAttribute(attrName, val);
		}
	});
}

export function buildConditionalProperty(proto: object, attrName: string) {
	let propName = attrName.replace(/-([a-zA-Z])/g, (lex: string, symbol: string) => symbol.toUpperCase());
	Object.defineProperty(proto, propName, {
		get: function () {
			return this.hasAttribute(attrName);
		},
		set: function (val) {
			val ? this.setAttribute(attrName, 'true') : this.removeAttribute(attrName);
		}
	});
}

