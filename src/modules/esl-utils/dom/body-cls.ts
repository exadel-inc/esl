import {CSSUtil} from './styles';

const clsLockMap = new Map<string, HTMLElement[]>();
export abstract class BodyClassManager {
  /**
   * Toggle all classes from the class string on the body element to the passed state.
   * Class string can be nullable or contain multiple classes separated by space.
   * Check locks to toggle state.
   * */
  public static toggleClsTo(cls: string | null | undefined, lock: HTMLElement, state: boolean) {
    (state ? BodyClassManager.addCls : BodyClassManager.removeCls)(cls, lock);
  }

  /**
   * Add all classes from the class string to the body element.
   * Class string can be nullable or contain multiple classes separated by space.
   * Mark class add with the passed lock.
   * */
  public static addCls(cls: string | null | undefined, lock: HTMLElement) {
    CSSUtil.splitTokens(cls).forEach((className) => {
      BodyClassManager.lock(className, lock);
      document.body.classList.add(className);
    });
  }

  /**
   * Remove all classes from the class string to the body element.
   * Class string can be nullable or contain multiple classes separated by space.
   * Class will not be removed until all lockers will be resolved.
   * */
  public static removeCls(cls: string | null | undefined, lock: HTMLElement) {
    CSSUtil.splitTokens(cls).forEach((className) => {
      if (!BodyClassManager.unlock(className, lock)) return;
      document.body.classList.remove(className);
    });
  }

  /** Unlock classes from removal */
  public static unlockCls(cls: string | null | undefined) {
    CSSUtil.splitTokens(cls).forEach((className) => clsLockMap.delete(className));
  }

  /** Remove lock and return current lock state. */
  protected static lock(className: string, lock: HTMLElement): void {
    const currentList = clsLockMap.get(className) || [];
    currentList.push(lock);
    clsLockMap.set(className, currentList);
  }

  /** Remove lock and return current lock state. */
  protected static unlock(className: string, lock: HTMLElement): boolean {
    const currentList = clsLockMap.get(className) || [];
    const lockIndex = currentList.indexOf(lock);
    (lockIndex >= 0) && currentList.splice(lockIndex, 1);
    return !currentList.length;
  }
}
