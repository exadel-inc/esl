import {ESLLineClampAlt} from '../core/esl-line-clamp-alt';
import {ESLScreenBreakpoints} from '../../esl-media-query/core/common/screen-breakpoint';
import {getMatchMediaMock} from '../../test/matchMedia.mock';
import {ESLLineClamp} from '../core/esl-line-clamp';

describe('ESLLineClampAlt (mixin): tests', () => {
  const microtaskQueue = () => Promise.resolve().then(() => Promise.resolve());
  let $host: HTMLElement;

  const XLMediaMock = getMatchMediaMock(ESLScreenBreakpoints.get('xl')!.mediaQuery);
  const SMMediaMock = getMatchMediaMock(ESLScreenBreakpoints.get('sm')!.mediaQuery);

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
    SMMediaMock.matches = false;
    XLMediaMock.matches = false;
  });

  test('should reflect plain attribute value in CSS props', async () => {
    $host.setAttribute(ESLLineClampAlt.is, '3');
    await microtaskQueue();
    expect(getComputedStyle($host).getPropertyValue('--esl-line-clamp-alt')).toBe('3');
  });

  test('should match and reapply media queries', async () => {
    $host.setAttribute(ESLLineClampAlt.is, '@SM => 5 | @XL => 7');
    SMMediaMock.matches = true;
    XLMediaMock.matches = false;
    await microtaskQueue();
    expect(getComputedStyle($host).getPropertyValue('--esl-line-clamp-alt')).toBe('5');

    SMMediaMock.matches = false;
    XLMediaMock.matches = true;
    await microtaskQueue();
    expect(getComputedStyle($host).getPropertyValue('--esl-line-clamp-alt')).toBe('7');
  });

  test('should match and reapply tuple media query', async () => {
    $host.setAttribute(`${ESLLineClamp.is}-mask`, '@SM | @XL');
    $host.setAttribute(ESLLineClampAlt.is, '5 | 7');
    SMMediaMock.matches = true;
    XLMediaMock.matches = false;
    await microtaskQueue();
    expect(getComputedStyle($host).getPropertyValue('--esl-line-clamp-alt')).toBe('5');

    SMMediaMock.matches = false;
    XLMediaMock.matches = true;
    await microtaskQueue();
    expect(getComputedStyle($host).getPropertyValue('--esl-line-clamp-alt')).toBe('7');
  });
});
