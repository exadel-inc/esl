if (!Object.getOwnPropertyDescriptor(Node.prototype, 'isConnected')) {
	let rootNode: (node: Node) => Node = null;
	if (Node.prototype.getRootNode) {
		rootNode  = (node) => node.getRootNode({composed: true});
	} else {
		rootNode = (node) => {
			for (let ancestor = node, ancestorParent; ancestor; ancestor = ancestorParent) {
				ancestorParent = ancestor.parentNode || (ancestor as any).host;
				if (!ancestorParent) return ancestor;
			}
			return node;
		}
	}
	Object.defineProperty(Node.prototype, 'isConnected', {
		get() { return rootNode(this).nodeType === Node.DOCUMENT_NODE; },
		enumerable: true,
		configurable: true
	});
}
