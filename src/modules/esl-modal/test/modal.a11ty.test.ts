import {ESLModal} from '../core/esl-modal';

describe('Aria-hidden attribute changing in case of nested modals', () => {
  const $modal1 = ESLModal.create();
  const $modal2 = ESLModal.create();
  const $modal3 = ESLModal.create();
  $modal1.appendChild($modal2).appendChild($modal3);

  jest.useFakeTimers();
  beforeAll(() => {
    ESLModal.register();
    document.body.appendChild($modal1);
  });

  describe('Handling of aria-hidden attribute after call of ESLModal show function', () => {
    test('Value of aria-hidden for last open modal is false, for others - true', () => {
      $modal1.show();
      jest.advanceTimersByTime(1);
      $modal2.show();
      jest.advanceTimersByTime(1);
      $modal3.show();
      jest.advanceTimersByTime(1);
      expect($modal1.getAttribute('aria-hidden') === 'true').toBe(true);
      expect($modal2.getAttribute('aria-hidden') === 'true').toBe(true);
      expect($modal3.getAttribute('aria-hidden') === 'true').toBe(false);
    });
  });
  describe('Handling of aria-hidden attribute after call of ESLModal hide function', () => {
    test('Value of aria-hidden for closed modal changes to true, for top open modal - to false', () => {
      $modal3.hide();
      jest.advanceTimersByTime(1);
      expect($modal3.getAttribute('aria-hidden') === 'true').toBe(true);
      expect($modal2.getAttribute('aria-hidden') === 'true').toBe(false);
      expect($modal1.getAttribute('aria-hidden') === 'true').toBe(true);
    });
  });
});
