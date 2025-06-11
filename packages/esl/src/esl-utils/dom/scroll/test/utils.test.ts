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
    expect(hasVerticalScroll()).toBe(true);
  });

  test('should be vertical scroll on target element', () => {
    const target = document.createElement('div');
    mockElHeight(target);
    expect(hasVerticalScroll(target)).toBe(true);
  });
});

describe('Function hasHorizontalScroll', () => {
  test('should be horizontal scroll on default element', () => {
    mockElWidth($html);
    expect(hasHorizontalScroll()).toBe(true);
  });

  test('should be horizontal scroll on target element', () => {
    const target = document.createElement('div');
    mockElWidth(target);
    expect(hasHorizontalScroll(target)).toBe(true);
  });
});

describe('Function isScrollLocked', () => {
  const target = document.createElement('div');
  target.style.overflow = 'auto';
  describe('Locked Scroll', () => {
    beforeAll(() => lockScroll(target));
    test('lock attribute should be set', () => expect(target.hasAttribute('esl-scroll-lock')).toBe(true));
    test('target should be locked', () => expect(isScrollLocked(target)).toBe(true));
  });

  describe('Unlocked Scroll', () => {
    beforeAll(() => unlockScroll(target));
    test('lock attribute should be removed', () => expect(target.hasAttribute('esl-scroll-lock')).toBe(false));
    test('target should be locked', () => expect(isScrollLocked(target)).toBe(false));
  });
});

describe('Function lockScroll', () => {
  const target = document.createElement('div');
  $body.style.overflow = 'auto';
  $html.style.overflow = 'auto';

  test('target`s parent should be locked', () => {
    lockScroll(target);
    expect(isScrollLocked($body)).toBe(true);
  });

  test('target should be locked', () => {
    target.style.overflow = 'auto';
    lockScroll(target);
    expect(isScrollLocked(target)).toBe(true);
  });

  test('default element should be locked', () => {
    lockScroll();
    expect(isScrollLocked($html)).toBe(true);
  });

  describe('Scroll lock with recursive option', () => {
    unlockScroll(target);
    unlockScroll($body);
    jest.spyOn(target, 'parentElement', 'get').mockImplementation(() => $body);

    lockScroll(target, {recursive: true});
    test('target should be locked', () => expect(isScrollLocked(target)).toBe(true));
    test('target`s parent should be locked', () => expect(isScrollLocked($body)).toBe(true));
  });

  describe('Lock with initiator', () => {
    describe('Lock with initiator should be successful', () => {
      test('target should be unlocked initially', () => {
        unlockScroll(target);
        expect(isScrollLocked(target)).toBe(false);
      });

      test('target should be locked', () => {
        lockScroll(target, {initiator: 'init'});
        expect(isScrollLocked(target)).toBe(true);
      });
    });

    describe('Lock with duplicate initiator', () => {
      test('target should be locked initially', () => expect(isScrollLocked(target)).toBe(true));

      test('target should be locked', () => {
        lockScroll(target, {initiator: 'init'});
        expect(isScrollLocked(target)).toBe(true);});
    });

    describe('Lock with initiator recursively', () => {
      beforeAll(() => {
        unlockScroll(target, {initiator: 'init'});
        jest.spyOn(target, 'parentElement', 'get').mockImplementation(() => $body);
        lockScroll(target, {initiator: 'init', recursive: true});
      });

      test('target should be locked', () => expect(isScrollLocked(target)).toBe(true));
      test('target`s parent should be locked', () => expect(isScrollLocked($body)).toBe(true));
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

    test('should be locked with pseudo strategy', () => {
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
      expect(isScrollLocked(target)).toBe(true);
    });

    test('target should be unlocked', () => {
      unlockScroll(target);
      expect(isScrollLocked(target)).toBe(false);
    });
  });

  describe('Unlock scroll on target element`s parent', () => {
    const first = document.createElement('div');
    test('parent should be initially locked', () => {
      lockScroll($body);
      expect(isScrollLocked($body)).toBe(true);
    });

    test('target should be unlocked', () => {
      unlockScroll(first);
      expect(isScrollLocked($body)).toBe(false);
    });
  });

  describe('Unlock scroll on default element', () => {
    test('default element should be initially locked', () => {
      lockScroll();
      expect(isScrollLocked($html)).toBe(true);
    });

    test('default element should be unlocked', () => {
      unlockScroll();
      expect(isScrollLocked($html)).toBe(false);
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

    test('target element should be unlocked', () => expect(isScrollLocked(target)).toBe(false));
    test('target`s parent element should be unlocked', () => expect(isScrollLocked($body)).toBe(false));
    test('default element should be unlocked', () => expect(isScrollLocked($html)).toBe(false));
  });

  describe('Unlock scroll with initiator', () => {
    const target = document.createElement('div');
    target.style.overflow = 'auto';

    test('target element should unlock with initiator', () => {
      lockScroll(target, {initiator: 'init'});

      unlockScroll(target, {initiator: 'init'});
      expect(isScrollLocked(target)).toBe(false);
    });

    test('target element shouldn`t unlock with wrong initiator', () => {
      lockScroll(target, {initiator: 'init'});

      unlockScroll(target, {initiator: 'init2'});
      expect(isScrollLocked(target)).toBe(true);
    });
  });

  describe('LockScroll handles concurrency on the single target correct, when multiple initiators are in acton', () => {
    const target = document.createElement('div');
    const first = document.createElement('div');
    const second = document.createElement('div');
    target.style.overflow = 'auto';

    test('target should initially be unlocked', () => expect(isScrollLocked(target)).toBe(false));

    test('first initiator should lock the target', () => {
      lockScroll(target, {initiator: first});
      expect(isScrollLocked(target)).toBe(true);
    });

    test('second initiator should lock the target', () => {
      lockScroll(target, {initiator: second});
      expect(isScrollLocked(target)).toBe(true);
    });

    test('first initiator should attempt to unlock the target, but the target still locked by the second one', () => {
      unlockScroll(target, {initiator: first});
      expect(isScrollLocked(target)).toBe(true);});

    test('second initiator should completely unlock the target', () => {
      unlockScroll(target, {initiator: second});
      expect(isScrollLocked(target)).toBe(false);});
  });
});
