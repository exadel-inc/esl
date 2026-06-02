import {ESLMatchHeightMixin} from '../core';

vi.mock('../../esl-utils/dom/ready', () => ({
  onDocumentReady: (cb: any) => cb()
}));

describe('ESLMatchHeight mixin', () => {
  ESLMatchHeightMixin.register();

  beforeEach(() => {
    document.body.innerHTML = '';
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  interface ChildDef {
    height: number;
    top?: number;
    className?: string;
  }

  const appendChild = (container: HTMLElement, def: number | ChildDef): HTMLElement => {
    const {height, top = 0, className} = typeof def === 'number' ? {height: def, top: 0, className: undefined} : def;
    const child = document.createElement('div');
    child.setAttribute('match-height', '');
    if (className) child.className = className;
    vi.spyOn(child, 'getBoundingClientRect').mockReturnValue({
      top, left: 0, right: 0, bottom: top + height, width: 100, height, x: 0, y: top, toJSON: () => ({})
    });
    container.appendChild(child);
    return child;
  };

  const appendContainer = (children: (number | ChildDef)[], is?: string): HTMLElement => {
    const container = document.createElement('div');
    container.setAttribute(ESLMatchHeightMixin.is, is || '');
    children.forEach((item) => appendChild(container, item));
    document.body.appendChild(container);
    return container;
  };

  describe('initialization', () => {
    test('uses custom selector from attribute value', async () => {
      const $el = appendContainer([100, 200], '.custom-sel');
      await Promise.resolve();
      const mixin = ESLMatchHeightMixin.get($el)!;
      expect(mixin.selector).toBe('.custom-sel');
    });

    test('returns empty array when no children match', async () => {
      const $el = document.createElement('div');
      $el.setAttribute(ESLMatchHeightMixin.is, '.custom-sel');
      document.body.appendChild($el);
      await Promise.resolve();
      const mixin = ESLMatchHeightMixin.get($el)!;
      expect(mixin.$elements).toHaveLength(0);
    });

    test('returns matching child elements', async () => {
      const $el = appendContainer([50, 100, 150]);
      await Promise.resolve();
      const mixin = ESLMatchHeightMixin.get($el)!;
      expect(mixin.$elements).toHaveLength(3);
    });

    test('update is throttled: multiple rapid calls result in a single execution', async () => {
      const $el = appendContainer([100, 150]);
      await Promise.resolve();
      const mixin = ESLMatchHeightMixin.get($el)!;

      vi.advanceTimersByTime(200);

      const resizeSpy = vi.spyOn(mixin, 'resize');

      mixin.update();
      vi.advanceTimersByTime(10);

      mixin.update();
      vi.advanceTimersByTime(10);

      mixin.update();
      vi.advanceTimersByTime(200);

      expect(resizeSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('resize', () => {
    test('equalizes heights of elements in the same row', async () => {
      const $el = appendContainer([100, 150, 120]);
      await Promise.resolve();
      const mixin = ESLMatchHeightMixin.get($el)!;

      mixin.resize();

      $el.querySelectorAll<HTMLElement>('[match-height]').forEach((child) => {
        expect(child.style.height).toBe('150px');
      });
    });

    test('does not set height when fewer than 2 elements', async () => {
      const $el = appendContainer([100]);
      await Promise.resolve();
      const mixin = ESLMatchHeightMixin.get($el)!;

      mixin.resize();

      const child = $el.querySelector('[match-height]') as HTMLElement;
      expect(child.style.height).toBe('');
    });

    test('groups elements by top position', async () => {
      const $el = appendContainer([
        {height: 50, top: 0},
        {height: 80, top: 0},
        {height: 60, top: 100},
        {height: 90, top: 100},
        {height: 40, top: 250},
        {height: 70, top: 250}
      ]);
      await Promise.resolve();
      const mixin = ESLMatchHeightMixin.get($el)!;

      mixin.resize();

      const children = $el.querySelectorAll<HTMLElement>('[match-height]');
      expect(children[0].style.height).toBe('80px');
      expect(children[1].style.height).toBe('80px');
      expect(children[2].style.height).toBe('90px');
      expect(children[3].style.height).toBe('90px');
      expect(children[4].style.height).toBe('70px');
      expect(children[5].style.height).toBe('70px');
    });
  });

  describe('clear', () => {
    test('resets height on all elements', async () => {
      const $el = appendContainer([100, 150]);
      await Promise.resolve();
      const mixin = ESLMatchHeightMixin.get($el)!;

      mixin.resize();
      mixin.clear();

      const children = $el.querySelectorAll<HTMLElement>('[match-height]');
      children.forEach((child) => {
        expect(child.style.height).toBe('');
      });
    });
  });

  describe('compare', () => {
    test('compares items by top when same order', async () => {
      const $el = appendContainer([100]);
      await Promise.resolve();
      const mixin = ESLMatchHeightMixin.get($el)!;

      const a = {$el: document.createElement('div'), order: 0, top: 10, height: 100};
      const b = {$el: document.createElement('div'), order: 0, top: 20, height: 100};
      expect(mixin.compare(a, b)).toBe(-10);
    });

    test('compares items by order when different order', async () => {
      const $el = appendContainer([100]);
      await Promise.resolve();
      const mixin = ESLMatchHeightMixin.get($el)!;

      const a = {$el: document.createElement('div'), order: 0, top: 100, height: 100};
      const b = {$el: document.createElement('div'), order: 1, top: 0, height: 100};
      expect(mixin.compare(a, b)).toBe(Number.NEGATIVE_INFINITY);
    });
  });

  describe('orders', () => {
    test('parses order attribute correctly', async () => {
      const $el = appendContainer([100]);
      $el.setAttribute('esl-match-height-order', '.first | .second');
      await Promise.resolve();
      const mixin = ESLMatchHeightMixin.get($el)!;
      expect(mixin.orders).toEqual(['.first', '.second', '*']);
    });

    test('defaults to [*] when order attribute is not set', async () => {
      const $el = appendContainer([100]);
      await Promise.resolve();
      const mixin = ESLMatchHeightMixin.get($el)!;
      expect(mixin.orders).toEqual(['*']);
    });

    test('groups elements by order priority before top position', async () => {
      const $el = appendContainer([
        {height: 100, top: 0, className: 'first'},
        {height: 120, top: 0, className: 'first'},
        {height: 80, top: 0, className: 'second'},
        {height: 150, top: 0, className: 'second'}
      ]);
      $el.setAttribute('esl-match-height-order', '.first | .second');
      await Promise.resolve();
      const mixin = ESLMatchHeightMixin.get($el)!;
      mixin.resize();

      const children = $el.querySelectorAll<HTMLElement>('[match-height]');

      expect(children[0].style.height).toBe('120px');
      expect(children[1].style.height).toBe('120px');

      expect(children[2].style.height).toBe('150px');
      expect(children[3].style.height).toBe('150px');
    });

    test('elements not matching any order selector fall into wildcard group', async () => {
      const $el = appendContainer([
        {height: 100, top: 0, className: 'first'},
        {height: 80, top: 0, className: 'first'},
        {height: 60, top: 0},
        {height: 90, top: 0}
      ]);
      $el.setAttribute('esl-match-height-order', '.first');
      await Promise.resolve();
      const mixin = ESLMatchHeightMixin.get($el)!;
      mixin.resize();

      const children = $el.querySelectorAll<HTMLElement>('[match-height]');

      expect(children[0].style.height).toBe('100px');
      expect(children[1].style.height).toBe('100px');

      expect(children[2].style.height).toBe('90px');
      expect(children[3].style.height).toBe('90px');
    });

    test('order combined with different top positions', async () => {
      const $el = appendContainer([
        {height: 100, top: 0, className: 'first'},
        {height: 130, top: 0, className: 'first'},
        {height: 80, top: 200, className: 'first'},
        {height: 110, top: 0, className: 'second'},
        {height: 70, top: 0, className: 'second'}
      ]);
      $el.setAttribute('esl-match-height-order', '.first | .second');
      await Promise.resolve();
      const mixin = ESLMatchHeightMixin.get($el)!;

      mixin.resize();

      const children = $el.querySelectorAll<HTMLElement>('[match-height]');

      expect(children[0].style.height).toBe('130px');
      expect(children[1].style.height).toBe('130px');

      expect(children[2].style.height).toBe('');

      expect(children[3].style.height).toBe('110px');
      expect(children[4].style.height).toBe('110px');
    });
  });

  describe('disconnectedCallback', () => {
    test('clears applied heights when mixin is removed', async () => {
      const $el = appendContainer([100, 150]);
      await Promise.resolve();
      const mixin = ESLMatchHeightMixin.get($el)!;

      mixin.resize();
      const children = $el.querySelectorAll<HTMLElement>('[match-height]');
      expect(children[0].style.height).toBe('150px');

      $el.removeAttribute(ESLMatchHeightMixin.is);
      await Promise.resolve();

      children.forEach((child) => expect(child.style.height).toBe(''));
    });
  });

  describe('attributeChangedCallback', () => {
    test('clears old elements when selector changes', async () => {
      const $el = document.createElement('div');
      $el.setAttribute(ESLMatchHeightMixin.is, '.group-a');

      const childA1 = appendChild($el, {height: 100, className: 'group-a'});
      const childA2 = appendChild($el, {height: 150, className: 'group-a'});
      const childB1 = appendChild($el, {height: 200, className: 'group-b'});
      const childB2 = appendChild($el, {height: 250, className: 'group-b'});

      document.body.appendChild($el);
      await Promise.resolve();

      const mixin = ESLMatchHeightMixin.get($el)!;
      vi.advanceTimersByTime(200);

      mixin.resize();
      expect(childA1.style.height).toBe('150px');
      expect(childA2.style.height).toBe('150px');

      $el.setAttribute(ESLMatchHeightMixin.is, '.group-b');
      await Promise.resolve();
      vi.advanceTimersByTime(200);

      expect(childA1.style.height).toBe('');
      expect(childA2.style.height).toBe('');
      expect(childB1.style.height).toBe('250px');
      expect(childB2.style.height).toBe('250px');
    });
  });
});
