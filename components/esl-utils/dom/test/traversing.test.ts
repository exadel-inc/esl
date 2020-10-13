import {closestBy, findTarget, isRelative} from '../traversing';

describe('dom/traversing helper tests', () => {
  document.body.innerHTML = `
		<section class="container">
			<div id="row1" class="row" data-test="1">
				<button id="btn1" class="btn btn-1"></button>
				<button id="btn2" class="btn btn-2" data-test="prev"></button>
				<button id="btn3" class="btn btn-3"></button>
				<button id="btn4" class="btn btn-4"></button>
				<button id="btn5" class="btn btn-5" data-test="next"></button>
			</div>
			<div id="row2" class="row">
				<article class="col-1">Hello!</article>
			</div>
		</section>
	`;

  const body = document.body;
  const detached = document.createElement('div');

  const root = document.querySelector('section') as HTMLSelectElement;
  const row1 = document.querySelector('#row1') as HTMLDivElement;
  const row2 = document.querySelector('#row2') as HTMLDivElement;
  const btn1 = document.querySelector('#btn1') as HTMLButtonElement;
  const btn2 = document.querySelector('#btn2') as HTMLButtonElement;
  const btn3 = document.querySelector('#btn3') as HTMLButtonElement;
  const btn4 = document.querySelector('#btn4') as HTMLButtonElement;
  const btn5 = document.querySelector('#btn5') as HTMLButtonElement;
  const article1 = document.querySelector('.col-1') as HTMLButtonElement;

  test('findTarget: direct', () => {
    jest.spyOn(console, 'warn').mockImplementation(() => {});

    expect(findTarget('', btn1)).toBe(btn1);
    expect(findTarget('::next')).toBe(null);
    expect(findTarget('section')).toBe(root);
    expect(findTarget('#btn3')).toBe(btn3);
    expect(findTarget('#null')).toBe(null);

    // FIXME: expect(findTarget('.btn', btn1, true)).toContain(btn4);
  });

  test('findTarget: siblings', () => {
    expect(findTarget('::next', btn1)).toBe(btn2);
    expect(findTarget('::next(.btn-4)', btn1)).toBe(btn4);
    expect(findTarget('::next::next()', btn1)).toBe(btn3);
    expect(findTarget('::prev(.btn-2)', btn5)).toBe(btn2);
    expect(findTarget('::next::prev()', btn1)).toBe(btn1);
  });

  test('findTarget: child', () => {
    expect(findTarget('::child', row1)).toBe(btn1);
    expect(findTarget('::child', row1, true)).toContain(btn4);
    expect(findTarget('::child(.btn.btn-3)', row1)).toBe(btn3);
    expect(findTarget('::child(.btn.btn-3)::next', row1)).toBe(btn4);
  });

  test('findTarget: parent', () => {
    expect(findTarget('::parent', row1)).toBe(root);
    expect(findTarget('::parent', row2)).toBe(root);
    expect(findTarget('::parent(.container)', btn1)).toBe(root);
    expect(findTarget('::parent(.container)::child(.row .btn-3)', article1)).toBe(btn3);
    expect(findTarget('::parent(.container)::next::child(.row .btn-3)', article1)).toBe(null);
  });

  test('findTarget: combination', () => {
    expect(findTarget('#row2::parent')).toBe(root);
    expect(findTarget('#row2::prev')).toBe(row1);
    expect(findTarget('#row2::prev::prev')).toBe(null);
    expect(findTarget('#row2::prev::child', null, true)).toContain(btn2);
  });

  test('isRelative', () => {
    expect(isRelative(body, btn1)).toBeTruthy();
    expect(isRelative(btn1, root)).toBeTruthy();
    expect(isRelative(body, detached)).toBeFalsy();
    expect(isRelative(btn1, btn2)).toBeFalsy();
  });

  test('closestBy', () => {
    expect(closestBy(btn2, (el: HTMLElement) => el.dataset.test === '1')).toBe(row1);
    expect(closestBy(btn2, (el: HTMLElement) => el.tagName.toLowerCase() === 'section')).toBeTruthy();
    expect(closestBy(article1, () => false)).toBe(null);
  });
});
