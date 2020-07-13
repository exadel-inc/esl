const NS_NAME = 'ESL';

function define(root: any, name: string, value: any) {
	return name.split('.').reduce((obj: any, key, index, parts) => {
		if (parts.length === index + 1) {
			return (obj[key] = obj[key] || value);
		}
		const type = typeof obj[key];
		if (type !== 'undefined' && type !== 'object' && type !== 'function') {
			throw new Error(`Can not define ${value} on ${name}`);
		}
		return (obj[key] = obj[key] || {});
	}, root);
}

export const exportNS = (name: string, module: any) => {
	if (!(NS_NAME in window)) return;
	define((window as any)[NS_NAME], name, module);
};

// eslint-disable-next-line @typescript-eslint/ban-types
export function Export<T extends Function>(name: string) {
	return (module: T) => exportNS(name, module);
}