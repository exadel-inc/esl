import {bind} from '../modules/all';

export class ResizeObserverPolyfill {
  private els = new Set<HTMLElement>();

  constructor(private callback: (els:HTMLElement[]) => void) {
  }
  @bind
  private onChange() {
    this.callback([...this.els]);
  }
  observe(el:HTMLElement) {
    this.els.add(el);
    window.addEventListener('resize', this.onChange);
  }
  unobserve(el:HTMLElement) {
    this.els.delete(el);
    if (this.els.size === 0) {
      window.removeEventListener('resize', this.onChange);
    }
  }
  disconnect() {
    window.removeEventListener('resize', this.onChange);
  }
}
