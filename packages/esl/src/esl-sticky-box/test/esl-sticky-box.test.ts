import {IntersectionObserverMock} from '../../test/intersectionObserver.mock';
import {ESLStickyBox} from '../core/esl-sticky-box';

describe('ESLStickyBox tests', () => {
  beforeAll(() => {
    IntersectionObserverMock.mock();
    ESLStickyBox.register();
  });
  afterAll(() => {
    IntersectionObserverMock.restore();
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  const createBox = (root?: string): ESLStickyBox => {
    const $box = ESLStickyBox.create();
    if (root) $box.setAttribute('root', root);
    document.body.appendChild($box);
    return $box;
  };

  test('uses browser viewport (null root) by default', () => {
    createBox();
    expect(IntersectionObserverMock.lastInstance.root).toBeNull();
  });

  test('resolves root element via the `root` attribute (traversing query)', () => {
    const $container = document.createElement('div');
    $container.className = 'container';
    document.body.appendChild($container);
    const $box = ESLStickyBox.create();
    $box.setAttribute('root', '::parent(.container)');
    $container.appendChild($box);
    expect(IntersectionObserverMock.lastInstance.root).toBe($container);
  });

  test('falls back to the browser viewport if the `root` target can not be resolved', () => {
    createBox('.non-existing-container');
    expect(IntersectionObserverMock.lastInstance.root).toBeNull();
  });

  test('updates `stuck` state on intersection change', () => {
    const $box = createBox();
    const $sentinel = document.querySelector(`.${ESLStickyBox.is}-sentinel`) as Element;

    IntersectionObserverMock.trigger($sentinel, {isIntersecting: false, boundingClientRect: {top: -10} as DOMRect});
    expect($box.hasAttribute('stuck')).toBe(true);

    IntersectionObserverMock.trigger($sentinel, {isIntersecting: true, boundingClientRect: {top: 10} as DOMRect});
    expect($box.hasAttribute('stuck')).toBe(false);
  });

  test('updates `stuck` state relative to a custom root container bounds (not just window top)', () => {
    const $container = document.createElement('div');
    $container.className = 'container';
    document.body.appendChild($container);
    const $box = ESLStickyBox.create();
    $box.setAttribute('root', '::parent(.container)');
    $container.appendChild($box);
    const $sentinel = document.querySelector(`.${ESLStickyBox.is}-sentinel`) as Element;
    const rootBounds = {top: 100} as DOMRect;

    // sentinel top is above the container's top edge (100) but still positive - should be stuck
    IntersectionObserverMock.trigger($sentinel, {isIntersecting: false, boundingClientRect: {top: 90} as DOMRect, rootBounds});
    expect($box.hasAttribute('stuck')).toBe(true);

    // sentinel top is below the container's top edge - should not be stuck
    IntersectionObserverMock.trigger($sentinel, {isIntersecting: true, boundingClientRect: {top: 110} as DOMRect, rootBounds});
    expect($box.hasAttribute('stuck')).toBe(false);
  });
});
