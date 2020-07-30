/**
 * Function that do nothing
 */
export const noop = (): void => undefined;

/**
 * Function that return first argument
 */
export const identity = <T> (arg: T): T => arg;

/**
 * Function to split array into tuples
 */
export const tuple = <T>(arr: T[]): [T, T][] => arr.reduce((acc, el) => {
	if (acc.length === 0 || acc[acc.length - 1].length >= 2) acc.push([]);
	acc[acc.length - 1].push(el);
	return acc;
}, []);

export type NoopFnSignature = () => void;

export type AnyToVoidFnSignature = (...args: any[]) => void;

export type AnyToAnyFnSignature = (...args: any[]) => any;