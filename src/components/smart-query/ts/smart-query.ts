/**
 * Smart Query
 * @version 1.2.0
 * @author Alexey Stsefanovich (ala'n)
 *
 * Helper class that extend MediaQueryList class
 * Supports
 * - CSS query matching check
 * - DPR display queries (@x1 | @x2 | @x3)
 * - Screen HPE default sizes shortcuts @[-|+](XS|SM|MD|LG|XL)
 * - Query matching change listeners
 * - Mobile / full browser detection (@MOBILE|@DESKTOP)
 */

import {BREAKPOINTS} from '../../helpers/constants';
import {isMobile} from '../../helpers/utills';

const QUERY_CACHE: any = {};

function getQuery(query: string) {
	if (query) {
		const matcher = QUERY_CACHE[query] ? QUERY_CACHE[query] : window.matchMedia(query);
		if (matcher) {
			QUERY_CACHE[query] = matcher;
		}
		return matcher;
	}
	return null;
}

export class SmartQuery {

	public _dpr: number;
	public _mobileOnly: boolean;
	public _query: any;

	constructor(query: string) {
		query = query.replace(/@([+-]{0,1})(XS|SM|MD|XL|LG)/ig, (match, sign, bp) => {
			bp = bp.toLowerCase();
			switch (sign) {
				case '+':
					return BREAKPOINTS[bp].mediaQueryGE;
				case '-':
					return BREAKPOINTS[bp].mediaQueryLE;
				default:
					return BREAKPOINTS[bp].mediaQuery;
			}
		});

		this._dpr = 1;

		const isWebkit = navigator.userAgent.indexOf('AppleWebKit') !== -1;

		query = query.replace(/@(1|2|3)x/, (match, ratio) => {
			this._dpr = Math.floor(ratio);
			return isWebkit ? `(-webkit-min-device-pixel-ratio: ${ratio})` : `(min-resolution: ${Math.round(96 * ratio)}dpi)`;
		});

		query = query.replace(/(and ){0,1}(@MOBILE|@DESKTOP)( and){0,1}/i, (match, pre, type, post) => {
			this._mobileOnly = (type.toUpperCase() === '@MOBILE');
			if (isMobile !== this._mobileOnly) {
				return 'not all'
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

	public addListener(listener: string) {
		this.query && this.query.addListener(listener);
	}

	public removeListener(listener: string) {
		this.query && this.query.removeListener(listener);
	}
}
