import {ESLShareButton} from '../core/esl-share-button';
import {ESLShareCopyAction} from '../actions/copy-action';
import '../buttons/copy';
import {facebook} from '../buttons/facebook';

describe('ESLShareButton tests', () => {
  beforeAll(() => ESLShareButton.register());

  describe('Static class methods', () => {
    test('has create() method that returns new instanse', () => {
      const $button = ESLShareButton.create();
      expect($button).toBeInstanceOf(ESLShareButton);
    });

    test('created instance has a name attribute in case when invoked with a passed button name', () => {
      const $button = ESLShareButton.create('copy');
      expect($button.getAttribute('name')).toBe('copy');
    });

    test('created instance has a default-icon attribute in case when invoked with a passed button name', () => {
      const $button = ESLShareButton.create('copy');
      expect($button.getAttribute('default-icon')).toBe('');
    });
  });

  describe('Instance public API', () => {
    const $copyButton = ESLShareButton.create('copy');
    const $facebookButton = ESLShareButton.create('facebook');
    $facebookButton.setAttribute('share-title', 'Test button title');
    $facebookButton.setAttribute('share-url', '/test/button/url');

    beforeAll(() => {
      document.body.appendChild($copyButton);
      document.body.appendChild($facebookButton);
    });

    afterAll(() => {
      document.body.innerHTML = '';
    });

    test('config getter available', () => {
      expect($facebookButton.config).toEqual(facebook);
    });

    test('shareAction getter available', () => {
      expect($copyButton.shareAction).toBe('copy');
    });

    test('shareAdditional getter available', () => {
      expect($copyButton.shareAdditional).toEqual({copyAlertMsg: 'Copied to clipboard'});
    });
    test('shareLink getter available', () => {
      expect($facebookButton.shareLink).toBe('//www.facebook.com/sharer.php?u={u}');
    });

    test('titleToShare getter available', () => {
      expect($facebookButton.titleToShare).toBe('Test button title');
    });

    test('urlToShare getter available and always returns absolute URL', () => {
      expect($facebookButton.urlToShare).toBe('http://localhost/test/button/url');
    });

    test('share() method calls share() method of button share action instance', () => {
      const shareSpy = jest.spyOn(ESLShareCopyAction.prototype, 'share');
      $copyButton.share();
      expect(shareSpy).toHaveBeenCalled();
      shareSpy.mockRestore();
    });
  });

  describe('share-title and share-url attributes cascading', () => {
    const $lvl: HTMLElement[] = [];
    let $button: ESLShareButton;

    const setShareAttributes = ($element: HTMLElement, title?: string, url?: string): void => {
      title && $element.setAttribute('share-title', title);
      url && $element.setAttribute('share-url', url);
    };

    const clearShareAttributes = ($element: HTMLElement): void => {
      ['share-title', 'share-url'].forEach((attr) => $element.removeAttribute(attr));
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
      $button = ESLShareButton.create('copy');
      $lvl[3].appendChild($button);
    });

    afterEach(() => {
      $lvl.forEach(clearShareAttributes);
      clearShareAttributes($button);
    });

    afterAll(() => {
      document.body.innerHTML = '';
    });

    test('should use document.title as fallback value when not defined on button and its parents', () => {
      expect($button.titleToShare).toBe(document.title);
    });

    test('should use window.location.href as fallback value when not defined on button and its parents', () => {
      expect($button.urlToShare).toBe(window.location.href);
    });

    test('should use values from button when they are defined and ignore values from its parents', () => {
      setShareAttributes($lvl[1], 'Title from level-1', 'https://host.com/level-1');
      setShareAttributes($lvl[3], 'Title from level-3', 'https://host.com/level-3');
      setShareAttributes($button, 'Title from button', 'https://host.com/button');
      expect($button.titleToShare).toBe('Title from button');
      expect($button.urlToShare).toBe('https://host.com/button');
    });

    test('should use values from closest parent when not defined on button but defined on its parents', () => {
      setShareAttributes($lvl[1], 'Title from level-1', 'https://host.com/level-1');
      setShareAttributes($lvl[2], 'Title from level-2', undefined);
      setShareAttributes($lvl[3], undefined, 'https://host.com/level-3');
      expect($button.titleToShare).toBe('Title from level-2');
      expect($button.urlToShare).toBe('https://host.com/level-3');
    });
  });
});
