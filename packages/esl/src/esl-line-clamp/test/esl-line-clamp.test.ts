import {ESLLineClamp} from '../core/esl-line-clamp';
import {ESLScreenBreakpoints} from '../../esl-media-query/core/common/screen-breakpoint';
import {getMatchMediaMock} from '../../test/matchMedia.mock';

describe('ESLLineClamp (mixin): tests', () => {
  const microtaskQueue = () => Promise.resolve().then(() => Promise.resolve());
  let $host: HTMLElement;
  let lineClamp: ESLLineClamp | null;

  const XLMediaMock = getMatchMediaMock(ESLScreenBreakpoints.get('xl')!.mediaQuery);
  const SMMediaMock = getMatchMediaMock(ESLScreenBreakpoints.get('sm')!.mediaQuery);

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
    SMMediaMock.matches = false;
    XLMediaMock.matches = false;
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

  test('should match and reapply media queries', async () => {
    $host.setAttribute(ESLLineClamp.is, '@SM => 5 | @XL => 7');
    SMMediaMock.matches = true;
    XLMediaMock.matches = false;
    await microtaskQueue();
    expect($host.style.getPropertyValue('--esl-line-clamp')).toBe('5');

    SMMediaMock.matches = false;
    XLMediaMock.matches = true;
    await microtaskQueue();
    expect($host.style.getPropertyValue('--esl-line-clamp')).toBe('7');
  });

  test('should match and reapply tuple media query', async () => {
    $host.setAttribute(`${ESLLineClamp.is}-mask`, '@SM | @XL');
    $host.setAttribute(ESLLineClamp.is, '5 | 7');
    SMMediaMock.matches = true;
    XLMediaMock.matches = false;
    await microtaskQueue();
    expect($host.style.getPropertyValue('--esl-line-clamp')).toBe('5');

    SMMediaMock.matches = false;
    XLMediaMock.matches = true;
    await microtaskQueue();
    expect($host.style.getPropertyValue('--esl-line-clamp')).toBe('7');
  });

  describe('auto mode of clamping', () => {
    test('should set CSS custom property based on the maximum height', async () => {
      const getComputedStyleSpy = vi.spyOn(window, 'getComputedStyle');
      getComputedStyleSpy.mockImplementation(() => ({lineHeight: '10px', maxHeight: '95px'} as CSSStyleDeclaration));
      $host.setAttribute(ESLLineClamp.is, 'auto');
      await microtaskQueue();
      expect($host.style.getPropertyValue('--esl-line-clamp')).toBe('9');
      getComputedStyleSpy.mockRestore();
    });

    test('should set CSS custom property with rounded fractional values', async () => {
      const getComputedStyleSpy = vi.spyOn(window, 'getComputedStyle');
      getComputedStyleSpy.mockImplementation(() => ({lineHeight: '10.01px', maxHeight: '20px'} as CSSStyleDeclaration));
      $host.setAttribute(ESLLineClamp.is, 'auto');
      await microtaskQueue();
      expect($host.style.getPropertyValue('--esl-line-clamp')).toBe('2');
      getComputedStyleSpy.mockRestore();
    });

    test('should remove CSS custom property when the max-height is not defined', async () => {
      const getComputedStyleSpy = vi.spyOn(window, 'getComputedStyle');
      getComputedStyleSpy.mockImplementation(() => ({lineHeight: '20px', maxHeight: 'none'} as CSSStyleDeclaration));
      $host.setAttribute(ESLLineClamp.is, 'auto');
      await microtaskQueue();
      expect($host.style.getPropertyValue('--esl-line-clamp')).toBe('');
      getComputedStyleSpy.mockRestore();
    });

    test('should remove CSS custom property when calculated value < 1', async () => {
      const getComputedStyleSpy = vi.spyOn(window, 'getComputedStyle');
      getComputedStyleSpy.mockImplementation(() => ({lineHeight: '20px', maxHeight: '19px'} as CSSStyleDeclaration));
      $host.setAttribute(ESLLineClamp.is, 'auto');
      await microtaskQueue();
      expect($host.style.getPropertyValue('--esl-line-clamp')).toBe('');
      getComputedStyleSpy.mockRestore();
    });
  });

  describe('clamped attribute (onResize)', () => {
    let getComputedStyleSpy: any;

    const setupMocks = (
      scrollHeight: number,
      clientHeight: number,
      scrollWidth: number,
      clientWidth: number,
      style: {lineHeight?: string; fontSize?: string} = {}
    ) => {
      const {lineHeight = 'normal', fontSize = '10px'} = style;
      lineClamp = ESLLineClamp.get($host);
      getComputedStyleSpy = vi.spyOn(window, 'getComputedStyle');
      getComputedStyleSpy.mockImplementation(() => ({lineHeight, fontSize} as CSSStyleDeclaration));
      Object.defineProperty($host, 'scrollHeight', {value: scrollHeight, configurable: true});
      Object.defineProperty($host, 'clientHeight', {value: clientHeight, configurable: true});
      Object.defineProperty($host, 'scrollWidth', {value: scrollWidth, configurable: true});
      Object.defineProperty($host, 'clientWidth', {value: clientWidth, configurable: true});
    };

    afterEach(() => {
      getComputedStyleSpy?.mockRestore();
    });

    test('should clamp on horizontal overflow', () => {
      setupMocks(100, 100, 150, 100);
      lineClamp!['onResize']();
      expect(lineClamp!.clamped).toBe(true);
      expect($host.getAttribute('clamped')).toBe('');
    });

    test('should not clamp for small line-height (~1.1em at 14px) when overflow is below tolerance', () => {
      // font-size 14px, line-height ~1.1em => ~15.4px; tolerance = 15.4 * 0.5 = 7.7px
      setupMocks(107, 100, 100, 100, {lineHeight: '15.4px', fontSize: '14px'});
      lineClamp!['onResize']();
      expect(lineClamp!.clamped).toBe(false);
      expect($host.getAttribute('clamped')).toBeNull();
    });

    test('should clamp for small line-height (~1.1em at 14px) when overflow is above tolerance', () => {
      // Same setup, but 8px overflow (> 7.7) should be clamped
      setupMocks(108, 100, 100, 100, {lineHeight: '15.4px', fontSize: '14px'});
      lineClamp!['onResize']();
      expect(lineClamp!.clamped).toBe(true);
      expect($host.getAttribute('clamped')).toBe('');
    });
  });
});
