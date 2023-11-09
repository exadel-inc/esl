import '../../actions/native-action';
import {ESLShareActionRegistry} from '../../core/esl-share-action-registry';
import {ESLShareButton} from '../../core/esl-share-button';
import {createImportCheckTestPlan} from './action-test-plan-factory';

describe(
  'ESLShare: "native" action import registers the "native" action',
  createImportCheckTestPlan('native')
);

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
    expect(mockShare).toBeCalledWith({
      title: 'Test button title',
      url: 'http://localhost/test/button/url',
    });
  });
});
