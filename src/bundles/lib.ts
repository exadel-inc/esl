import * as Lib from './all';

export type SmartLibrary = typeof Lib;

declare global {
	const SmartLibrary: SmartLibrary
}