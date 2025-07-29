import '../../actions/external-action';
import {ESLShareActionRegistry} from '../../core/esl-share-action-registry';
import {ESLShareButton} from '../../core/esl-share-button';

describe('ESLShare: "external" action import', () => {
  test('"external" action was registered when importing', () => {
    expect(ESLShareActionRegistry.instance.has('external')).toBe(true);
  });
});

describe('ESLShare: "external" action public API', () => {
  const originalCreateElement = document.createElement;
  const mockAnchorElement = {click: jest.fn()};
  Object.defineProperty(mockAnchorElement, 'href', {
    get: () => (this as any)._href,
    set: (value) => (this as any)._href = value,
  });
  const mockCreateElement = (tag: string) => {
    if (tag === 'a') return mockAnchorElement as any;
    return originalCreateElement(tag);
  };

  const externalAction = ESLShareActionRegistry.instance.get('external');
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
    expect(externalAction?.isAvailable).toBe(true);
  });

  test('should simulate click() on anchor to make external jump (also checks link placeholders replacement)', () => {
    jest.spyOn(document, 'createElement').mockImplementation(mockCreateElement);
    externalAction?.share($button);
    expect(mockAnchorElement.click).toHaveBeenCalledTimes(1);
    expect((mockAnchorElement as any).href).toBe(
      '//host/sharer?title=Test%20btn%20title&url=http%3A%2F%2Flocalhost%2Ftest%2Furl&t=Test%20btn%20title&u=http%3A%2F%2Flocalhost%2Ftest%2Furl'
    );
  });
});
