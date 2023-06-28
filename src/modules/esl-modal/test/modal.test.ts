import {ESLModal} from '../core/esl-modal';

describe('ESLModal presence in the body', () => {
  const $modal = ESLModal.create();
  $modal.setAttribute('body-inject', 'true');
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
    test('Call of show function leads to move modal window to body', () => {
      expect($modal.open).toBe(false);
      expect(inBody()).toBeFalsy();
      $modal.show();
      jest.advanceTimersByTime(1);
      expect($modal.open).toBe(true);
      expect(inBody()).toBeTruthy();
    });
    test('Call of hide function leads to remove modal window from body', () => {
      $modal.hide();
      jest.advanceTimersByTime(1);
      expect($modal.open).toBe(false);
      expect(inBody()).toBeFalsy();
    });
  });
});
