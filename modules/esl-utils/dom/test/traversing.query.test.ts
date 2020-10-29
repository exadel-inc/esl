import {TraversingUtils} from '../traversing';

describe('Traversing Query (dom/traversing) tests', () => {
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
  const article1 = document.querySelector('.col-1') as HTMLElement;
  const article2 = document.querySelector('.col-2') as HTMLElement;

  test.each([
    '::next',
    '::prev',
    '::find',
    '::find(.btn)',
    '::child',
    '::child(.btn)',
    '::parent',
    '::parent(body)'
  ])('Null check: query[All]("%s", null)', (sel) => {
    expect(TraversingUtils.query(sel)).toBe(null);
    expect(TraversingUtils.queryAll(sel)).toEqual([]);
  });

  test.each([
    // Simple queries
    ['#null', undefined, []],
    ['#btn3', undefined, [btn3]],
    ['section', undefined, [root]],
    ['section > .row', undefined, [row1, row2]],
    ['section > .row:first-child', undefined, [row1]],

    // Next query test
    ['::next', btn1, [btn2]],
    ['::next', btn6, []],
    ['::next(article)', btn1, [article1]],
    ['::next(article.col-1)', btn1, [article1]],
    ['::next(article.col-2)', btn1, []],

    // Prev query test
    ['::prev', btn2, [btn1]],
    ['::prev', btn1, []],
    ['::prev(.btn)', article1, [btn5]],
    ['::prev(#btn2)', article1, [btn2]],
    ['::prev(#btn6)', article1, []],

    // Child query test
    ['::child', article1, []],
    ['::child', row1, [btn1, btn2, btn3, btn4, btn5, article1]],
    ['::child(#btn2)', row1, [btn2]],
    ['::child(.btn)', article1, []],

    // Parent query test
    ['::parent', article1, [row1]],
    ['::parent', root, [document.body]],
    ['::parent(.container)', btn1, [root]],
    ['::parent(.btn)', btn1, []],

    // Find query test
    ['::find', root, [root]],
    ['::find(.btn)', root, [btn1, btn2, btn3, btn4, btn5, btn6]],
    ['::find(.container)', root, []],
    ['::find(#row1 .btn)', root, [btn1, btn2, btn3, btn4, btn5]],

    // Postprocessors
    ['::find(.btn)::first', root, [btn1]],
    ['::find(.btn)::last', root, [btn6]],
    ['::find(.btn)::nth(1)', root, [btn1]],
    ['::find(.btn)::nth(4)', root, [btn4]],
    ['::find(.btn)::nth(6)', root, [btn6]],
    ['::find(.btn)::nth', root, []],
    ['::find(.btn)::nth(8)', root, []],
    ['::find(.btn)::nth(bla bla)', root, []],

    // Complex query test
    ['::parent::child', root, [root]],
    ['::parent::find(.btn)', btn5, [btn1, btn2, btn3, btn4, btn5]],
    ['::parent::next::find(.col-2)', article1, [article2]],
    ['::parent(.container)::find(.btn)::last', btn5, [btn6]],
    ['::parent(.container)::child(.row)::last::find(.col-2)', article1, [article2]],
  ])('Main query & queryAll test. Sel: "%s", Base: %p.', (sel, base, expectedCollection) => {
    expect(TraversingUtils.query(sel, base as Element))
      .toBe(expectedCollection.length > 0 ? expectedCollection[0] : null);
    expect(TraversingUtils.queryAll(sel, base as Element))
      .toEqual(expectedCollection);
  });
});
