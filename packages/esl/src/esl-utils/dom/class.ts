import {wrap} from '../misc/array';

/** Describe locker elements collection per class name */
type Locks = Map<string, Set<Element>>;
/** Store locks for key element classes*/
const lockStore = new WeakMap<Element, Locks>();

/** Mange className lock for the element */
const lock = (el: Element, className: string, locker: Element): void => {
  const elLocks: Locks = lockStore.get(el) || new Map();
  const classLocks: Set<Element> = elLocks.get(className) || new Set();
  classLocks.add(locker);
  elLocks.set(className, classLocks);
  lockStore.set(el, elLocks);
};
/**
 * Manage className unlock for the element
 * @returns true if className have no locks
 */
const unlock = (el: Element, className: string, locker: Element): boolean => {
  const elLocks = lockStore.get(el);
  if (!elLocks) return true;
  const classLocks = elLocks.get(className);
  if (!classLocks) return true;
  classLocks.delete(locker);
  return !classLocks.size;
};

/**
 * Add single class to the element.
 * Supports inversion and locker management.
 */
const add = (el: Element, className: string, locker?: Element): void => {
  if (className[0] === '!') return remove(el, className.substring(1), locker);
  if (locker) lock(el, className, locker);
  el.classList.add(className);
};

/**
 * Remove single class from the element.
 * Supports inversion and locker management.
 */
const remove = (el: Element, className: string, locker?: Element): void => {
  if (className[0] === '!') return add(el, className.substring(1), locker);
  if (locker && !unlock(el, className, locker)) return;
  if (!locker) CSSClassUtils.unlock(el, className);
  el.classList.remove(className);
};

/**
 * Check if the element matches passed CSS class.
 * Supports inversion.
 */
const has = (el: Element, className: string): boolean => {
  if (className[0] === '!') return !has(el, className.substring(1));
  return el.classList.contains(className);
};

/**
 * CSS class manipulation utilities.
 *
 * Allows manipulating with CSS classes with the following set of sub-features:
 * - JQuery-like enumeration - you can pass multiple tokens separated by space
 * - safe checks - empty or falsy token sting will be ignored without throwing an error
 * - inversion syntax - tokens that start from '!' will be processed with inverted action
 * (e.g. addCls(el, '!class') - will remove 'class' from the element, while removeCls(el, '!class') adds 'class' to the element)
 * - class locks - you can manipulate with classes using `locker` option that takes into account the modification initiator.
 * That means the class added in 'locker' mode will not be removed until all initiators that requested add class have requested its removal.
 * */
export abstract class CSSClassUtils {
  /** Splitting passed token string into CSS class names array. */
  public static splitTokens(tokenString: string | null | undefined): string[] {
    return (tokenString || '').split(' ').filter((str) => !!str);
  }

  /**
   * Add all classes from the class token string to the element.
   * @see CSSClassUtils
   * */
  public static add(els: Element | Element[], cls: string | null | undefined, locker?: Element): void {
    const tokens = CSSClassUtils.splitTokens(cls);
    wrap(els).forEach((el) => tokens.forEach((className) => add(el, className, locker)));
  }

  /**
   * Remove all classes from the class token string to the element.
   * @see CSSClassUtils
   * */
  public static remove(els: Element | Element[], cls: string | null | undefined, locker?: Element): void {
    const tokens = CSSClassUtils.splitTokens(cls);
    wrap(els).forEach((el) => tokens.forEach((className) => remove(el, className, locker)));
  }

  /**
   * Toggle all classes from the class token string on the element to the passed state.
   * @see CSSClassUtils
   * */
  public static toggle(els: Element | Element[], cls: string | null | undefined, state: boolean, locker?: Element): void {
    (state ? CSSClassUtils.add : CSSClassUtils.remove)(els, cls, locker);
  }

  /**
   * Check if all class from token string matches to the element or elements.
   * @see CSSClassUtils
   * */
  public static has(els: Element | Element[], cls: string): boolean {
    const tokens = CSSClassUtils.splitTokens(cls);
    return wrap(els).every((el) => tokens.every((className) => has(el, className)));
  }

  /** Remove all lockers for the element or passed element className */
  public static unlock(els: Element | Element[], className?: string): void {
    if (className) {
      wrap(els).forEach((el) => lockStore.get(el)?.delete(className));
    } else {
      wrap(els).forEach((el) => lockStore.delete(el));
    }
  }
}
