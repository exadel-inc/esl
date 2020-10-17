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
    ['section', root],
    ['section > .row', row1],
    ['section > .row:first-child', row1],
    ['#btn3', btn3],
    ['#null', null]
  ])('query("%s")', (sel, expected) => expect(TraversingUtil.query(sel)).toBe(expected));

  test.each([
    // Nest query test
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
    ['::find(.container)', root, null]
  ])('query("%s", base)', (sel, base, expected) => expect(TraversingUtil.query(sel, base as Element)).toBe(expected));

  test('isRelative', () => {
    expect(TraversingUtil.isRelative(document.body, btn1)).toBeTruthy();
    expect(TraversingUtil.isRelative(btn1, root)).toBeTruthy();
    expect(TraversingUtil.isRelative(document.body, document.createElement('div'))).toBeFalsy();
    expect(TraversingUtil.isRelative(btn1, btn2)).toBeFalsy();
  });

  test('closestBy', () => {
    expect(TraversingUtil.closestBy(btn2, (el: HTMLElement) => el.dataset.test === '1')).toBe(row1);
    expect(TraversingUtil.closestBy(btn2, (el: HTMLElement) => el.tagName.toLowerCase() === 'section')).toBeTruthy();
    expect(TraversingUtil.closestBy(article1, () => false)).toBe(null);
  });
});
