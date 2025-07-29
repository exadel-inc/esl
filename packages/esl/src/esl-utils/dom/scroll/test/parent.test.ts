import {isScrollable, getScrollParent, getListScrollParents} from '../parent';

const $html = document.documentElement;
const $body = document.body;

describe('Function isScrollable', () => {
  const target = document.createElement('div');
  beforeAll(() => document.body.appendChild(target));
  afterAll(() => document.body.removeChild(target));

  describe('Element isn`t scrollable', () => {
    test('element shouldn`t be scrollable without overflow property', () => {
      expect(isScrollable(target)).toBe(false);
    });

    test('element shouldn`t be scrollable with overflow property value "inherit"', () => {
      target.style.overflow = 'inherit';
      expect(isScrollable(target)).toBe(false);
    });
  });

  describe('Element is scrollable', () => {
    test('element should be scrollable with overflow property value "auto"', () => {
      target.style.overflow = 'auto';
      expect(isScrollable(target)).toBe(true);
    });

    test('element should be scrollable with overflow property value "scroll"', () => {
      target.style.overflow = 'scroll';
      expect(isScrollable(target)).toBe(true);
    });

    test('element should be scrollable with overflow property value "overlay"', () => {
      target.style.overflow = 'overlay';
      expect(isScrollable(target)).toBe(true);
    });

    test('element should be scrollable with overflow property value "hidden"', () => {
      target.style.overflow = 'hidden';
      expect(isScrollable(target)).toBe(true);
    });
  });
});

describe('Function getScrollParent', () => {
  const target = document.createElement('div');
  beforeAll(() => document.body.appendChild(target));
  afterAll(() => document.body.removeChild(target));

  describe('Element doesn`t have scrollable parent(s)', () => {
    beforeAll(() => target.style.overflow = '');

    test('scroll parent shouldn`t be found for specified element', () => {
      expect(getScrollParent(target)).toEqual($body);
    });

    test('scroll parent shouldn`t be found for target`s parent element', () => {
      expect(getScrollParent($body)).toEqual($body);
    });

    test('scroll parent shouldn`t be found for html element', () => {
      expect(getScrollParent($html)).toEqual($body);
    });
  });

  describe('Element does have scrollable parent(s)', () => {
    const firstLevelChild = document.createElement('div');
    const secondLevelChild = document.createElement('div');
    const thirdLevelChild = document.createElement('div');

    secondLevelChild.appendChild(thirdLevelChild);
    firstLevelChild.appendChild(secondLevelChild);
    target.appendChild(firstLevelChild);

    beforeAll(() => target.style.overflow = 'auto');

    test('target element should be scrollable', () => {
      expect(getScrollParent(target)).toEqual(target);
    });

    test('parent should be scrollable on 1st level of element tree', () => {
      expect(getScrollParent(firstLevelChild)).toEqual(target);
    });

    test('parent should be scrollable on 2nd level of element tree', () => {
      expect(getScrollParent(secondLevelChild)).toEqual(target);
    });

    test('parent should be scrollable on 3rd level of element tree', () => {
      expect(getScrollParent(thirdLevelChild)).toEqual(target);
    });
  });

  describe('Limit search to top target element', () => {
    const firstLevelChild = document.createElement('div');
    target.appendChild(firstLevelChild);

    firstLevelChild.style.overflow = 'auto';

    beforeAll(() => target.style.overflow = '');

    test('should detect first scrollable parent element', () => {
      expect(getScrollParent(firstLevelChild, target)).toEqual(firstLevelChild);
    });

    test('should accept body element as top target element', () => {
      expect(getScrollParent(target, $body)).toEqual($body);
    });

    test('should return undefined if any scrollable parents found', () => {
      expect(getScrollParent(target, target)).toEqual(undefined);
    });
  });
});

describe('Function getListScrollParents', () => {
  const target = document.createElement('div');
  beforeAll(() => document.body.appendChild(target));
  afterAll(() => document.body.removeChild(target));

  test('target`s scroll parent(s) should not be found for element', () => {
    expect(getListScrollParents(target)).toEqual([]);
  });

  test('target`s scroll parent should be target element itself', () => {
    target.style.overflow = 'auto';
    expect(getListScrollParents(target)).toEqual([target]);
  });

  test('target`s scroll parent should be target`s parent element', () => {
    target.style.overflow = '';
    $body.style.overflow = 'auto';
    expect(getListScrollParents(target)).toEqual([$body]);
  });

  test('target should have multiple scrollable parents', () => {
    const firstLevelChild = document.createElement('div');
    const secondLevelChild = document.createElement('div');
    const thirdLevelChild = document.createElement('div');

    firstLevelChild.style.overflow = 'auto';
    thirdLevelChild.style.overflow = 'auto';

    secondLevelChild.appendChild(thirdLevelChild);
    target.appendChild(firstLevelChild);
    firstLevelChild.appendChild(secondLevelChild);

    expect(getListScrollParents(thirdLevelChild)).toEqual([thirdLevelChild, firstLevelChild, $body]);
  });

  test('target should only detect scrollable elements up to top target element', () => {
    const firstLevelChild = document.createElement('div');
    const secondLevelChild = document.createElement('div');
    const thirdLevelChild = document.createElement('div');

    firstLevelChild.style.overflow = 'auto';
    thirdLevelChild.style.overflow = 'auto';

    secondLevelChild.appendChild(thirdLevelChild);
    target.appendChild(firstLevelChild);
    firstLevelChild.appendChild(secondLevelChild);

    expect(getListScrollParents(thirdLevelChild, secondLevelChild)).toEqual([thirdLevelChild]);
  });
});
