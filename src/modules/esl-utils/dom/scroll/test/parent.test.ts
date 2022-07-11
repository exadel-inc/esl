import {isScrollable, getScrollParent, getListScrollParents} from '../parent';

const $html = document.documentElement;
const $body = document.body;

describe('Function isScrollParent', () => {
  const element = document.createElement('div');

  test('element isn`t scrollable', () => {
    expect(isScrollable(element)).toBeFalsy();

    element.style.overflow = 'inherit';
    expect(isScrollable(element)).toBeFalsy();
  });

  test('element is scrollable', () => {
    element.style.overflow = 'auto';
    expect(isScrollable(element)).toBeTruthy();

    element.style.overflow = 'scroll';
    expect(isScrollable(element)).toBeTruthy();

    element.style.overflow = 'overlay';
    expect(isScrollable(element)).toBeTruthy();

    element.style.overflow = 'hidden';
    expect(isScrollable(element)).toBeTruthy();
  });
});

describe('Function getScrollParent', () => {
  const element = document.createElement('div');

  describe('Element doesn`t have scrollable parent(s)', () => {
    beforeAll(() => element.style.overflow = '');

    test('scrollable parent not found for specified element', () => {
      expect(getScrollParent(element)).toEqual($body);
    });

    test('scrollable parent not found for body element', () => {
      expect(getScrollParent($body)).toEqual($body);
    });

    test('scrollable parent not found for html element', () => {
      expect(getScrollParent($html)).toEqual($body);
    });
  });

  describe('Element does have scrollable parent(s)', () => {
    const firstLevelChild = document.createElement('div');
    const secondLevelChild = document.createElement('div');
    const thirdLevelChild = document.createElement('div');

    secondLevelChild.appendChild(thirdLevelChild);
    element.appendChild(firstLevelChild);
    firstLevelChild.appendChild(secondLevelChild);

    beforeAll(() => element.style.overflow = 'auto');

    test('specified element is scrollable', () => {
      expect(getScrollParent(element)).toEqual(element);
    });

    test('scrollable parent on 1st level of element tree', () => {
      expect(getScrollParent(firstLevelChild)).toEqual(element);
    });

    test('scrollable parent on 2nd level of element tree', () => {
      expect(getScrollParent(secondLevelChild)).toEqual(element);
    });

    test('scrollable parent on 3rd level of element tree', () => {
      expect(getScrollParent(thirdLevelChild)).toEqual(element);
    });
  });
});

describe('Function getListScrollParents', () => {
  const element = document.createElement('div');

  test('scroll parent(s) not found for element', () => {
    expect(getListScrollParents(element)).toEqual([]);
  });

  test('scroll parent is element itself', () => {
    element.style.overflow = 'auto';
    expect(getListScrollParents(element)).toEqual([element]);
  });

  test('scroll parent is body element', () => {
    element.style.overflow = '';
    $body.style.overflow = 'auto';
    expect(getListScrollParents(element)).toEqual([$body]);
  });

  test('multiple scrollable parents', () => {
    const firstLevelChild = document.createElement('div');
    const secondLevelChild = document.createElement('div');
    const thirdLevelChild = document.createElement('div');

    firstLevelChild.style.overflow = 'auto';
    thirdLevelChild.style.overflow = 'auto';

    secondLevelChild.appendChild(thirdLevelChild);
    element.appendChild(firstLevelChild);
    firstLevelChild.appendChild(secondLevelChild);

    expect(getListScrollParents(thirdLevelChild)).toEqual([thirdLevelChild, firstLevelChild, $body]);
  });
});
