import '../../actions/native-action';
import {ESLShareActionRegistry} from '../../core/esl-share-action-registry';
import {ESLShareButton} from '../../core/esl-share-button';

describe('ESLShare: "native" action import', () => {
  test('"native" action was registered when importing', () => {
    expect(ESLShareActionRegistry.instance.has('native')).toBe(true);
  });
});

describe('ESLShare: "native" action public API', () => {
  const originalShare = navigator.share;
  const mockShare = jest.fn();
  const nativeAction = ESLShareActionRegistry.instance.get('native');
  const $button = ESLShareButton.create();

  beforeAll(() => {
    (navigator as any).share = mockShare;

    ESLShareButton.register();
    document.body.appendChild($button);
    $button.setAttribute('share-title', 'Test button title');
    $button.setAttribute('share-url', '/test/button/url');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    document.body.innerHTML = '';
    (navigator as any).share = originalShare;
  });

  test('should be available', () => {
    expect(nativeAction?.isAvailable).toBe(true);
  });

  test('should call navigator.share() when share() calls', () => {
    nativeAction?.share($button);
    expect(mockShare).toHaveBeenCalledWith({
      title: 'Test button title',
      url: 'http://localhost/test/button/url',
    });
  });
});
