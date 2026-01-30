import {IntersectionObserverMock} from '../../test/intersectionObserver.mock';
import {ESLSharePopup} from '../core/esl-share-popup';
import {ESLShare} from '../core/esl-share';
import '../buttons/copy';

import type {ESLShareButton} from '../core/esl-share-button';


describe('ESLSharePopup tests', () => {
  beforeAll(() => {
    vi.useFakeTimers();
    IntersectionObserverMock.mock();
    ESLShare.register();
  });

  describe('share-title and share-url attributes forwarding from activator', () => {
    const $lvl: HTMLElement[] = [];
    let $trigger: ESLShare;

    const setShareAttributes = ($element: HTMLElement, title?: string, url?: string): void => {
      title && $element.setAttribute('share-title', title);
      url && $element.setAttribute('share-url', url);
    };

    const clearShareAttributes = ($element: HTMLElement): void => {
      ['share-title', 'share-url'].forEach((attr) => $element.removeAttribute(attr));
    };

    const showPopupAndGetButton = (): ESLShareButton => {
      $trigger.showTarget();
      vi.advanceTimersByTime(500);
      return document.querySelector('esl-share-button') as ESLShareButton;
    };

    beforeAll(() => {
      document.title = 'Fallback title';
      document.body.innerHTML = `
        <div class="lvl-1">
          <div class="lvl-2">
            <div class="lvl-3">
            </div>
          </div>
        </div>
      `.trim();
      $lvl.push(document.body);
      ['.lvl-1', '.lvl-2', '.lvl-3'].forEach((selector) => $lvl.push(document.querySelector(selector) as HTMLElement));
      $trigger = ESLShare.create();
      $trigger.list = 'copy';
      $lvl[3].appendChild($trigger);
    });

    afterEach(() => {
      $lvl.forEach(clearShareAttributes);
      clearShareAttributes($trigger);
      ESLSharePopup.sharedInstance.hide();
      vi.advanceTimersByTime(500);
    });

    afterAll(() => {
      document.body.innerHTML = '';
    });

    test('should use document.title as fallback value when not defined on trigger and its parents', () => {
      const $button = showPopupAndGetButton();
      expect($button.titleToShare).toBe(document.title);
    });

    test('should use window.location.href as fallback value when not defined on trigger and its parents', () => {
      const $button = showPopupAndGetButton();
      expect($button.urlToShare).toBe(window.location.href);
    });

    test('should use values from trigger when attributes are defined and ignore values from its parents', () => {
      setShareAttributes($lvl[1], 'Title from level-1', 'https://host.com/level-1');
      setShareAttributes($lvl[3], 'Title from level-3', 'https://host.com/level-3');
      setShareAttributes($trigger, 'Title from trigger', 'https://host.com/trigger');
      const $button = showPopupAndGetButton();
      expect($button.titleToShare).toBe('Title from trigger');
      expect($button.urlToShare).toBe('https://host.com/trigger');
    });

    test('should use values from closest parent when not defined on button but defined on its parents', () => {
      setShareAttributes($lvl[1], 'Title from level-1', 'https://host.com/level-1');
      setShareAttributes($lvl[2], 'Title from level-2', undefined);
      setShareAttributes($lvl[3], undefined, 'https://host.com/level-3');
      const $button = showPopupAndGetButton();
      expect($button.titleToShare).toBe('Title from level-2');
      expect($button.urlToShare).toBe('https://host.com/level-3');
    });
  });
});
