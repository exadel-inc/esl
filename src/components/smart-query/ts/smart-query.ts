/**
 * Smart Query
 * @version 1.2.0
 * @author Alexey Stsefanovich (ala'n)
 *
 * Helper class that extend MediaQueryList class
 * Supports
 * - CSS query matching check
 * - DPR display queries (@x1 | @x2 | @x3)
 * - Screen default sizes shortcuts @[-|+](XS|SM|MD|LG|XL)
 * - Query matching change listeners
 * - Mobile / full browser detection (@MOBILE|@DESKTOP)
 */

import {isMobile} from '../../../helpers/device-utils';
import {BreakpointRegistry} from './smart-query-breakpoints';

const QUERY_CACHE: any = {};

function getQuery(query: string): MediaQueryList {
	if (query) {
		const matcher = QUERY_CACHE[query] ? QUERY_CACHE[query] : window.matchMedia(query);
		if (matcher) {
			QUERY_CACHE[query] = matcher;
		}
		return matcher;
	}
	return null;
}

function getDprMediaQuery(ratio: number) {
	const isWebkit = navigator.userAgent.indexOf('AppleWebKit') !== -1;
	return isWebkit ? `(-webkit-min-device-pixel-ratio: ${ratio})` : `(min-resolution: ${Math.round(96 * ratio)}dpi)`;
}

export class SmartQuery {
	static get BreakpointRegistry() {
		return BreakpointRegistry;
	}

	private _dpr: number;
	private _mobileOnly: boolean;
	private readonly _query: MediaQueryList;

	constructor(query: string) {

		// Applying known breakpoints shortcut
		query = BreakpointRegistry.apply(query);

		// Applying dpr shortcut
		this._dpr = 1;
		query = query.replace(/@(1|2|3)x/, (match, ratio) => {
			this._dpr = Math.floor(ratio);
			return getDprMediaQuery(ratio);
		});

		// Applying dpr shortcut for device detection
		query = query.replace(/(and ){0,1}(@MOBILE|@DESKTOP)( and){0,1}/i, (match, pre, type, post) => {
			this._mobileOnly = (type.toUpperCase() === '@MOBILE');
			if (isMobile !== this._mobileOnly) {
				return 'not all';
			}
			return pre && post ? ' and ' : '';
		});

		this._query = getQuery(query.trim() || 'all');
	}

	get isMobileOnly() {
		return this._mobileOnly === true;
	}

	get isFullOnly() {
		return this._mobileOnly === false;
	}

	get DPR() {
		return this._dpr;
	}

	get query() {
		return this._query;
	}

	get matches() {
		return this.query && this.query.matches;
	}

	public addListener(listener: () => void) {
		this.query && this.query.addEventListener('change', listener);
	}

	public removeListener(listener: () => void)  {
		this.query && this.query.removeEventListener('change', listener);
	}
}
export default SmartQuery;
