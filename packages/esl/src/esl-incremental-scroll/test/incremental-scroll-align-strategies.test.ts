import {
  keepPosition,
  alignToTop,
  alignToMiddle,
  alignToBottom,
  alignToLeft,
  alignToCenter,
  alignToRight
} from '../core/incremental-scroll-align-strategies';
import {Rect} from '../../esl-utils/dom/rect';

const originalWindowMetrics = {
  scrollX: window.scrollX,
  scrollY: window.scrollY,
  innerHeight: window.innerHeight,
  innerWidth: window.innerWidth
};
const originalScrollingElement = document.scrollingElement;

const setScrollingElement = (value: Element | null) => {
  Object.defineProperty(document, 'scrollingElement', {configurable: true, writable: true, value});
};

beforeAll(() => {
  Object.defineProperty(window, 'innerHeight', {configurable: true, writable: true, value: window.innerHeight});
  Object.defineProperty(window, 'innerWidth', {configurable: true, writable: true, value: window.innerWidth});
});

afterEach(() => {
  vi.restoreAllMocks();
  Object.assign(window, {
    scrollX: originalWindowMetrics.scrollX,
    scrollY: originalWindowMetrics.scrollY
  });
  window.innerHeight = originalWindowMetrics.innerHeight;
  window.innerWidth = originalWindowMetrics.innerWidth;
  setScrollingElement(originalScrollingElement);
});

const makeRect = (x: number, y: number, width: number, height: number) => new Rect(x, y, width, height);

describe('keepPosition', () => {
  test('should return zero distance', () => {
    const calc = keepPosition({});

    expect(calc({})).toBe(0);
  });
});

describe('alignToTop', () => {
  test('should calculate distance within container', () => {
    const calc = alignToTop({offset: {y: 15}});
    const elRect = makeRect(0, 120, 50, 50);
    const containerRect = makeRect(0, 80, 100, 100);

    expect(calc({elRect, containerRect})).toBe(25);
  });

  test('should return zero when element rect is missing but container is provided', () => {
    const calc = alignToTop({offset: {y: 10}});
    const containerRect = makeRect(0, 60, 100, 100);

    expect(calc({containerRect})).toBe(0);
  });

  test('should calculate distance relative to viewport without container', () => {
    const calc = alignToTop({offset: {y: 10}});
    const elRect = makeRect(0, 90, 40, 40);

    expect(calc({elRect})).toBe(80);
  });

  test('should do window scroll position when element rect is missing', () => {
    const calc = alignToTop({offset: {y: 25}});
    Object.assign(window, {scrollY: 180});

    expect(calc({})).toBe(-155);
  });
});

describe('alignToBottom', () => {
  test('should calculate distance within container', () => {
    const calc = alignToBottom({offset: {y: 15}});
    const elRect = makeRect(0, 90, 40, 40);
    const containerRect = makeRect(0, 60, 100, 100);

    expect(calc({elRect, containerRect})).toBe(-45);
  });

  test('should return zero when element rect is missing but container is provided', () => {
    const calc = alignToBottom({offset: 20});
    const containerRect = makeRect(0, 40, 120, 120);

    expect(calc({containerRect})).toBe(0);
  });

  test('should calculate distance relative to viewport without container', () => {
    const calc = alignToBottom({offset: {y: 10}});
    const elRect = makeRect(0, 110, 40, 40);
    window.innerHeight = 200;

    expect(calc({elRect})).toBe(-60);
  });

  test('should do window scroll position when element rect is missing', () => {
    const calc = alignToBottom({offset: {y: 25}});
    const mockDoc = {scrollHeight: 2000} as unknown as Element;
    setScrollingElement(mockDoc);
    window.innerHeight = 600;
    Object.assign(window, {scrollY: 150});

    expect(calc({})).toBe(1275);
  });
});

describe('alignToMiddle', () => {
  test('should calculate distance within container', () => {
    const calc = alignToMiddle({offset: {y: 10}});
    const elRect = makeRect(0, 90, 40, 40);
    const containerRect = makeRect(0, 80, 100, 120);

    expect(calc({elRect, containerRect})).toBe(-40);
  });

  test('should return zero when element rect is missing but container is provided', () => {
    const calc = alignToMiddle({offset: {y: 5}});
    const containerRect = makeRect(0, 70, 100, 100);

    expect(calc({containerRect})).toBe(0);
  });

  test('should use viewport center when container is absent', () => {
    const calc = alignToMiddle({offset: 15});
    const elRect = makeRect(0, 510, 80, 80);
    window.innerHeight = 800;

    expect(calc({elRect})).toBe(135);
  });

  test('should do window scroll position when element rect is missing', () => {
    const calc = alignToMiddle({offset: {y: 20}});
    const mockDoc = {scrollHeight: 2000} as unknown as Element;
    setScrollingElement(mockDoc);
    window.innerHeight = 600;
    Object.assign(window, {scrollY: 150});

    expect(calc({})).toBe(570);
  });
});

describe('alignToLeft', () => {
  test('should calculate distance within container', () => {
    const calc = alignToLeft({offset: {x: 5}});
    const elRect = makeRect(100, 0, 40, 40);
    const containerRect = makeRect(20, 0, 200, 200);

    expect(calc({elRect, containerRect})).toBe(75);
  });

  test('should return zero when element rect is missing but container is provided', () => {
    const calc = alignToLeft({offset: 10});
    const containerRect = makeRect(0, 0, 100, 100);

    expect(calc({containerRect})).toBe(0);
  });

  test('should calculate distance relative to viewport without container', () => {
    const calc = alignToLeft({offset: {x: 12}});
    const elRect = makeRect(45, 0, 30, 30);

    expect(calc({elRect})).toBe(33);
  });

  test('should do window scroll position when element rect is missing', () => {
    const calc = alignToLeft({offset: {x: 30}});
    Object.assign(window, {scrollX: 80});

    expect(calc({})).toBe(-50);
  });
});

describe('alignToRight', () => {
  test('should calculate distance within container', () => {
    const calc = alignToRight({offset: {x: 8}});
    const elRect = makeRect(140, 0, 40, 40);
    const containerRect = makeRect(100, 0, 150, 150);

    expect(calc({elRect, containerRect})).toBe(-78);
  });

  test('should return zero when element rect is missing but container is provided', () => {
    const calc = alignToRight({offset: {x: 5}});
    const containerRect = makeRect(10, 0, 100, 100);

    expect(calc({containerRect})).toBe(0);
  });

  test('should calculate distance relative to viewport without container', () => {
    const calc = alignToRight({offset: {x: 10}});
    const elRect = makeRect(200, 0, 50, 50);
    window.innerWidth = 300;

    expect(calc({elRect})).toBe(-60);
  });

  test('should do window scroll position when element rect is missing', () => {
    const calc = alignToRight({offset: {x: 30}});
    const mockDoc = {scrollWidth: 2400} as unknown as Element;
    setScrollingElement(mockDoc);
    window.innerWidth = 800;
    Object.assign(window, {scrollX: 100});

    expect(calc({})).toBe(1530);
  });
});

describe('alignToCenter', () => {
  test('should calculate distance within container', () => {
    const calc = alignToCenter({offset: {x: 12}});
    const elRect = makeRect(144, 0, 80, 80);
    const containerRect = makeRect(120, 0, 220, 200);

    expect(calc({elRect, containerRect})).toBe(-58);
  });

  test('should return zero when element rect is missing but container is provided', () => {
    const calc = alignToCenter({offset: 5});
    const containerRect = makeRect(120, 0, 160, 160);

    expect(calc({containerRect})).toBe(0);
  });

  test('should use viewport center when container is absent', () => {
    const calc = alignToCenter({offset: {x: 15}});
    const elRect = makeRect(400, 0, 80, 80);
    window.innerWidth = 600;

    expect(calc({elRect})).toBe(125);
  });

  test('should do window scroll position when element rect is missing', () => {
    const calc = alignToCenter({offset: {x: 40}});
    const mockDoc = {scrollWidth: 2400} as unknown as Element;
    setScrollingElement(mockDoc);
    window.innerWidth = 800;
    Object.assign(window, {scrollX: 100});

    expect(calc({})).toBe(740);
  });
});
