import {ESLModal} from '../core/esl-modal';

describe('ESLModalBackdrop behavior', () => {
  const $modal = ESLModal.create();
  $modal.setAttribute('inject-to-body', 'true');
  const $nestedModal = ESLModal.create();
  $modal.appendChild($nestedModal);
  const $container = document.createElement('div');
  $container.appendChild($modal);

  const isActiveBackdrop = (): boolean => {
    const backdrop = document.body.querySelector('esl-modal-backdrop');
    return !!backdrop?.hasAttribute('active');
  };

  jest.useFakeTimers();
  beforeAll(() => {
    ESLModal.register();
    document.body.appendChild($container);
  });

  afterEach(() => {
    $nestedModal.hide();
    $modal.hide();
    $modal.removeAttribute('no-backdrop');
    ($modal.parentElement === document.body) && document.body.removeChild($modal);
  });

  describe('Backdrop activeness after call of ESLModal show function', () => {
    test('Backdrop is active after modal opening', () => {
      $modal.show();
      jest.advanceTimersByTime(1);
      expect(isActiveBackdrop()).toBeTruthy();
    });
    test('Backdrop is active after open nested modal', () => {
      $modal.show();
      jest.advanceTimersByTime(1);
      $nestedModal.show();
      jest.advanceTimersByTime(1);
      expect(isActiveBackdrop()).toBe(true);
    });
    test('Backdrop is inactive after opening modal marked with no-backdrop attribute)', () => {
      $modal.setAttribute('no-backdrop', 'true');
      $modal.show();
      jest.advanceTimersByTime(1);
      expect(isActiveBackdrop()).toBeFalsy();
    });
  });

  describe('Backdrop activeness after call of ESLModal hide function', () => {
    test('Backdrop is inactive after closing modal', () => {
      $modal.show();
      jest.advanceTimersByTime(1);
      $modal.hide();
      jest.advanceTimersByTime(1);
      expect(isActiveBackdrop()).toBeFalsy();
    });
    test('Backdrop is active after closing nested modal', () => {
      $modal.show();
      jest.advanceTimersByTime(1);
      $nestedModal.show();
      jest.advanceTimersByTime(1);
      $nestedModal.hide();
      jest.advanceTimersByTime(1);
      expect(isActiveBackdrop()).toBe(true);
    });
    test('Backdrop is inactive after closing modal marked with no-backdrop attribute)', () => {
      $modal.setAttribute('no-backdrop', 'true');
      $modal.show();
      jest.advanceTimersByTime(1);
      $modal.hide();
      jest.advanceTimersByTime(1);
      expect(isActiveBackdrop()).toBeFalsy();
    });
  });

  describe('Backdrop activeness in case of click on backdrop', () => {
    test('Backdrop is inactive after click on backdrop', () => {
      $modal.show();
      jest.advanceTimersByTime(1);
      const backdrop = document.body.querySelector('esl-modal-backdrop');
      backdrop?.click();
      jest.advanceTimersByTime(1);
      expect(isActiveBackdrop()).toBe(false);
    });
    test('Backdrop is active after one click on backdrop when more than one modal is open', () => {
      $modal.show();
      jest.advanceTimersByTime(1);
      $nestedModal.show();
      jest.advanceTimersByTime(1);
      const backdrop = document.body.querySelector('esl-modal-backdrop');
      backdrop?.click();
      jest.advanceTimersByTime(1);
      expect(isActiveBackdrop()).toBe(true);
    });
  });
});
