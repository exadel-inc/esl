import '../../actions/media-action';
import {ESLShareActionRegistry} from '../../core/esl-share-action-registry';
import {ESLShareButton} from '../../core/esl-share-button';
import {createImportCheckTestPlan} from './action-test-plan-factory';

describe(
  'ESLShare: "media" action import registers the "media" action',
  createImportCheckTestPlan('media')
);

describe('ESLShare: "media" action public API', () => {
  const mediaAction = ESLShareActionRegistry.instance.get('media');
  const $button = ESLShareButton.create();

  beforeAll(() => {
    ESLShareButton.register();
    document.body.appendChild($button);
    $button.setAttribute('link', '//host/sharer?title={title}&url={url}&t={t}&u={u}');
    $button.setAttribute('share-title', 'Test btn title');
    $button.setAttribute('share-url', '/test/url');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    document.body.innerHTML = '';
    jest.restoreAllMocks();
  });

  test('should be available', () => {
    expect(mediaAction?.isAvailable).toBe(true);
  });

  test('should call window.open() with buttons link when share() (also checks link placeholders replacement)', () => {
    const mockOpen = jest.spyOn(window, 'open').mockImplementation(() => null);
    mediaAction?.share($button);
    expect(mockOpen).toBeCalledWith(
      '//host/sharer?title=Test%20btn%20title&url=http%3A%2F%2Flocalhost%2Ftest%2Furl&t=Test%20btn%20title&u=http%3A%2F%2Flocalhost%2Ftest%2Furl',
      '_blank',
      'scrollbars=0,resizable=1,menubar=0,left=100,top=100,width=750,height=500,toolbar=0,status=0'
    );
  });
});
