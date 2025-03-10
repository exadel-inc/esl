import {rafDecorator} from '../async/raf';

/**
 * Small utility to provide 100vw and 100vh alternative CSS Variables
 * - vwProp (default: `--100vw`) - scroll independent viewport width value
 * - vhProp (default: `--100vh`) - device independent viewport height value (also known as 100vh iOS fix)
 */
export class ESLVSizeCSSProxy {
  public static vwProp = '--100vw';
  public static vhProp = '--100vh';

  /** Inits custom CSS variables for viewport sizes and it's observation */
  public static observe(): void {
    this.update();
    window.addEventListener('resize', this.updateDebounced);
  }
  /** Destroys observer */
  public static destroy(): void {
    window.removeEventListener('resize', this.updateDebounced);
  }

  /** Update custom CSS variables with actual viewport sizes */
  protected static update(): void {
    const $html = document.documentElement;
    $html.style.setProperty(this.vwProp, `${this.viewportWidth}px`);
    $html.style.setProperty(this.vhProp, `${this.viewportHeight}px`);
  }
  protected static readonly updateDebounced = rafDecorator(this.update.bind(this));

  /** @returns current viewport width */
  public static get viewportWidth(): number {
    return document.documentElement.clientWidth;
  }
  /** @returns current viewport height */
  public static get viewportHeight(): number {
    return window.innerHeight;
  }
}
