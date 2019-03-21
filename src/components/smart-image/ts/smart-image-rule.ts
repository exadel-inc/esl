import SmartQuery from '../../smart-query/ts/smart-query';

class SmartImageSrcRule extends SmartQuery {
	private readonly src: string;
	private static _EMPTY_RULE: SmartImageSrcRule;
	static get EMPTY_IMAGE() {
		return 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
	}

	constructor(src: string, query: string) {
		super(query);
		this.src = src;

		if ( !this.src || this.src === '0' || this.src === 'none') {
			this.src = SmartImageSrcRule.EMPTY_IMAGE;
		}
	}

	public toString() {
		return `${this.query.media} => ${this.src}`;
	}

	public getPath(basePath = '') {
		if (SmartImageSrcRule.isEmptyImage(this.src)) {
			return this.src;
		}
		return basePath + this.src;
	}

	public static parse(lex: string) {
		const [query, src] = lex.split('=>');
		return new SmartImageSrcRule(src.trim(), query.trim());
	}
	public static all(src: string) {
		return new SmartImageSrcRule(src, 'all');
	}
	public static empty() {
		return SmartImageSrcRule._EMPTY_RULE || (SmartImageSrcRule._EMPTY_RULE = SmartImageSrcRule.all('none'));
	}

	public static isEmptyImage(src: string) {
		return src === SmartImageSrcRule.EMPTY_IMAGE;
	}
}

export default SmartImageSrcRule;
