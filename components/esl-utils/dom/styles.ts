export abstract class CSSUtil {
	public static splitTokens(tokenString: string) {
		return (tokenString || '').split(' ').filter((str) => !!str);
	}
	public static addClasses(el: HTMLElement, cls: string) {
		const tokens = CSSUtil.splitTokens(cls);
		tokens.length && el.classList.add(...tokens);
	}
	public static removeClasses(el: HTMLElement, cls: string) {
		const tokens = CSSUtil.splitTokens(cls);
		tokens.length && el.classList.remove(...tokens);
	}
	public static toggleClassesTo(el: HTMLElement, cls: string, state: boolean) {
		(state ? CSSUtil.addClasses : CSSUtil.removeClasses)(el, cls);
	}
}