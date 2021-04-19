/**
 * @deprecated
 * CSS manipulation utilities.
 *
 * Use {@link CSSClassUtils} instead
 * */
export abstract class CSSUtil {
  /** Splitting passed token string into CSS class names array. */
  public static splitTokens(tokenString: string | null | undefined): string[] {
    return (tokenString || '').split(' ').filter((str) => !!str);
  }

  /**
   * Add all classes from the class string to the element.
   * Class string can be nullable or contain multiple classes separated by space.
   * */
  public static addCls(el: HTMLElement, cls: string | null | undefined) {
    const tokens = CSSUtil.splitTokens(cls);
    tokens.length && el.classList.add(...tokens);
  }

  /**
   * Remove all classes from the class string to the element.
   * Class string can be nullable or contain multiple classes separated by space.
   * */
  public static removeCls(el: HTMLElement, cls: string | null | undefined) {
    const tokens = CSSUtil.splitTokens(cls);
    tokens.length && el.classList.remove(...tokens);
  }

  /**
   * Toggle all classes from the class string on the element to the passed state.
   * Class string can be nullable or contain multiple classes separated by space.
   * */
  public static toggleClsTo(el: HTMLElement, cls: string | null | undefined, state: boolean) {
    (state ? CSSUtil.addCls : CSSUtil.removeCls)(el, cls);
  }
}
