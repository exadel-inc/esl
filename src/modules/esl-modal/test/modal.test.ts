import {ESLModal} from '../core/esl-modal';

describe('ESLModal appearance and presence in the body', () => {
  beforeAll(() => {
    jest.useFakeTimers();
    ESLModal.register();
  });

  describe('ESLModal with move to body option', (): void => {
    const $modal = ESLModal.create();
    $modal.setAttribute('inject-to-body', 'true');
    const $container = document.createElement('div');
    $container.appendChild($modal);

    beforeAll(() => {
      document.body.appendChild($container);
      jest.advanceTimersByTime(300);
    });
    const inBody = (): boolean => $modal.parentElement === document.body;
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
      jest.advanceTimersByTime(300);
      expect($modal.open).toBe(false);
    });
    test('Call of hide function leads to remove modal window from body', () => expect(inBody()).toBeFalsy());
  });

  describe('ESLModal does not move to body', (): void => {
    const $modal1 = ESLModal.create();
    const $parent = document.createElement('div');
    $parent.appendChild($modal1);

    beforeAll(() => {
      document.body.appendChild($parent);
      jest.advanceTimersByTime(300);
    });

    const inBody = (): boolean => $modal1.parentElement === document.body;
    test('Modal is not in body', () => expect(inBody()).toBeFalsy());
    test('Call of show function does not move modal window to body', () => {
      $modal1.show();
      jest.advanceTimersByTime(1);
      expect(inBody()).toBeFalsy();
    });
    test('Show request leads to open modal', () => expect($modal1.open).toBe(true));
    test('Hide request leads to hide modal', () => {
      $modal1.hide();
      jest.advanceTimersByTime(300);
      expect($modal1.open).toBe(false);
    });
    test('Call of hide function leads to remove modal window from body', () => expect(inBody()).toBeFalsy());
  });
});

