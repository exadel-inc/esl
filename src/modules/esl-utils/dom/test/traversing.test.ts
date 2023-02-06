import {isRelativeNode, findClosestBy} from '../traversing';

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

  const root = document.querySelector('section') as HTMLSelectElement;
  const row1 = document.querySelector('#row1') as HTMLDivElement;
  const btn1 = document.querySelector('#btn1') as HTMLButtonElement;
  const btn2 = document.querySelector('#btn2') as HTMLButtonElement;
  const article1 = document.querySelector('.col-1') as HTMLElement;

  test('isRelativeNode', () => {
    expect(isRelativeNode(document.body, btn1)).toBeTruthy();
    expect(isRelativeNode(btn1, root)).toBeTruthy();
    expect(isRelativeNode(document.body, document.createElement('div'))).toBeFalsy();
    expect(isRelativeNode(btn1, btn2)).toBeFalsy();
  });

  test('closestBy', () => {
    expect(findClosestBy(null, (el: HTMLElement) => el.dataset.test === '1')).toBe(null);
    expect(findClosestBy(document.createElement('div'), (el: HTMLElement) => el.dataset.test === '1')).toBe(null);
    expect(findClosestBy(btn2, (el: HTMLElement) => el.classList.contains('btn'))).toBe(btn2);
    expect(findClosestBy(btn2, (el: HTMLElement) => el.dataset.test === '1')).toBe(row1);
    expect(findClosestBy(btn2, (el: HTMLElement) => el.dataset.test === '1', true)).toBe(row1);
    expect(findClosestBy(btn2, (el: HTMLElement) => el.tagName.toLowerCase() === 'section')).toBeTruthy();
    expect(findClosestBy(article1, () => false)).toBe(null);
  });

  // TODO: add more test to cover traversing utils
});
