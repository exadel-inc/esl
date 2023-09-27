import {ESLModal} from '../core/esl-modal';
import {ESLModalStack} from '../core/esl-modal-stack';

describe('ESLModalStack work', () => {
  const $modal1 = ESLModal.create();
  const $modal2 = ESLModal.create();
  const $modal3 = ESLModal.create();
  const $modal4 = ESLModal.create();
  $modal2.appendChild($modal4);
  $modal1.appendChild($modal2).appendChild($modal3);

  jest.useFakeTimers();
  beforeAll(() => {
    ESLModal.register();
    document.body.appendChild($modal1);
  });

  describe('Change of ESLModalStack store after ESLModal opening', () => {
    test('Each opened ESLModal appears in store in the sequence of show function call', () => {
      $modal2.show();
      jest.advanceTimersByTime(1);
      $modal4.show();
      jest.advanceTimersByTime(1);
      expect(ESLModalStack.store.includes($modal2)).toBe(true);
      expect(ESLModalStack.store.includes($modal4)).toBe(true);
    });
  });

  describe('Change of ESLModalStack store after ESLModal closing', () => {
    test('Call of hide function leads to remove closed modal from store', () => {
      $modal4.hide();
      jest.advanceTimersByTime(1);
      expect(ESLModalStack.store.includes($modal4)).toBe(false);
      expect(ESLModalStack.store.includes($modal2)).toBe(true);
      $modal2.hide();
      jest.advanceTimersByTime(1);
      expect(ESLModalStack.store.includes($modal2)).toBe(false);
    });
    test('Call of hide function on parent open modal leads to hide all nested modals in case their are opened before target modal closes', () => {
      $modal1.show();
      jest.advanceTimersByTime(1);
      $modal3.show();
      jest.advanceTimersByTime(1);
      $modal1.hide();
      expect(ESLModalStack.store.length).toBe(0);
    });
  });
});
