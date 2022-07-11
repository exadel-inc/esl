import {hasHorizontalScroll, hasVerticalScroll, isScrollLocked, lockScroll, unlockScroll} from '../utils';

const $html = document.documentElement;
const $body = document.body;

afterEach(() => jest.clearAllMocks());

describe('Function hasVerticalScroll', () => {
  test('Vertical scroll on default element', () => {
    jest.spyOn($html, 'scrollHeight', 'get').mockImplementation(() => 100);
    jest.spyOn($html, 'clientHeight', 'get').mockImplementation(() => 99);
    expect(hasVerticalScroll()).toBeTruthy();
  });

  test('Vertical scroll on element', () => {
    const element = document.createElement('div');
    jest.spyOn(element, 'scrollHeight', 'get').mockImplementation(() => 100);
    jest.spyOn(element, 'clientHeight', 'get').mockImplementation(() => 99);
    expect(hasVerticalScroll(element)).toBeTruthy();
  });
});

describe('Function hasHorizontalScroll', () => {
  test('Horizontal scroll on default element', () => {
    jest.spyOn($html, 'scrollWidth', 'get').mockImplementation(() => 100);
    jest.spyOn($html, 'clientWidth', 'get').mockImplementation(() => 99);
    expect(hasHorizontalScroll()).toBeTruthy();
  });

  test('Horizontal scroll on element', () => {
    const element = document.createElement('div');
    jest.spyOn(element, 'scrollWidth', 'get').mockImplementation(() => 100);
    jest.spyOn(element, 'clientWidth', 'get').mockImplementation(() => 99);
    expect(hasHorizontalScroll(element)).toBeTruthy();
  });
});

describe('Function isScrollLocked', () => {
  test('locked Scroll', () => {
    lockScroll($body);
    expect($body.hasAttribute('esl-scroll-lock')).toBeTruthy();
    expect(isScrollLocked($body)).toBeTruthy();
  });

  test('unlocked Scroll', () => {
    unlockScroll($body);
    expect($body.hasAttribute('esl-scroll-lock')).toBeFalsy();
    expect(isScrollLocked($body)).toBeFalsy();
  });
});

describe('Function lockScroll', () => {
  const element = document.createElement('div');

  test('lock on element`s parent', () => {
    $body.style.overflow = 'auto';
    lockScroll(element);
    expect(isScrollLocked($body)).toBeTruthy();
  });

  test('lock on element', () => {
    element.style.overflow = 'auto';
    lockScroll(element);
    expect(isScrollLocked(element)).toBeTruthy();
  });

  test('lock on default element', () => {
    $html.style.overflow = 'auto';
    lockScroll();
    expect(isScrollLocked($html)).toBeTruthy();
  });


  test('lock with recursive option', () => {
    unlockScroll(element);
    element.style.overflow = 'auto';
    jest.spyOn(element, 'parentElement', 'get').mockImplementation(() => $body);
    lockScroll(element, {recursive: true});
    expect(isScrollLocked(element)).toBeTruthy();
    expect(isScrollLocked($body)).toBeTruthy();
  });

  describe('Lock with initiator', () => {
    test('lock with initiator', () => {
      jest.spyOn(element, 'setAttribute');
      lockScroll(element, {initiator: 'init'});
      expect(element.setAttribute).toHaveBeenCalled();
      expect(isScrollLocked(element)).toBeTruthy();
    });

    test('shoudn`t be locked second time', () => {
      jest.spyOn(element, 'setAttribute');
      lockScroll(element, {initiator: 'init'});
      expect(element.setAttribute).toHaveBeenCalledTimes(0);
    });

    test('each element should have it`s own initiator', () => {
      unlockScroll(element, {initiator: 'init'});
      jest.spyOn($body, 'setAttribute');
      jest.spyOn(element, 'parentElement', 'get').mockImplementation(() => $body);
      lockScroll(element, {initiator: 'init', recursive: true});
      expect($body.setAttribute).toHaveBeenCalledTimes(1);
      expect(isScrollLocked(element)).toBeTruthy();
      expect(isScrollLocked($body)).toBeTruthy();
    });
  });

  describe('Lock scroll with strategy', () => {
    $html.style.overflow = 'auto';
    test('no strategy', () => {
      lockScroll($html, {strategy: 'none'});
      expect($html.getAttribute('esl-scroll-lock')).toBe('none');

      lockScroll($html);
      expect($html.getAttribute('esl-scroll-lock')).toBe('');
    });

    test('native strategy', () => {
      lockScroll($html, {strategy: 'native'});
      expect($html.getAttribute('esl-scroll-lock')).toBe('native');
    });

    test('native strategy', () => {
      lockScroll($html, {strategy: 'pseudo'});
      expect($html.getAttribute('esl-scroll-lock')).toBe('pseudo');
    });
  });
});

describe('Function unlockScroll', () => {
  const scrollableEl = document.createElement('div');

  $html.style.overflow = 'auto';
  $body.style.overflow = 'auto';
  scrollableEl.style.overflow = 'auto';

  test('lock on element', () => {
    $body.style.overflow = 'auto';
    lockScroll(scrollableEl);
    lockScroll($body);

    unlockScroll(scrollableEl);
    expect(isScrollLocked(scrollableEl)).toBeFalsy();
  });

  test('unlock element`s first parent', () => {
    const element = document.createElement('div');
    lockScroll($body);

    unlockScroll(element);
    expect(isScrollLocked($body)).toBeFalsy();
  });

  test('unlock default element', () => {
    unlockScroll();
    expect(isScrollLocked($html)).toBeFalsy();
  });

  test('unlock recursively', () => {
    lockScroll(scrollableEl);
    lockScroll($body);
    lockScroll($html);
    jest.spyOn(scrollableEl, 'parentElement', 'get').mockImplementation(() => $body);
    jest.spyOn($body, 'parentElement', 'get').mockImplementation(() => $html);

    unlockScroll(scrollableEl, {recursive: true});
    expect(isScrollLocked(scrollableEl)).toBeFalsy();
    expect(isScrollLocked($body)).toBeFalsy();
    expect(isScrollLocked($html)).toBeFalsy();
  });

  describe('Unlock scroll with initiator', () => {
    test('unlock with initiator', () => {
      jest.spyOn(scrollableEl, 'removeAttribute');
      lockScroll(scrollableEl, {initiator: 'init'});

      unlockScroll(scrollableEl, {initiator: 'init'});
      expect(scrollableEl.removeAttribute).toHaveBeenCalled();
      expect(isScrollLocked(scrollableEl)).toBeFalsy();
    });

    test('shouldn`t unlock with wrong initiator', () => {
      jest.spyOn(scrollableEl, 'removeAttribute');
      lockScroll(scrollableEl, {initiator: 'init'});

      unlockScroll(scrollableEl, {initiator: 'init2'});
      expect(scrollableEl.removeAttribute).toHaveBeenCalledTimes(0);
      expect(isScrollLocked(scrollableEl)).toBeTruthy();
    });
  });
});
