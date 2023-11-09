import '../../actions/print-action';
import {ESLShareActionRegistry} from '../../core/esl-share-action-registry';
import {ESLShareButton} from '../../core/esl-share-button';
import {createImportCheckTestPlan} from './action-test-plan-factory';

describe(
  'ESLShare: "print" action import registers the "print" action',
  createImportCheckTestPlan('print')
);

describe('ESLShare: "print" action public API', () => {
  const printAction = ESLShareActionRegistry.instance.get('print');
  const $button = ESLShareButton.create();

  beforeAll(() => {
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
    jest.restoreAllMocks();
  });

  test('should call window.print() when share() calls', () => {
    const mockPrint = jest.spyOn(window, 'print').mockImplementation(() => null);
    printAction?.share($button);
    expect(mockPrint).toBeCalled();
  });
});
