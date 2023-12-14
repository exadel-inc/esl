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

  const nextRender = async (): Promise<void> => {
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
      await nextRender();
      expect(isActiveBackdrop()).toBe(true);
    });
    test('not active when modal is closed', () => {
      $modal.hide();
      jest.advanceTimersByTime(300);
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
      await nextRender();
      expect(isActiveBackdrop()).toBe(false);
    });
    test('not active when modal is closed', () => {
      $modal.hide();
      jest.advanceTimersByTime(300);
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
      await nextRender();
      jest.advanceTimersByTime(300);
      expect(isActiveBackdrop()).toBe(false);
    });
    test('Backdrop is active after open nested modal', async () => {
      (NEW_TEMPLATE.$nestedModal as ESLModal).show();
      await nextRender();
      jest.advanceTimersByTime(300);
      expect(isActiveBackdrop()).toBe(true);
    });
    test('Backdrop is inactive after opening modal marked with no-backdrop attribute)', () => {
      (NEW_TEMPLATE.$parentModal as ESLModal).hide();
      jest.advanceTimersByTime(1);
      expect(isActiveBackdrop()).toBe(false);
    });
  });

  describe('Backdrop activeness in case of click on backdrop', () => {
    const $modal = ESLModal.create();
    beforeAll(() => {
      document.body.append($modal);
      jest.advanceTimersByTime(300);
    });
    test('Backdrop is inactive after click on backdrop', () => {
      $modal.show();
      jest.advanceTimersByTime(1);
      const backdrop = document.body.querySelector('esl-modal-backdrop');
      backdrop?.click();
      jest.advanceTimersByTime(300);
      expect(isActiveBackdrop()).toBe(false);
    });
  });
});
