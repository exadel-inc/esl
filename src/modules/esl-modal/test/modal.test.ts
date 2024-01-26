import {ESLModal} from '../core/esl-modal';
import {RAFMock} from '../../esl-utils/test/raf.mock';

describe('ESLModal appearance and presence in the body', () => {
  beforeAll(() => {
    jest.useFakeTimers();
    RAFMock.applyMock();
    RAFMock.instance.reset();
    ESLModal.register();
  });

  const modalUpdate = async (): Promise<void> => {
    jest.advanceTimersByTime(300);
    RAFMock.instance.triggerAllAnimationFrames();
    await Promise.resolve();
  };

  describe('ESLModal with move to body option', (): void => {
    const $modal = ESLModal.create();
    const $container = document.createElement('div');
    $container.appendChild($modal);

    beforeAll(async () => {
      document.body.appendChild($container);
      await modalUpdate();
    });
    const inBody = (): boolean => $modal.parentElement === document.body;
    test('Initial state of modal is hidden', () => expect($modal.open).toBe(false));
    test('Modal is not in body', () => expect(inBody()).toBeFalsy());
    test('Call of show function leads to move modal window to body', async () => {
      $modal.show();
      await modalUpdate();
      expect(inBody()).toBeTruthy();
    });
    test('Show request leads to open modal', () => expect($modal.open).toBe(true));
    test('Hide request leads to hide modal', async () => {
      $modal.hide();
      await modalUpdate();
      expect($modal.open).toBe(false);
    });
    test('Call of hide function leads to remove modal window from body', () => expect(inBody()).toBeFalsy());
  });

  describe('ESLModal does not move to body', (): void => {
    const $modal1 = ESLModal.create();
    $modal1.setAttribute('inject-to-body', 'false');
    const $parent = document.createElement('div');
    $parent.appendChild($modal1);

    beforeAll(async () => {
      document.body.appendChild($parent);
      await modalUpdate();
    });

    const inBody = (): boolean => $modal1.parentElement === document.body;
    test('Modal is not in body', () => expect(inBody()).toBeFalsy());
    test('Call of show function does not move modal window to body', async () => {
      $modal1.show();
      await modalUpdate();
      expect(inBody()).toBeFalsy();
    });
    test('Show request leads to open modal', () => expect($modal1.open).toBe(true));
    test('Hide request leads to hide modal', async () => {
      $modal1.hide();
      await modalUpdate();
      expect($modal1.open).toBe(false);
    });
    test('Call of hide function leads to remove modal window from body', () => expect(inBody()).toBeFalsy());
  });
});

