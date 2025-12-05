import {ESLLineClampAlt} from '../core/esl-line-clamp-alt';

describe('ESLLineClampAlt (mixin): tests', () => {
  const microtaskQueue = () => Promise.resolve().then(() => Promise.resolve());
  let $host: HTMLElement;

  beforeAll(() => {
    ESLLineClampAlt.register();
  });

  beforeEach(() => {
    $host = document.createElement('div');
    $host.setAttribute(ESLLineClampAlt.is, '');
    document.body.appendChild($host);
  });

  afterEach(() => {
    document.body.removeChild($host);
  });

  test('Simple attribute value reflected in the CSS props', async () => {
    $host.setAttribute(ESLLineClampAlt.is, '3');
    await microtaskQueue();
    expect(getComputedStyle($host).getPropertyValue('--esl-line-clamp-alt')).toBe('3');
  });

  test('Media query attribute value reflected in the CSS props', async () => {
    $host.setAttribute(ESLLineClampAlt.is, '@XS => 4 | 5 | @XL => 7');
    await microtaskQueue();
    expect(getComputedStyle($host).getPropertyValue('--esl-line-clamp-alt')).toBe('5');
  });
});
