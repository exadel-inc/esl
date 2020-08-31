export abstract class CSSUtil {
	public static splitTokens(tokenString: string | null | undefined) {
		return (tokenString || '').split(' ').filter((str) => !!str);
	}
	public static addClasses(el: HTMLElement, cls: string | null | undefined) {
		const tokens = CSSUtil.splitTokens(cls);
		tokens.length && el.classList.add(...tokens);
	}
	public static removeClasses(el: HTMLElement, cls: string | null | undefined) {
		const tokens = CSSUtil.splitTokens(cls);
		tokens.length && el.classList.remove(...tokens);
	}
	public static toggleClassesTo(el: HTMLElement, cls: string | null | undefined, state: boolean) {
		(state ? CSSUtil.addClasses : CSSUtil.removeClasses)(el, cls);
	}
}