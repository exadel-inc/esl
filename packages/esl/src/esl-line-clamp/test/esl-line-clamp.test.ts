import {ESLLineClamp} from '../core/esl-line-clamp';

describe('ESLLineClamp (mixin): tests', () => {
  const microtaskQueue = () => Promise.resolve().then(() => Promise.resolve());
  let $host: HTMLElement;
  let lineClamp: ESLLineClamp | null;

  beforeAll(() => {
    ESLLineClamp.register();
  });

  beforeEach(async () => {
    $host = document.createElement('div');
    $host.setAttribute(ESLLineClamp.is, '3');
    document.body.appendChild($host);
  });

  afterEach(() => {
    document.body.removeChild($host);
  });

  test('should initialize with correct default values', () => {
    lineClamp = ESLLineClamp.get($host);
    expect(lineClamp).toEqual(expect.any(ESLLineClamp));
    expect(lineClamp!.lines).toBe('3');
    expect(lineClamp!.clamped).toBe(false);
  });

  test('should set CSS custom property when lines value is provided', () => {
    expect($host.style.getPropertyValue('--esl-line-clamp')).toBe('3');
  });

  test('should remove CSS custom property when lines value is empty', async () => {
    $host.setAttribute(ESLLineClamp.is, '');
    await microtaskQueue();
    expect($host.style.getPropertyValue('--esl-line-clamp')).toBe('');
  });

  test('should update CSS custom property when lines attribute changes', async () => {
    $host.setAttribute(ESLLineClamp.is, 'none');
    await microtaskQueue();
    expect($host.style.getPropertyValue('--esl-line-clamp')).toBe('none');
  });

  test('should handle media queries', async () => {
    $host.setAttribute(ESLLineClamp.is, '@XS => 4 | 5 | @XL => 7');
    await microtaskQueue();
    expect($host.style.getPropertyValue('--esl-line-clamp')).toBe('5');
  });

  describe('auto mode of clamping', () => {
    test('should set CSS custom property based on the maximum height', async () => {
      const getComputedStyleSpy = jest.spyOn(window, 'getComputedStyle');
      getComputedStyleSpy.mockImplementation(() => ({lineHeight: '10px', maxHeight: '95px'} as CSSStyleDeclaration));
      $host.setAttribute(ESLLineClamp.is, 'auto');
      await microtaskQueue();
      expect($host.style.getPropertyValue('--esl-line-clamp')).toBe('9');
      getComputedStyleSpy.mockRestore();
    });

    test('should set CSS custom property with rounded fractional values', async () => {
      const getComputedStyleSpy = jest.spyOn(window, 'getComputedStyle');
      getComputedStyleSpy.mockImplementation(() => ({lineHeight: '10.01px', maxHeight: '20px'} as CSSStyleDeclaration));
      $host.setAttribute(ESLLineClamp.is, 'auto');
      await microtaskQueue();
      expect($host.style.getPropertyValue('--esl-line-clamp')).toBe('2');
      getComputedStyleSpy.mockRestore();
    });

    test('should remove CSS custom property when the max-height is not defined', async () => {
      const getComputedStyleSpy = jest.spyOn(window, 'getComputedStyle');
      getComputedStyleSpy.mockImplementation(() => ({lineHeight: '20px', maxHeight: 'none'} as CSSStyleDeclaration));
      $host.setAttribute(ESLLineClamp.is, 'auto');
      await microtaskQueue();
      expect($host.style.getPropertyValue('--esl-line-clamp')).toBe('');
      getComputedStyleSpy.mockRestore();
    });

    test('should remove CSS custom property when calculated value < 1', async () => {
      const getComputedStyleSpy = jest.spyOn(window, 'getComputedStyle');
      getComputedStyleSpy.mockImplementation(() => ({lineHeight: '20px', maxHeight: '19px'} as CSSStyleDeclaration));
      $host.setAttribute(ESLLineClamp.is, 'auto');
      await microtaskQueue();
      expect($host.style.getPropertyValue('--esl-line-clamp')).toBe('');
      getComputedStyleSpy.mockRestore();
    });
  });
});
