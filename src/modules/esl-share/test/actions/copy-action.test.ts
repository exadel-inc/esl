import '../../actions/copy-action';
import {ESLShareActionRegistry} from '../../core/esl-share-action-registry';
import {ESLShareButton} from '../../core/esl-share-button';

describe('ESLShare: "copy" action import', () => {
  test('"copy" action was registered when importing', () => {
    expect(ESLShareActionRegistry.instance.has('copy')).toBe(true);
  });
});

describe('ESLShare: "copy" action public API', () => {
  const originalClipboard = {...navigator.clipboard};
  const mockClipboard = {
    writeText: jest.fn(),
  };
  const copyAction = ESLShareActionRegistry.instance.get('copy');
  const $button = ESLShareButton.create();

  beforeAll(() => {
    (navigator as any).clipboard = mockClipboard;

    ESLShareButton.register();
    document.body.appendChild($button);
    $button.setAttribute('share-title', 'Test button title');
    $button.setAttribute('share-url', '/test/button/url');
    $button.setAttribute('additional', '{"copyAlertMsg": "Copied to clipboard"}');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    document.body.innerHTML = '';
    (navigator as any).clipboard = originalClipboard;
  });

  test('isAvailable should be true', () => {
    expect(copyAction?.isAvailable).toBe(true);
  });

  test('should call navigation.clipboard.writeText() when share() calls', () => {
    copyAction?.share($button);
    expect(mockClipboard.writeText).toBeCalledWith('http://localhost/test/button/url');
  });

  test('should dispatch esl:alert:show with shareAdditional.copyAlertMsg when share() calls', (done) => {
    document.body.addEventListener('esl:alert:show', (e) => {
      expect((e as CustomEvent).detail).toEqual({
        cls: 'esl-share-alert',
        html: '<span>Copied to clipboard</span>',
      });
      done();
    }, {once: true});
    copyAction?.share($button);
  }, 10);
});
