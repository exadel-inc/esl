import {ESLToggleable} from '../core/esl-toggleable';

describe('ESLToggleable: close-on trigger handler', () => {
  const $template = document.createElement('template');
  $template.innerHTML = `
    <esl-toggleable class='toggleable-close-on-test' close-on='.trigger-close' defaultParams='{delay: -1}'>
      <button type='button' class='trigger trigger-close'><span>Close<span></button>
      <button type='button' class='trigger trigger-additional'><span>Trigger<span></button>
    </esl-toggleable>
    <button type='button' class='trigger-close trigger-outside toggleable-close-on-test'>
      <span>Close<span>
    </button>
  `;
  const elements = {
    get $el() {
      return document.querySelector('esl-toggleable.toggleable-close-on-test') as ESLToggleable;
    },
    get $trigger() {
      return document.querySelector('.trigger-close') as HTMLElement;
    },
    get $triggerOutside() {
      return document.querySelector('.trigger-outside') as HTMLElement;
    },
    get $triggerAdditional() {
      return document.querySelector('.trigger-additional') as HTMLElement;
    }
  };

  beforeAll(() => ESLToggleable.register());
  beforeEach(() => document.body.appendChild($template.content.cloneNode(true)));
  afterEach(() => [...document.querySelectorAll('.toggleable-close-on-test')].forEach(($el) => $el.remove()));

  test('Close-on trigger click leads to toggleable hide', () => {
    const {$el, $trigger} = elements;

    $el.show();
    expect($el.open).toBe(true);

    $trigger.click();
    expect($el.open).toBe(false);
  });

  test('Click on inner trigger content leads to toggleable hide', () => {
    const {$el, $trigger} = elements;

    $el.show();
    expect($el.open).toBe(true);

    $trigger.querySelector('span')?.click();
    expect($el.open).toBe(false);
  });

  test('Close-on trigger click outside toggleable does not leads to toggleable hide', () => {
    const {$el, $triggerOutside} = elements;

    $el.show();
    expect($el.open).toBe(true);

    $triggerOutside.click();
    expect($el.open).toBe(true);
  });

  test('Close-on trigger click on additional trigger does not leads to toggleable hide', () => {
    const {$el, $triggerAdditional} = elements;

    $el.show();
    expect($el.open).toBe(true);

    $triggerAdditional.click();
    expect($el.open).toBe(true);
  });

  test('Dynamic change of close-on attribute processed correctly', () => {
    const {$el, $triggerAdditional} = elements;

    $el.show();
    $el.setAttribute('close-on', '.trigger');

    $triggerAdditional.click();
    expect($el.open).toBe(false);
  });

  test('ESLToggleableActionParams contains correct activator details', () => {
    const {$el, $trigger} = elements;

    const $fn = jest.fn((e) => console.log(e));

    $el.show();
    $el.addEventListener('esl:hide', $fn);
    $trigger.querySelector('span')?.click();

    expect($fn).toHaveBeenLastCalledWith(expect.objectContaining({
      type: 'esl:hide',
      detail: expect.objectContaining({
        params: expect.objectContaining({
          initiator: 'close',
          activator: $trigger
        })
      })
    }));
  });
});
