import {ESLToggleable} from '../core/esl-toggleable';

describe('ESLToggleable: focus target', () => {
  const makeVisible = ($el: HTMLElement): void => {
    vi.spyOn($el, 'getClientRects').mockReturnValue([{}] as unknown as DOMRectList);
  };

  beforeAll(() => ESLToggleable.register());

  test('prioritizes the first keyboard-focusable autofocus target', () => {
    const $el = ESLToggleable.create();
    $el.innerHTML = '<button></button><input autofocus><button data-autofocus></button>';
    const [$first, $autofocus, $dataAutofocus] = Array.from($el.children) as HTMLElement[];
    [$first, $autofocus, $dataAutofocus].forEach(makeVisible);

    expect($el.$focusable).toBe($autofocus);
  });

  test('ignores autofocus markers on unavailable elements', () => {
    const $el = ESLToggleable.create();
    $el.innerHTML = '<button autofocus disabled></button><div inert><button data-autofocus></button></div><button></button>';
    const [$disabled, $inert, $fallback] = Array.from($el.querySelectorAll('button')) as HTMLElement[];
    [$disabled, $inert, $fallback].forEach(makeVisible);

    expect($el.$focusable).toBe($fallback);
  });

  test('falls back to the Toggleable when it has no keyboard-focusable descendants', () => {
    const $el = ESLToggleable.create();

    expect($el.$focusable).toBe($el);
  });
});

