import {ESLLineClampAlt} from '../core/esl-line-clamp-alt';
import {ESLLineClampToggler} from '../core/esl-line-clamp-toggler';

describe('ESLLineClampAlt (mixin): tests', () => {
  const microtaskQueue = () => Promise.resolve().then(() => Promise.resolve());
  let $host: HTMLElement;

  beforeAll(() => {
    ESLLineClampToggler.register();
    ESLLineClampAlt.register();
  });

  function appendToggler(attrs: {target?: string, a11yTarget?: string, active?: boolean}): HTMLElement {
    const $toggler = document.createElement('button');
    $toggler.setAttribute(ESLLineClampToggler.is, attrs.target || '');
    $toggler.setAttribute('a11y-target', attrs.a11yTarget || '');
    if (attrs.active) $toggler.setAttribute(ESLLineClampToggler.activeAttr, '');
    document.body.appendChild($toggler);
    return $toggler;
  }

  beforeEach(async () => {
    $host = document.createElement('div');
    $host.setAttribute(ESLLineClampAlt.is, '3');

    document.body.appendChild($host);
  });

  afterEach(() => {
    document.body.removeChild($host);
    document.body.querySelectorAll(`[${ESLLineClampToggler.is}]`).forEach((btn) => btn.remove());
  });

  test('should initialize with correct default values', async () => {
    const toggler = appendToggler({});
    await microtaskQueue();

    const $mixin = ESLLineClampToggler.get(toggler);
    expect($mixin).toEqual(expect.any(ESLLineClampToggler));
    expect($mixin!.$targetEl).toBeUndefined();
    expect(toggler.hasAttribute(ESLLineClampToggler.activeAttr)).toBe(false);
  });

  test('shouldn\'t have active marker without target', async () => {
    const toggler = appendToggler({active: true});
    await microtaskQueue();

    const $mixin = ESLLineClampToggler.get(toggler);
    expect($mixin!.$targetEl).toBeUndefined();
    expect(toggler.hasAttribute(ESLLineClampToggler.activeAttr)).toBe(false);
  });

  test('base attribute should query target', async () => {
    const toggler = appendToggler({target: '::parent::child[esl-line-clamp-alt]'});
    await microtaskQueue();

    const $mixin = ESLLineClampToggler.get(toggler);
    expect($mixin!.$targetEl).toBe($host);
  });

  test('toggler should become active if target is active', async () => {
    const toggler = appendToggler({target: '::parent::child[esl-line-clamp-alt]'});
    $host.setAttribute(ESLLineClampAlt.activeAttr, '');
    await microtaskQueue();

    expect(toggler.hasAttribute(ESLLineClampToggler.activeAttr)).toBe(true);
  });

  test('target should become active if toggler is active', async () => {
    appendToggler({target: '::parent::child[esl-line-clamp-alt]', active: true});
    await microtaskQueue();

    expect($host.hasAttribute(ESLLineClampAlt.activeAttr)).toBe(true);
  });

  test('should handle basic click toggling', async () => {
    const toggler = appendToggler({target: '::parent::child[esl-line-clamp-alt]'});
    await microtaskQueue();

    expect($host.hasAttribute(ESLLineClampAlt.activeAttr)).toBe(false);
    expect(toggler.hasAttribute(ESLLineClampToggler.activeAttr)).toBe(false);

    toggler.click();
    await microtaskQueue();

    expect($host.hasAttribute(ESLLineClampAlt.activeAttr)).toBe(true);
    expect(toggler.hasAttribute(ESLLineClampToggler.activeAttr)).toBe(true);

    toggler.click();
    await microtaskQueue();

    expect($host.hasAttribute(ESLLineClampAlt.activeAttr)).toBe(false);
    expect(toggler.hasAttribute(ESLLineClampToggler.activeAttr)).toBe(false);
  });


  test('multiple togglers should work with one target', async () => {
    const toggler1 = appendToggler({target: '::parent::child[esl-line-clamp-alt]'});
    const toggler2 = appendToggler({target: '::parent::child[esl-line-clamp-alt]'});
    await microtaskQueue();

    expect(toggler1.hasAttribute(ESLLineClampToggler.activeAttr)).toBe(false);
    expect(toggler2.hasAttribute(ESLLineClampToggler.activeAttr)).toBe(false);

    toggler1.click();
    await microtaskQueue();

    expect(toggler1.hasAttribute(ESLLineClampToggler.activeAttr)).toBe(true);
    expect(toggler2.hasAttribute(ESLLineClampToggler.activeAttr)).toBe(true);

    toggler2.click();
    await microtaskQueue();

    expect(toggler1.hasAttribute(ESLLineClampToggler.activeAttr)).toBe(false);
    expect(toggler2.hasAttribute(ESLLineClampToggler.activeAttr)).toBe(false);
  });

  test('a11y target should receive focus on toggler click', async () => {
    const toggler = appendToggler({
      target: '::parent::child[esl-line-clamp-alt]',
      a11yTarget: '::parent::child[id="test-a11y-target"]'
    });
    const $a11yTarget = document.createElement('button');
    $a11yTarget.setAttribute('id', 'test-a11y-target');
    document.body.appendChild($a11yTarget);

    console.log(document.body.innerHTML);
    await microtaskQueue();

    const focusSpy = jest.spyOn($a11yTarget, 'focus');

    toggler.click();
    await microtaskQueue();

    expect(focusSpy).toHaveBeenCalled();

    document.body.removeChild($a11yTarget);
  });
});
