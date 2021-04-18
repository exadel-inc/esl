
type Locks = Map<string, HTMLElement[]>;
const lockStore = new WeakMap<HTMLElement, Locks>();

const lock = (el: HTMLElement, className: string, locker: HTMLElement) => {
  const locks = lockStore.get(el) || new Map();
  const currentList = locks.get(className) || [];
  currentList.push(locker);
  locks.set(className, currentList);
  lockStore.set(el, locks);
};
const unlock = (el: HTMLElement, className: string, locker: HTMLElement) => {
  const locks = lockStore.get(el);
  if (!locks) return true;
  const currentList = locks.get(className) || [];
  const lockIndex = currentList.indexOf(locker);
  (lockIndex >= 0) && currentList.splice(lockIndex, 1);
  return !currentList.length;
};

/** CSS manipulation utilities. */
export abstract class CSSUtil {
  /** Splitting passed token string into CSS class names array. */
  public static splitTokens(tokenString: string | null | undefined): string[] {
    return (tokenString || '').split(' ').filter((str) => !!str);
  }

  /**
   * Add all classes from the class string to the element.
   * Class string can be nullable or contain multiple classes separated by space.
   * */
  public static addCls(el: HTMLElement, cls: string | null | undefined, locker?: HTMLElement) {
    CSSUtil.splitTokens(cls).forEach((className) => CSSUtil.addOne(el, className, locker));
  }

  /**
   * Remove all classes from the class string to the element.
   * Class string can be nullable or contain multiple classes separated by space.
   * */
  public static removeCls(el: HTMLElement, cls: string | null | undefined, locker?: HTMLElement) {
    CSSUtil.splitTokens(cls).forEach((className) => CSSUtil.removeOne(el, className, locker));
  }

  /**
   * Toggle all classes from the class string on the element to the passed state.
   * Class string can be nullable or contain multiple classes separated by space.
   * */
  public static toggleClsTo(el: HTMLElement, cls: string | null | undefined, state: boolean, locker?: HTMLElement) {
    (state ? CSSUtil.addCls : CSSUtil.removeCls)(el, cls, locker);
  }

  /** Add class to the element */
  public static addOne(el: HTMLElement, className: string, locker?: HTMLElement): void {
    if (className[0] === '!') return CSSUtil.removeOne(el, className.substr(1), locker);
    if (locker) lock(el, className, locker);
    el.classList.add(className);
  }
  /** Remove class from the element */
  public static removeOne(el: HTMLElement, className: string, locker?: HTMLElement): void {
    if (className[0] === '!') return CSSUtil.addOne(el, className.substr(1), locker);
    if (locker && !unlock(el, className, locker)) return;
    el.classList.remove(className);
  }
}
