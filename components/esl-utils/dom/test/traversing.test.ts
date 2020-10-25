import {TraversingUtil} from '../traversing';

describe('dom/traversing-query helper tests', () => {
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
  const row2 = document.querySelector('#row2') as HTMLDivElement;
  const btn1 = document.querySelector('#btn1') as HTMLButtonElement;
  const btn2 = document.querySelector('#btn2') as HTMLButtonElement;
  const btn3 = document.querySelector('#btn3') as HTMLButtonElement;
  const btn4 = document.querySelector('#btn4') as HTMLButtonElement;
  const btn5 = document.querySelector('#btn5') as HTMLButtonElement;
  const btn6 = document.querySelector('#btn6') as HTMLButtonElement;
  const article1 = document.querySelector('.col-1') as HTMLButtonElement;
  const article2 = document.querySelector('.col-2') as HTMLButtonElement;

  test.each([
    // Simple queries
    ['section', undefined, root],
    ['section > .row', undefined, row1],
    ['section > .row:first-child', undefined, row1],
    ['#btn3', undefined, btn3],
    ['#null', undefined, null],

    // Next query test
    ['::next', null, null],
    ['::next', btn1, btn2],
    ['::next', btn6, null],
    ['::next(article)', btn1, article1],
    ['::next(article.col-1)', btn1, article1],
    ['::next(article.col-2)', btn1, null],

    // Prev query test
    ['::prev', null, null],
    ['::prev', btn2, btn1],
    ['::prev', btn1, null],
    ['::prev(.btn)', article1, btn5],
    ['::prev(#btn2)', article1, btn2],
    ['::prev(#btn6)', article1, null],

    // Child query test
    ['::child', null, null],
    ['::child', article1, null],
    ['::child', row1, btn1],
    ['::child(#btn2)', row1, btn2],
    ['::child(.btn)', article1, null],

    // Parent query test
    ['::parent', null, null],
    ['::parent', article1, row1],
    ['::parent', root, document.body],
    ['::parent(.container)', btn1, root],
    ['::parent(.btn)', btn1, null],

    // Find query test
    ['::find', null, null],
    ['::find', root, root],
    ['::find(.btn)', root, btn1],
    ['::find(.container)', root, null],
    ['::find(.row .btn)', root, btn1],

    // Postprocessors
    ['::find(.btn)::first', null, null],
    ['::find(.btn)::last', null, null],
    ['::find(.btn)::nth(1)', null, null],
    ['::find(.btn)::first', root, btn1],
    ['::find(.btn)::last', root, btn6],
    ['::find(.btn)::nth(1)', root, btn1],
    ['::find(.btn)::nth(4)', root, btn4],
    ['::find(.btn)::nth(6)', root, btn6],
    ['::find(.btn)::nth', root, null],
    ['::find(.btn)::nth(8)', root, null],
    ['::find(.btn)::nth(bla bla)', root, null],

    // Complex query test
    ['::parent:child', null, null],
    ['::parent::child', root, root],
    ['::parent::next::find(.col-2)', article1, article2],
    ['::parent(.container)::find(.btn)::last', btn5, btn6],
  ])('query("%s", base)', (sel, base, expected) => expect(TraversingUtil.query(sel, base as Element)).toBe(expected));

  test.each([
    // Simple queries
    ['#null', undefined, []],
    ['section > .row', undefined, [row1, row2]],
    ['#btn3', undefined, [btn3]],

    // Next query test
    ['::next', btn1, [btn2]],
    ['::next', btn6, []],
    ['::next(article)', btn1, [article1]],
    ['::next(article.col-1)', btn1, [article1]],

    // Prev query test
    ['::prev', btn2, [btn1]],
    ['::prev', btn1, []],
    ['::prev(.btn)', article1, [btn5]],
    ['::prev(#btn2)', article1, [btn2]],

    // Child query test
    ['::child', article1, []],
    ['::child', row1, [btn1, btn2, btn3, btn4, btn5, article1]],
    ['::child(#btn2)', row1, [btn2]],

    // Parent query test
    ['::parent', article1, [row1]],
    ['::parent', root, [document.body]],
    ['::parent(.container)', btn1, [root]],

    // Find query test
    ['::find', root, [root]],
    ['::find(.btn)', root, [btn1, btn2, btn3, btn4, btn5, btn6]],
    ['::find(.container)', root, []],
    ['::find(#row1 .btn)', root, [btn1, btn2, btn3, btn4, btn5]],

    // Postprocessors
    ['::find(.btn)::first', root, [btn1]],
    ['::find(.btn)::last', root, [btn6]],
    ['::find(.btn)::nth(4)', root, [btn4]],

    // Complex query test
    ['::parent::child', root, [root]],
    ['::parent::next::find(.col-2)', article1, [article2]],
    ['::parent::find(.btn)', btn5, [btn1, btn2, btn3, btn4, btn5]],
  ])('queryAll("%s", base)', (sel, base, expected) => expect(TraversingUtil.queryAll(sel, base as Element)).toEqual(expected));

  test('isRelative', () => {
    expect(TraversingUtil.isRelative(document.body, btn1)).toBeTruthy();
    expect(TraversingUtil.isRelative(btn1, root)).toBeTruthy();
    expect(TraversingUtil.isRelative(document.body, document.createElement('div'))).toBeFalsy();
    expect(TraversingUtil.isRelative(btn1, btn2)).toBeFalsy();
  });

  test('closestBy', () => {
    expect(TraversingUtil.closestBy(null, (el: HTMLElement) => el.dataset.test === '1')).toBe(null);
    expect(TraversingUtil.closestBy(document.createElement('div'), (el: HTMLElement) => el.dataset.test === '1')).toBe(null);
    expect(TraversingUtil.closestBy(btn2, (el: HTMLElement) => el.classList.contains('btn'))).toBe(btn2);
    expect(TraversingUtil.closestBy(btn2, (el: HTMLElement) => el.dataset.test === '1')).toBe(row1);
    expect(TraversingUtil.closestBy(btn2, (el: HTMLElement) => el.dataset.test === '1', true)).toBe(row1);
    expect(TraversingUtil.closestBy(btn2, (el: HTMLElement) => el.tagName.toLowerCase() === 'section')).toBeTruthy();
    expect(TraversingUtil.closestBy(article1, () => false)).toBe(null);
  });
});
