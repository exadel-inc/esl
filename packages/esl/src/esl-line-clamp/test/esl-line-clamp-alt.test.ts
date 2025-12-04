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

  test('should initialize correctly', () => {
    const lineClamp = ESLLineClampAlt.get($host);
    expect(lineClamp).toEqual(expect.any(ESLLineClampAlt));
  });

  test('should set CSS custom property', async () => {
    $host.setAttribute(ESLLineClampAlt.is, '3');
    await microtaskQueue();
    expect($host.style.getPropertyValue('--esl-line-clamp-alt')).toBe('3');
  });

  test('should handle media queries', async () => {
    $host.setAttribute(ESLLineClampAlt.is, '@XS => 4 | 5 | @XL => 7');
    await microtaskQueue();
    expect($host.style.getPropertyValue('--esl-line-clamp-alt')).toBe('5');
  });
});
