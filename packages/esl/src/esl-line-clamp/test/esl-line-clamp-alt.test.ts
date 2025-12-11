import {ESLLineClampAlt} from '../core/esl-line-clamp-alt';
import {ESLScreenBreakpoints} from '../../esl-media-query/core/common/screen-breakpoint';
import {getMatchMediaMock} from '../../esl-utils/test/matchMedia.mock';
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
  });

  test('Simple attribute value reflected in the CSS props', async () => {
    $host.setAttribute(ESLLineClampAlt.is, '3');
    await microtaskQueue();
    expect(getComputedStyle($host).getPropertyValue('--esl-line-clamp-alt')).toBe('3');
  });

  test('should handle media queries', async () => {
    SMMediaMock.matches = true;
    XLMediaMock.matches = false;

    $host.setAttribute(ESLLineClampAlt.is, '@SM => 5 | @XL => 7');
    await microtaskQueue();
    expect(getComputedStyle($host).getPropertyValue('--esl-line-clamp-alt')).toBe('5');

    SMMediaMock.matches = false;
    XLMediaMock.matches = true;

    // Desn't work because onQueryChange callback is still subscribed to previous Mediarulelist `esl-line-clamp-alt="3"`
    await microtaskQueue();
    expect(getComputedStyle($host).getPropertyValue('--esl-line-clamp-alt')).toBe('7');

    SMMediaMock.matches = false;
    XLMediaMock.matches = false;
  });

  test('should handle media queries with mask', async () => {
    SMMediaMock.matches = true;
    XLMediaMock.matches = false;

    $host.setAttribute(ESLLineClampAlt.is, '5 | 7');
    $host.setAttribute(`${ESLLineClamp.is}-mask`, '@SM | @XL');
    await microtaskQueue();

    expect(getComputedStyle($host).getPropertyValue('--esl-line-clamp-alt')).toBe('5');

    // Desn't work because onQueryChange callback is still subscribed to previous Mediarulelist `esl-line-clamp-alt="3"`
    SMMediaMock.matches = false;
    XLMediaMock.matches = true;

    await microtaskQueue();
    expect(getComputedStyle($host).getPropertyValue('--esl-line-clamp-alt')).toBe('7');
  });
});
