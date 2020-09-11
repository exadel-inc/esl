type StyleMap = {[key: string]: string | null};
export abstract class CSSUtil {
	public static splitTokens(tokenString: string | null | undefined) {
		return (tokenString || '').split(' ').filter((str) => !!str);
	}

	public static addCls(el: HTMLElement, cls: string | null | undefined) {
		const tokens = CSSUtil.splitTokens(cls);
		tokens.length && el.classList.add(...tokens);
	}
	public static removeCls(el: HTMLElement, cls: string | null | undefined) {
		const tokens = CSSUtil.splitTokens(cls);
		tokens.length && el.classList.remove(...tokens);
	}
	public static toggleClsTo(el: HTMLElement, cls: string | null | undefined, state: boolean) {
		(state ? CSSUtil.addCls : CSSUtil.removeCls)(el, cls);
	}
}