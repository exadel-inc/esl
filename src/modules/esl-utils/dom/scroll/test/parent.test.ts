import {isScrollable, getScrollParent, getListScrollParents} from '../parent';

const $html = document.documentElement;
const $body = document.body;

describe('Function isScrollParent', () => {
  const target = document.createElement('div');

  describe('Element isn`t scrollable', () => {
    test('element shouldn`t be scrollable without overflow property', () => {
      expect(isScrollable(target)).toBeFalsy();
    });

    test('element shouldn`t be scrollable with overflow property value "inherit"', () => {
      target.style.overflow = 'inherit';
      expect(isScrollable(target)).toBeFalsy();
    });
  });

  describe('Element is scrollable', () => {
    test('element should be scrollable with overflow property value "auto"', () => {
      target.style.overflow = 'auto';
      expect(isScrollable(target)).toBeTruthy();
    });

    test('element should be scrollable with overflow property value "scroll"', () => {
      target.style.overflow = 'scroll';
      expect(isScrollable(target)).toBeTruthy();
    });

    test('element should be scrollable with overflow property value "overlay"', () => {
      target.style.overflow = 'overlay';
      expect(isScrollable(target)).toBeTruthy();
    });

    test('element should be scrollable with overflow property value "hidden"', () => {
      target.style.overflow = 'hidden';
      expect(isScrollable(target)).toBeTruthy();
    });
  });
});

describe('Function getScrollParent', () => {
  const target = document.createElement('div');

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
    target.appendChild(firstLevelChild);
    firstLevelChild.appendChild(secondLevelChild);

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
});

describe('Function getListScrollParents', () => {
  const taget = document.createElement('div');

  test('target`s scroll parent(s) should not be found for element', () => {
    expect(getListScrollParents(taget)).toEqual([]);
  });

  test('target`s scroll parent should be target element itself', () => {
    taget.style.overflow = 'auto';
    expect(getListScrollParents(taget)).toEqual([taget]);
  });

  test('target`s scroll parent should be target`s parent element', () => {
    taget.style.overflow = '';
    $body.style.overflow = 'auto';
    expect(getListScrollParents(taget)).toEqual([$body]);
  });

  test('target should have multiple scrollable parents', () => {
    const firstLevelChild = document.createElement('div');
    const secondLevelChild = document.createElement('div');
    const thirdLevelChild = document.createElement('div');

    firstLevelChild.style.overflow = 'auto';
    thirdLevelChild.style.overflow = 'auto';

    secondLevelChild.appendChild(thirdLevelChild);
    taget.appendChild(firstLevelChild);
    firstLevelChild.appendChild(secondLevelChild);

    expect(getListScrollParents(thirdLevelChild)).toEqual([thirdLevelChild, firstLevelChild, $body]);
  });
});
