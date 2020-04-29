import * as Lib from './all';

export type ESL = typeof Lib;

declare global {
	const ESL: ESL
}