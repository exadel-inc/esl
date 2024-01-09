import {ESLModal} from '../core/esl-modal';
import {ESLTestTemplate} from '../../esl-utils/test/template';
import {RAFMock} from '../../esl-utils/test/raf.mock';

describe('ESLModalBackdrop behavior', () => {
  beforeAll(() => {
    jest.useFakeTimers();
    RAFMock.applyMock();
    RAFMock.instance.reset();
    ESLModal.register();
  });

  const updateModal = async (): Promise<void> => {
    jest.advanceTimersByTime(300);
    RAFMock.instance.triggerAllAnimationFrames();
    await Promise.resolve();
  };

  const isActiveBackdrop = (): boolean => {
    const backdrop = document.body.querySelector('esl-modal-backdrop');
    return !!backdrop?.hasAttribute('active');
  };

  describe('Backdrop is', () => {
    const $modal = ESLModal.create();
    beforeAll(() => {
      document.body.append($modal);
      jest.advanceTimersByTime(300);
    });
    test('active while modal is open', async () => {
      $modal.show();
      await updateModal();
      expect(isActiveBackdrop()).toBe(true);
    });
    test('not active when modal is closed', async () => {
      $modal.hide();
      await updateModal();
      expect(isActiveBackdrop()).toBe(false);
    });
  });

  describe('In modal marked with no-backdrop attribute backdrop is', () => {
    const $modal = ESLModal.create();
    $modal.setAttribute('no-backdrop', 'true');
    beforeAll(() => {
      document.body.append($modal);
      jest.advanceTimersByTime(300);
    });
    test('not active when modal is open', async () => {
      $modal.show();
      await updateModal();
      expect(isActiveBackdrop()).toBe(false);
    });
    test('not active when modal is closed', async () => {
      $modal.hide();
      await updateModal();
      expect(isActiveBackdrop()).toBe(false);
    });
  });

  describe('Backdrop activeness after call of ESLModal show function', () => {
    beforeAll(() => jest.advanceTimersByTime(300));

    const REF = {
      parentModal: 'esl-modal.esl-modal-parent',
      nestedModal: 'esl-modal.esl-modal-nested'
    };
    const NEW_TEMPLATE = ESLTestTemplate.create(`
      <esl-modal class="esl-modal-parent" no-backdrop>
        <esl-modal class="esl-modal-nested"></esl-modal>
      </esl-modal>
    `, REF).bind('beforeall');

    test('Backdrop is active after open nested modal', async () => {
      (NEW_TEMPLATE.$parentModal as ESLModal).show();
      await updateModal();
      expect(isActiveBackdrop()).toBe(false);
    });
    test('Backdrop is active after open nested modal', async () => {
      (NEW_TEMPLATE.$nestedModal as ESLModal).show();
      await updateModal();
      expect(isActiveBackdrop()).toBe(true);
    });
    test('Backdrop is inactive after opening modal marked with no-backdrop attribute', async () => {
      (NEW_TEMPLATE.$parentModal as ESLModal).hide();
      await updateModal();
      expect(isActiveBackdrop()).toBe(false);
    });
  });

  describe('Backdrop activeness in case of click on backdrop', () => {
    const $modal = ESLModal.create();
    beforeAll(() => {
      document.body.append($modal);
      jest.advanceTimersByTime(300);
    });
    test('Backdrop is inactive after click on backdrop', async () => {
      $modal.show();
      await updateModal();
      const backdrop = document.body.querySelector('esl-modal-backdrop');
      backdrop?.click();
      await updateModal();
      expect(isActiveBackdrop()).toBe(false);
    });
  });
});
