import {rafDecorator} from '../async/raf';
import {DeviceDetector} from '../environment/device-detector';

/**
 * Small utility to provide 100vw and 100vh alternative CSS Variables
 * - vwProp (default: `--100vw`) - is a scroll independent viewport width value
 * - vhProp (default: `--100vh`) - is a device independent viewport height value (aso known as 100vh iOS fix)
 */
export class ESLVSizeCSSProxy {
  public static vwProp = '--100vw';
  public static vhProp = '--100vh';

  /** Inits custom CSS variables for viewport sizes and it's observation */
  public static observe() {
    // IE doesn’t support CSS Variables (hopefully same as 100vh issue :D)
    if (DeviceDetector.isIE) return;

    this.update();
    window.addEventListener('resize', this.updateDebounced);
  }
  /** Destroys observer */
  public static destroy() {
    window.removeEventListener('resize', this.updateDebounced);
  }

  /** Update custom CSS variables with actual viewport sizes */
  protected static update() {
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
