import {hasHorizontalScroll, hasVerticalScroll, isScrollLocked, lockScroll, unlockScroll} from '../utils';

const $html = document.documentElement;
const $body = document.body;

afterEach(() => jest.clearAllMocks());

const mockElHeight = (el: Element) => {
  jest.spyOn(el, 'scrollHeight', 'get').mockImplementation(() => 100);
  jest.spyOn(el, 'clientHeight', 'get').mockImplementation(() => 99);
};

const mockElWidth = (el: Element) => {
  jest.spyOn(el, 'scrollWidth', 'get').mockImplementation(() => 100);
  jest.spyOn(el, 'clientWidth', 'get').mockImplementation(() => 99);
};

describe('Function hasVerticalScroll', () => {
  test('should be vertical scroll on default element', () => {
    mockElHeight($html);
    expect(hasVerticalScroll()).toBeTruthy();
  });

  test('should be vertical scroll on target element', () => {
    const target = document.createElement('div');
    mockElHeight(target);
    expect(hasVerticalScroll(target)).toBeTruthy();
  });
});

describe('Function hasHorizontalScroll', () => {
  test('should be horizontal scroll on default element', () => {
    mockElWidth($html);
    expect(hasHorizontalScroll()).toBeTruthy();
  });

  test('should be horizontal scroll on target element', () => {
    const target = document.createElement('div');
    mockElWidth(target);
    expect(hasHorizontalScroll(target)).toBeTruthy();
  });
});

describe('Function isScrollLocked', () => {
  const target = document.createElement('div');
  target.style.overflow = 'auto';
  describe('Locked Scroll', () => {
    beforeAll(() => lockScroll(target));
    test('lock attribute should be set', () => expect(target.hasAttribute('esl-scroll-lock')).toBeTruthy());
    test('target should be locked', () => expect(isScrollLocked(target)).toBeTruthy());
  });

  describe('Unlocked Scroll', () => {
    beforeAll(() => unlockScroll(target));
    test('lock attribute should be removed', () => expect(target.hasAttribute('esl-scroll-lock')).toBeFalsy());
    test('target should be locked', () => expect(isScrollLocked(target)).toBeFalsy());
  });
});

describe('Function lockScroll', () => {
  const target = document.createElement('div');
  $body.style.overflow = 'auto';
  $html.style.overflow = 'auto';

  test('target`s parent should be locked', () => {
    lockScroll(target);
    expect(isScrollLocked($body)).toBeTruthy();
  });

  test('target should be locked', () => {
    target.style.overflow = 'auto';
    lockScroll(target);
    expect(isScrollLocked(target)).toBeTruthy();
  });

  test('default element should be locked', () => {
    lockScroll();
    expect(isScrollLocked($html)).toBeTruthy();
  });

  describe('Scroll lock with recursive option', () => {
    unlockScroll(target);
    unlockScroll($body);
    jest.spyOn(target, 'parentElement', 'get').mockImplementation(() => $body);

    lockScroll(target, {recursive: true});
    test('target should be locked', () => expect(isScrollLocked(target)).toBeTruthy());
    test('target`s parent should be locked', () => expect(isScrollLocked($body)).toBeTruthy());
  });

  describe('Lock with initiator', () => {
    describe('Lock with initiator should be successful', () => {
      beforeAll(() => {
        jest.spyOn(target, 'setAttribute');
        lockScroll(target, {initiator: 'init'});
      });

      test('setAttribute should have been called', () => expect(target.setAttribute).toHaveBeenCalled());
      test('target should be locked', () => expect(isScrollLocked(target)).toBeTruthy());
    });

    describe('Lock with duplicate initiator', () => {
      beforeAll(() => {
        jest.spyOn(target, 'setAttribute');
        lockScroll(target, {initiator: 'init'});
      });

      test('setAttribute shouldn`t have been called again', () => expect(target.setAttribute).toHaveBeenCalledTimes(0));
      test('target should be locked', () => expect(isScrollLocked(target)).toBeTruthy());
    });

    describe('Lock with initiator recursively', () => {
      beforeAll(() => {
        unlockScroll(target, {initiator: 'init'});
        jest.spyOn($body, 'setAttribute');
        jest.spyOn(target, 'parentElement', 'get').mockImplementation(() => $body);
        lockScroll(target, {initiator: 'init', recursive: true});
      });

      test('setAttribute should have been called on target`s parent', () => expect($body.setAttribute).toHaveBeenCalledTimes(1));
      test('target should be locked', () => expect(isScrollLocked(target)).toBeTruthy());
      test('target`s parent should be locked', () => expect(isScrollLocked($body)).toBeTruthy());
    });
  });

  describe('Lock scroll with strategy', () => {
    $html.style.overflow = 'auto';
    test('should be locked with strategy `none`', () => {
      lockScroll($html, {strategy: 'none'});
      expect($html.getAttribute('esl-scroll-lock')).toBe('none');
    });

    test('should be locked without strategy', () => {
      lockScroll($html);
      expect($html.getAttribute('esl-scroll-lock')).toBe('');
    });

    test('should be locked with native strategy', () => {
      lockScroll($html, {strategy: 'native'});
      expect($html.getAttribute('esl-scroll-lock')).toBe('native');
    });

    test('should be locked with native strategy', () => {
      lockScroll($html, {strategy: 'pseudo'});
      expect($html.getAttribute('esl-scroll-lock')).toBe('pseudo');
    });
  });
});

describe('Function unlockScroll', () => {
  $html.style.overflow = 'auto';
  $body.style.overflow = 'auto';

  describe('Unlock scroll on target element', () => {
    const target = document.createElement('div');
    target.style.overflow = 'auto';
    test('target should be initially locked', () => {
      lockScroll(target);
      expect(isScrollLocked(target)).toBeTruthy();
    });

    test('target should be unlocked', () => {
      unlockScroll(target);
      expect(isScrollLocked(target)).toBeFalsy();
    });
  });

  describe('Unlock scroll on target element`s parent', () => {
    const first = document.createElement('div');
    test('parent should be initially locked', () => {
      lockScroll($body);
      expect(isScrollLocked($body)).toBeTruthy();
    });

    test('target should be unlocked', () => {
      unlockScroll(first);
      expect(isScrollLocked($body)).toBeFalsy();
    });
  });

  describe('Unlock scroll on default element', () => {
    test('default element should be initially locked', () => {
      lockScroll();
      expect(isScrollLocked($html)).toBeTruthy();
    });

    test('default element should be unlocked', () => {
      unlockScroll();
      expect(isScrollLocked($html)).toBeFalsy();
    });
  });

  describe('Unlock multiple elements recursively', () => {
    const target = document.createElement('div');
    target.style.overflow = 'auto';
    lockScroll(target);
    lockScroll($body);
    lockScroll($html);
    jest.spyOn(target, 'parentElement', 'get').mockImplementation(() => $body);
    jest.spyOn($body, 'parentElement', 'get').mockImplementation(() => $html);

    unlockScroll(target, {recursive: true});

    test('target element should be unlocked', () => expect(isScrollLocked(target)).toBeFalsy());
    test('taget`s parent element should be unlocked', () => expect(isScrollLocked($body)).toBeFalsy());
    test('default element should be unlocked', () => expect(isScrollLocked($html)).toBeFalsy());
  });

  describe('Unlock scroll with initiator', () => {
    const target = document.createElement('div');
    target.style.overflow = 'auto';

    test('target element should unlock with initiator', () => {
      jest.spyOn(target, 'removeAttribute');
      lockScroll(target, {initiator: 'init'});

      unlockScroll(target, {initiator: 'init'});
      expect(target.removeAttribute).toHaveBeenCalled();
      expect(isScrollLocked(target)).toBeFalsy();
    });

    test('target element shouldn`t unlock with wrong initiator', () => {
      jest.spyOn(target, 'removeAttribute');
      lockScroll(target, {initiator: 'init'});

      unlockScroll(target, {initiator: 'init2'});
      expect(target.removeAttribute).toHaveBeenCalledTimes(0);
      expect(isScrollLocked(target)).toBeTruthy();
    });
  });

  describe('LockScroll handles concurrency on the single target correct, when multiple initiators are in acton', () => {
    const target = document.createElement('div');
    const first = document.createElement('div');
    const second = document.createElement('div');
    target.style.overflow = 'auto';

    test('target should initially be unlocked', () => expect(isScrollLocked(target)).toBeFalsy());

    test('first initiator should lock the target', () => {
      lockScroll(target, {initiator: first});
      expect(isScrollLocked(target)).toBeTruthy();
    });

    test('second initiator should lock the target', () => {
      lockScroll(target, {initiator: second});
      expect(isScrollLocked(target)).toBeTruthy();
    });

    test('first initiator should attempt to unlock the target, but the target still locked by the second one', () => {
      unlockScroll(target, {initiator: first});
      expect(isScrollLocked(target)).toBeTruthy();});

    test('second initiator should completely unlock the target', () => {
      unlockScroll(target, {initiator: second});
      expect(isScrollLocked(target)).toBeFalsy();});
  });
});
