import {ESLModal} from '../core/esl-modal';

describe('ESLModal presence in the body', () => {
  const $modal = ESLModal.create();
  $modal.setAttribute('inject-to-body', 'true');
  const $container = document.createElement('div');
  $container.appendChild($modal);
  const inBody = (): boolean => $modal.parentElement === document.body;

  jest.useFakeTimers();
  beforeAll(() => {
    ESLModal.register();
    document.body.appendChild($container);
  });

  afterAll(() => {
    ($modal.parentElement === document.body) && document.body.removeChild($modal);
  });

  describe('ESLModal with move to body option', () => {
    test('Initial state of modal is hidden', () => expect($modal.open).toBe(false));
    test('Modal is not in body', () => expect(inBody()).toBeFalsy());
    test('Call of show function leads to move modal window to body', () => {
      $modal.show();
      jest.advanceTimersByTime(1);
      expect(inBody()).toBeTruthy();
    });
    test('Show request leads to open modal', () => expect($modal.open).toBe(true));
    test('Hide request leads to hide modal', () => {
      $modal.hide();
      jest.advanceTimersByTime(1);
      expect($modal.open).toBe(false);
    });
    test('Call of hide function leads to remove modal window from body', () => expect(inBody()).toBeFalsy());
  });
});
