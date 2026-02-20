import {ESLToggleable} from '../core';

describe('ESLToggleable custom element - class functionality', () => {
  const $container = document.createElement('div');

  const $el = ESLToggleable.create();
  $el.containerActiveClass = 'test-cls';
  $el.bodyClass = 'test-body-cls';

  $container.appendChild($el);
  document.body.appendChild($container);

  beforeAll(() => {
    jest.useFakeTimers();
    ESLToggleable.register();
  });

  afterEach(() => {
    $el.hide();
    jest.resetAllMocks();
  });

  test('container active class', () => {
    expect($container.className).toBe('');

    $el.show();
    jest.advanceTimersByTime(1);
    expect($container.className).toBe($el.containerActiveClass);

    $el.hide();
    jest.advanceTimersByTime(1);
    expect($container.className).toBe('');
  });

  test('active class', ()=> {
    expect($el.className).not.toContain($el.activeClass);

    $el.show();
    jest.advanceTimersByTime(1);
    expect($el.className).toContain($el.activeClass);
  });

  test('body class', ()=> {
    expect(document.body.className).not.toContain($el.bodyClass);

    $el.show();
    jest.advanceTimersByTime(1);
    expect(document.body.className).toContain($el.bodyClass);
  });
});
