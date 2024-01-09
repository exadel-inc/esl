import {ESLModal} from '../core/esl-modal';
import {RAFMock} from '../../esl-utils/test/raf.mock';
import {ESLTestTemplate} from '../../esl-utils/test/template';

describe('Aria-hidden attribute changing', () => {
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

  describe('Attribute value is:', () => {
    const $modal = ESLModal.create();
    beforeAll(async () => {
      document.body.append($modal);
      await modalUpdate();
    });
    test('true on initial state', () => {
      expect($modal.getAttribute('aria-hidden')).toBe('true');
    });
    test('false on open state', async () => {
      $modal.show();
      await modalUpdate();
      expect($modal.getAttribute('aria-hidden')).toBe('false');
    });
    test('true on hidden state', async () => {
      $modal.hide();
      await modalUpdate();
      expect($modal.getAttribute('aria-hidden')).toBe('true');
    });
  });

  describe('Attribute changes in case of nested modals', () => {
    const REFERENCES = {
      modal1: 'esl-modal.esl-modal-1',
      modal2: 'esl-modal.esl-modal-2',
      modal3: 'esl-modal.esl-modal-3'
    };
    const TEMPLATE = ESLTestTemplate.create(`
      <esl-modal class="esl-modal-1">
        <esl-modal class="esl-modal-2">
          <esl-modal class="esl-modal-3">
          </esl-modal>
        </esl-modal>
      </esl-modal>
    `, REFERENCES).bind('beforeall');

    beforeAll(async () => {
      jest.advanceTimersByTime(300);
      await modalUpdate();
    });

    test('Value of aria-hidden for last open modal is false, for others - true', async () => {
      (TEMPLATE.$modal1 as ESLModal).show();
      await modalUpdate();
      (TEMPLATE.$modal2 as ESLModal).show();
      await modalUpdate();
      (TEMPLATE.$modal3 as ESLModal).show();
      await modalUpdate();

      expect(TEMPLATE.$modal1.getAttribute('aria-hidden')).toBe('true');
      expect(TEMPLATE.$modal2.getAttribute('aria-hidden')).toBe('true');
      expect(TEMPLATE.$modal3.getAttribute('aria-hidden')).toBe('false');
    });

    test('Value of aria-hidden for closed modal changes to true, for top open modal - to false', async () => {
      (TEMPLATE.$modal3 as ESLModal).hide();
      await modalUpdate();
      expect(TEMPLATE.$modal3.getAttribute('aria-hidden')).toBe('true');
      expect(TEMPLATE.$modal2.getAttribute('aria-hidden')).toBe('false');
      expect(TEMPLATE.$modal1.getAttribute('aria-hidden')).toBe('true');
    });
  });
});

