import {ESLTraversingQuery} from '../core';

describe('Traversing Query tests', () => {
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

  const traversingQueryWrap = (sel: any, base: any, expectedCollection: any) => {
    expect(ESLTraversingQuery.first(sel, base as Element | null))
      .toBe(expectedCollection.length > 0 ? expectedCollection[0] : null);
    expect(ESLTraversingQuery.all(sel, base as Element | null))
      .toEqual(expectedCollection);
  };

  describe('test cases when base element is absent', () => {
    test.each([
      '::next',
      '::prev',
      '::find',
      '::find(.btn)',
      '::child',
      '::child(.btn)',
      '::parent',
      '::parent(body)',
      '::closest',
      '::closest(.btn)'
    ])('Null check: ESLTraversingQuery.all/one(%s, null)', (sel) => {
      expect(ESLTraversingQuery.first(sel)).toBe(null);
      expect(ESLTraversingQuery.all(sel)).toEqual([]);
    });
  });

  describe('queries with plain selectors', () => {
    test.each([
      ['#null', undefined, []],
      ['#btn3', undefined, [btn3]],
      ['#btn3', null, [btn3]],
      ['section', undefined, [root]],
      ['section > .row', undefined, [row1, row2]],
      ['section > .row:first-child', undefined, [row1]]
    ])('Main check: ESLTraversingQuery.el: %s, Base: %o.', traversingQueryWrap);
  });

  describe('pseudo-selector ::next', () => {
    test.each([
      ['::next', btn1, [btn2]],
      ['::next', btn6, []],
      ['::next(article)', btn1, [article1]],
      ['::next(article.col-1)', btn1, [article1]],
      ['::next(article.col-2)', btn1, []]
    ])('Main check: TraversSel: %s, Base: %o.', traversingQueryWrap);
  });

  describe('pseudo-selector ::prev', () => {
    test.each([
      ['::prev', btn2, [btn1]],
      ['::prev', btn1, []],
      ['::prev(.btn)', article1, [btn5]],
      ['::prev(#btn2)', article1, [btn2]],
      ['::prev(#btn6)', article1, []]
    ])('Main check: ESLTraversingQuery: %s, Base: %o.', traversingQueryWrap);
  });

  describe('pseudo-selector ::child', () => {
    test.each([
      ['::child', article1, []],
      ['::child', row1, [btn1, btn2, btn3, btn4, btn5, article1]],
      ['::child(#btn2)', row1, [btn2]],
      ['::child(.btn)', article1, []]
    ])('Main check: TraversingQuel: %s, Base: %o.', traversingQueryWrap);
  });

  describe('pseudo-selector ::parent', () => {
    test.each([
      ['::parent', article1, [row1]],
      ['::parent', root, [document.body]],
      ['::parent(.container)', btn1, [root]],
      ['::parent(.btn)', btn1, []]
    ])('Main check: ESLTraversingQuery.all/one, Sel: %s, Base: %o.', traversingQueryWrap);
  });

  describe('pseudo-selector ::closest', () => {
    test.each([
      ['::closest', btn1, [btn1]],
      ['::closest(.btn)', btn1, [btn1]],
      ['::closest(#row1)', btn1, [row1]],
      ['::closest(.btn)', row1, []],
    ])('Main check: ESLTraversingQuery.all/one, Sel: %s, Base: %o.', traversingQueryWrap);
  });

  describe('pseudo-selector ::find', () => {
    test.each([
      ['::find', root, [root]],
      ['::find(.btn)', root, [btn1, btn2, btn3, btn4, btn5, btn6]],
      ['::find(.container)', root, []],
      ['::find(#row1 .btn)', root, [btn1, btn2, btn3, btn4, btn5]]
    ])('Main check: ESLTraversingQuery.all/one, Sel: %s, Base: %o.', traversingQueryWrap);
  });

  describe('postprocessors (::first, ::last, ::nth)', () => {
    test.each([
      ['::find(.btn)::first', root, [btn1]],
      ['::find(.btn)::last', root, [btn6]],
      ['::find(.btn)::nth(1)', root, [btn1]],
      ['::find(.btn)::nth(4)', root, [btn4]],
      ['::find(.btn)::nth(6)', root, [btn6]],
      ['::find(.btn)::nth', root, []],
      ['::find(.btn)::nth(8)', root, []],
      ['::find(.btn)::nth(bla bla)', root, []]
    ])('Main check: ESLTraversingQuery.all/one, Sel: %s, Base: %o.', traversingQueryWrap);
  });

  describe('filters (::filter, ::not, ::visible)', () => {
    test.each([
      ['::find(.btn)::filter(.un-existing)', root, []],
      ['::find(.btn)::not(button)', root, []],
      ['::find(.btn)::filter([data-test])', root, [btn2, btn5, btn6]],
      ['::find(.btn)::not([data-test])', root, [btn1, btn3, btn4]],
      ['::find(.btn)::filter(:first-child)', root, [btn1]],
      ['::find(.btn)::visible', root, []],
      ['::find(.btn)::not(:first-child)', root, [btn2, btn3, btn4, btn5, btn6]]
    ])('Main check: ESLTraversingQuery.all/one, Sel: %s, Base: %o.', traversingQueryWrap);
  });

  describe('queries using several pseudo-selectors and plain selectors', () => {
    test.each([
      ['::parent::child', root, [root]],
      ['::parent::find(.btn)', btn5, [btn1, btn2, btn3, btn4, btn5]],
      ['::parent::next::find(.col-2)', article1, [article2]],
      ['::parent(.container)::find(.btn)::last', btn5, [btn6]],
      ['::parent(.container)::child(.row)::last::find(.col-2)', article1, [article2]],
      ['::closest(.row)::find(.col-1)', btn1, [article1]]
    ])('Main check: ESLTraversingQuery.all/one, Sel: %s, Base: %o.', traversingQueryWrap);
  });

  describe('test cases when scope is defined', () => {
    test.each([
      ['#row1', null, root, [row1]],
      ['#row1', null, row2, []]
    ])('Main check: ESLTraversingQuery.all/one, Sel: %s, Base: %o., Scope: %o.', (sel, base, scope, expectedCollection) => {
      expect(ESLTraversingQuery.first(sel, base as Element | null, scope as Element))
        .toBe(expectedCollection.length > 0 ? expectedCollection[0] : null);
      expect(ESLTraversingQuery.all(sel, base as Element | null, scope as Element))
        .toEqual(expectedCollection);
    });
  });

  describe('ESLTraversingQuery should support multiple queries separated by comma', () => {
    test.each([
      ['::parent,::next', btn1, [row1, btn2]],
      ['::next,  ::parent', btn1, [btn2, row1]],
      ['::parent  ,::next', btn2, [row1, btn3]],
      ['::find(button, article)::filter(:first-child)', row1, [btn1]],
      ['head::next, body', document.body, [document.body]],
      ['body, head', document.body, [document.body, document.head]]
    ])('ESLTraversingQuery.all/one, Sel: %s, Base: %o.', traversingQueryWrap);
  });

  describe('ESLTraversingQuery.splitQueries split string with query syntax in mind', () => {
    test.each([
      ['', ['']],
      ['(,)', ['(,)']],
      ['((,)', ['((,)']],
      ['()),(,)', ['())', '(,)']],
      ['))(),((),)', ['))()', '((),)']],
      ['a,b', ['a', 'b']],
      ['a, b', ['a', 'b']],
      ['a,b ,c ', ['a', 'b', 'c']],
      ['a,(b),c', ['a', '(b)', 'c']],
      ['a,(b, b),c', ['a', '(b, b)', 'c']],
      ['(a,b),c', ['(a,b)', 'c']],
    ])('%s -> %o', (inp: string, out: string[]) =>
    {
      expect(ESLTraversingQuery.splitQueries(inp)).toEqual(out);
    });
  });
});
