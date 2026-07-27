import {IntersectionObserverMock} from '../../test/intersectionObserver.mock';
import {ESLStickyBoxMixin} from '../core/esl-sticky-box';

describe('ESLStickyBoxMixin tests', () => {
  beforeAll(() => {
    IntersectionObserverMock.mock();
    ESLStickyBoxMixin.register();
  });
  afterAll(() => {
    IntersectionObserverMock.restore();
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  /** Creates a host element with the mixin attribute (optionally with a JSON config) and appends it to the document */
  const createBox = async (config?: ESLStickyBoxMixin['config'], $parent: Element = document.body): Promise<HTMLElement> => {
    const $box = document.createElement('div');
    $box.setAttribute(ESLStickyBoxMixin.is, config ? JSON.stringify(config) : '');
    $parent.appendChild($box);
    await Promise.resolve(); // Wait for the mixin to be attached (MutationObserver microtask)
    return $box;
  };

  test('mixin instance is attached to the host element with the mixin attribute', async () => {
    const $box = await createBox();
    expect(ESLStickyBoxMixin.get($box)).toBeInstanceOf(ESLStickyBoxMixin);
  });

  test('uses browser viewport (null root) by default', async () => {
    await createBox();
    expect(IntersectionObserverMock.lastInstance.root).toBeNull();
  });

  test('resolves root element via the `root` config option (traversing query)', async () => {
    const $container = document.createElement('div');
    $container.className = 'container';
    document.body.appendChild($container);
    await createBox({root: '::parent(.container)'}, $container);
    expect(IntersectionObserverMock.lastInstance.root).toBe($container);
  });

  test('falls back to the browser viewport if the `root` target can not be resolved', async () => {
    await createBox({root: '.non-existing-container'});
    expect(IntersectionObserverMock.lastInstance.root).toBeNull();
  });

  test('updates `stuck` state on intersection change', async () => {
    const $box = await createBox();
    const $sentinel = document.querySelector(`.${ESLStickyBoxMixin.is}-sentinel`) as Element;

    IntersectionObserverMock.trigger($sentinel, {isIntersecting: false, boundingClientRect: {top: -10} as DOMRect});
    expect($box.hasAttribute('stuck')).toBe(true);

    IntersectionObserverMock.trigger($sentinel, {isIntersecting: true, boundingClientRect: {top: 10} as DOMRect});
    expect($box.hasAttribute('stuck')).toBe(false);
  });

  test('updates `stuck` state relative to a custom root container bounds (not just window top)', async () => {
    const $container = document.createElement('div');
    $container.className = 'container';
    document.body.appendChild($container);
    const $box = await createBox({root: '::parent(.container)'}, $container);
    const $sentinel = document.querySelector(`.${ESLStickyBoxMixin.is}-sentinel`) as Element;
    const rootBounds = {top: 100} as DOMRect;

    // sentinel top is above the container's top edge (100) but still positive - should be stuck
    IntersectionObserverMock.trigger($sentinel, {isIntersecting: false, boundingClientRect: {top: 90} as DOMRect, rootBounds});
    expect($box.hasAttribute('stuck')).toBe(true);

    // sentinel top is below the container's top edge - should not be stuck
    IntersectionObserverMock.trigger($sentinel, {isIntersecting: true, boundingClientRect: {top: 110} as DOMRect, rootBounds});
    expect($box.hasAttribute('stuck')).toBe(false);
  });

  test('mixin is detached and sentinel listener removed when the mixin attribute is removed', async () => {
    const $box = await createBox();
    expect(ESLStickyBoxMixin.get($box)).toBeInstanceOf(ESLStickyBoxMixin);

    $box.removeAttribute(ESLStickyBoxMixin.is);
    await Promise.resolve(); // Wait for the mixin to be detached (MutationObserver microtask)
    expect(ESLStickyBoxMixin.get($box)).toBe(null);
  });
});
