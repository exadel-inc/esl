import {ESLModal} from '../core/esl-modal';
import {ESLModalStack} from '../core/esl-modal-stack';
import {ESLTestTemplate} from '../../esl-utils/test/template';

describe('ESLModalStack work', () => {
  beforeAll(() => {
    jest.useFakeTimers();
    ESLModal.register();
  });

  describe('Store length of ESLModalStack and modal presence on it', () => {
    const $modal = ESLModal.create();
    const $modal2 = ESLModal.create();
    beforeAll(() => {
      $modal.append($modal2);
      document.body.append($modal);
      jest.advanceTimersByTime(300);
    });
    test('Store length of ESLModalStack on initial step is equal 0', () => {
      expect(ESLModalStack.store.length).toBe(0);
    });
    test('ESLModal appears in store after opening', () => {
      ESLModalStack.instance.add($modal);
      jest.advanceTimersByTime(1);
      expect(ESLModalStack.store.includes($modal)).toBe(true);
      expect(ESLModalStack.store.length).toBe(1);
    });
    test('ESLModal removes from store after closing', () => {
      ESLModalStack.instance.remove($modal);
      jest.advanceTimersByTime(1);
      expect(ESLModalStack.store.includes($modal)).toBe(false);
    });
  });

  describe('ESLModalStack changing in case of nested modals', () => {
    const REFERENCES = {
      modal1: 'esl-modal.esl-modal-1',
      modal2: 'esl-modal.esl-modal-2'
    };
    const TEMPLATE = ESLTestTemplate.create(`
    <esl-modal class="esl-modal-1">
      <esl-modal class="esl-modal-2"></esl-modal>
    </esl-modal>
  `, REFERENCES).bind('beforeall');

    beforeAll(() => {
      ESLModalStack.store.length = 0;
      jest.advanceTimersByTime(300);
    });

    test('Each opened ESLModal appears in store in the sequence of show function call', () => {
      ESLModalStack.instance.add(TEMPLATE.$modal1 as ESLModal);
      jest.advanceTimersByTime(1);
      ESLModalStack.instance.add(TEMPLATE.$modal2 as ESLModal);
      jest.advanceTimersByTime(1);
      expect(ESLModalStack.store[0]).toBe(TEMPLATE.$modal1);
      expect(ESLModalStack.store[1]).toBe(TEMPLATE.$modal2);
      expect(ESLModalStack.store.length).toBe(2);
    });
    test('Closing and removing parent modal from store leads to hide all nested modals in case their are opened before target modal closes and its removing from store', () => {
      ESLModalStack.instance.remove(TEMPLATE.$modal1 as ESLModal);
      jest.advanceTimersByTime(1);
      expect(ESLModalStack.store.length).toBe(0);
    });
  });
});
