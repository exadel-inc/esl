/**
 * Function that do nothing
 */
export const noop = (): void => undefined;

/**
 * Function that return first argument
 */
export const identity = <T> (arg: T): T => arg;

type Tuple<T> = [T?, T?];
/**
 * Function to split array into tuples
 */
export const tuple = <T>(arr: T[]): Tuple<T>[] => arr.reduce((acc: Tuple<T>[], el) => {
	if (acc.length === 0 || acc[acc.length - 1].length >= 2) acc.push([]);
	acc[acc.length - 1].push(el);
	return acc;
}, []);

export type NoopFnSignature = () => void;

export type AnyToVoidFnSignature = (...args: any[]) => void;

export type AnyToAnyFnSignature = (...args: any[]) => any;