import {
  isMatches,
  isRelativeNode,
  findClosestBy,
  findNext,
  findPrev,
  findParent,
  findClosest,
  findAll,
  findChildren,
  findNextLooped,
  findPrevLooped
} from '../traversing';

describe('Common: dom/traversing helper tests', () => {
  document.body.innerHTML = `
    <section class="container">
      <div id="row1" class="row" data-test="1">
        <button id="btn1" class="btn btn-1"></button>
        <button id="btn2" class="btn btn-2" data-test="prev"></button>
        <button id="btn3" class="btn btn-3"></button>
        <button id="btn4" class="btn btn-4"></button>
        <button id="btn5" class="btn btn-5" data-test="next"></button>

        <article class="col-1">Hello!</article>
      </div>
      <div id="row2" class="row">
        <article class="col-2">Hello 2!</article>
        <button id="btn6" class="btn btn-6" data-test="next"></button>
      </div>
    </section>
  `;

  const div = document.createElement('div');
  const root = document.querySelector('section') as HTMLSelectElement;
  const row1 = document.querySelector('#row1') as HTMLDivElement;
  const btn1 = document.querySelector('#btn1') as HTMLButtonElement;
  const btn2 = document.querySelector('#btn2') as HTMLButtonElement;
  const btn3 = document.querySelector('#btn3') as HTMLButtonElement;
  const btn4 = document.querySelector('#btn4') as HTMLButtonElement;
  const btn5 = document.querySelector('#btn5') as HTMLButtonElement;
  const row2 = document.querySelector('#row2') as HTMLDivElement;
  const article1 = document.querySelector('.col-1') as HTMLElement;

  describe('isRelativeNode', () => {
    test('checks that both nodes are from the same tree path and returns true if they are', () => {
      expect(isRelativeNode(document.body, btn1)).toBeTruthy();
      expect(isRelativeNode(btn1, root)).toBeTruthy();
    });
    test('returns false if nodes are not from the same tree path', () => {
      expect(isRelativeNode(document.body, document.createElement('div'))).toBeFalsy();
      expect(isRelativeNode(btn1, btn2)).toBeFalsy();
    });
  });

  describe('isMatches', () => {
    test('returns true if element matches passed selector or exact predicate function', () => {
      expect(isMatches(div, (el) => div === el)).toBeTruthy();
      expect(isMatches(div, 'div')).toBeTruthy();
    });
    test('returns false if element does not match passed selector or exact predicate function', () => {
      expect(isMatches(div, (el) => root === el)).toBeFalsy();
      expect(isMatches(div, 'span')).toBeFalsy();
    });
    test('returns true if second argument is not passed or undefined', () => {
      expect(isMatches(div)).toBeTruthy();
      expect(isMatches(div, undefined)).toBeTruthy();
    });
  });

  describe('closestBy', () => {
    test('finds closest parent node starting from the base element', () => {
      expect(findClosestBy(null, (el: HTMLElement) => el.dataset.test === '1')).toBe(null);
      expect(findClosestBy(document.createElement('div'), (el: HTMLElement) => el.dataset.test === '1')).toBe(null);
      expect(findClosestBy(btn2, (el: HTMLElement) => el.classList.contains('btn'))).toBe(btn2);
      expect(findClosestBy(btn2, (el: HTMLElement) => el.dataset.test === '1')).toBe(row1);
      expect(findClosestBy(btn2, (el: HTMLElement) => el.tagName.toLowerCase() === 'section')).toBeTruthy();
      expect(findClosestBy(article1, () => false)).toBe(null);
    });
    test('finds closest parent node skipping the base element', () => {
      expect(findClosestBy(btn2, (el: HTMLElement) => el.dataset.test === '1', true)).toBe(row1);
    });
  });

  describe('findNext', () => {
    test('returns first next sibling that matches passed selector', () => {
      expect(findNext(btn1, '#btn2')).toBe(btn2);
      expect(findNext(btn1, '#btn3')).toBe(btn3);
    });
    test('returns null if there are no next siblings matching passed selector', () => {
      expect(findNext(btn2, '#btn1')).toBe(null);
      expect(findNext(btn2, '#btn2')).toBe(null);
    });
  });

  describe('findPrev', () => {
    test('returns first previous sibling that matches passed selector', () => {
      expect(findPrev(btn2, '#btn1')).toBe(btn1);
      expect(findPrev(btn3, '#btn1')).toBe(btn1);
    });
    test('returns null if there are no previous siblings matching passed selector', () => {
      expect(findPrev(btn2, '#btn3')).toBe(null);
      expect(findPrev(btn2, '#btn2')).toBe(null);
    });
  });

  describe('findNextLooped', () => {
    test('returns first next sibling that matches passed selector', () => {
      expect(findNextLooped(btn1, '#btn4')).toBe(btn4);
      expect(findNextLooped(btn1, 'button')).toBe(btn2);
      expect(findNextLooped(btn2, 'button')).toBe(btn3);
    }, 100);
    test('returns first next sibling in loop (if no direct next sibling) that matches passed selector', () => {
      expect(findNextLooped(btn5, 'button')).toBe(btn1);
    }, 100);
    test('returns null if there are no next siblings matching passed selector', () => {
      expect(findNextLooped(btn2, 'time')).toBe(null);
    }, 100);
  });

  describe('findPrevLooped', () => {
    test('returns first previous sibling that matches passed selector', () => {
      expect(findPrevLooped(btn3, '#btn1')).toBe(btn1);
      expect(findPrevLooped(btn2, 'button')).toBe(btn1);
      expect(findPrevLooped(btn3, 'button')).toBe(btn2);
    }, 100);
    test('returns first previous sibling in loop (if no direct next sibling) that matches passed selector', () => {
      expect(findPrevLooped(btn1, 'button')).toBe(btn5);
    }, 100);
    test('returns null if there are no previous siblings matching passed selector', () => {
      expect(findPrevLooped(btn2, 'time')).toBe(null);
    }, 100);
  });

  describe('findParent', () => {
    test('returns first parent element matching passed selector', () => {
      expect(findParent(btn1, '#row1')).toBe(row1);
      expect(findParent(btn2, '.container')).toBe(root);
    });
    test('returns null if there are no parent elements matching passed selector', () => {
      expect(findParent(btn2, '#row2')).toBe(null);
    });
  });

  describe('findClosest', () => {
    test('returns the element or their parent that matches passed selector', () => {
      expect(findClosest(btn1, '.btn')).toBe(btn1);
      expect(findClosest(btn2, '.container')).toBe(root);
    });
    test('returns null if the element and their parents do not match passed selector', () => {
      expect(findClosest(btn2, '#row2')).toBe(null);
    });
  });

  describe('findAll', () => {
    test('returns array of all matching elements in subtree', () => {
      expect(findAll(row1, '.btn')).toStrictEqual([btn1, btn2, btn3, btn4, btn5]);
      expect(findAll(row1, '#btn3')).toStrictEqual([btn3]);
    });
    test('returns empty array if there are no matching elements in subtree', () => {
      expect(findAll(row1, '.btn-6')).toStrictEqual([]);
    });
  });

  describe('findChildren', () => {
    test('returns array of all children matching passed selector', () => {
      expect(findChildren(row1, '.btn')).toStrictEqual([btn1, btn2, btn3, btn4, btn5]);
      expect(findChildren(root, '.row')).toStrictEqual([row1, row2]);
    });
    test('returns empty array if there are no children matching passed selector', () => {
      expect(findChildren(root, '.btn')).toStrictEqual([]);
    });
  });
});
