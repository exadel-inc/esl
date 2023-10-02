import {ESLModal} from '../core/esl-modal';

describe('ESLModalPlaceholder appearance', () => {
  const id1 = 'modal1';
  const id2 = 'modal2';

  const $modal1 = ESLModal.create();
  $modal1.setAttribute('id', `${id1}`);
  $modal1.setAttribute('inject-to-body', 'true');

  const $modal2 = ESLModal.create();
  $modal2.setAttribute('id', `${id2}`);

  const $container = document.createElement('div');
  $container.appendChild($modal1).appendChild($modal2);

  jest.useFakeTimers();
  beforeAll(() => {
    ESLModal.register();
    document.body.appendChild($container);
  });

  describe('Placeholder for ESLModal moved to body', () => {
    test('Placeholder appears with allowed attributes copy after the origin element was moved to body', () => {
      $modal1.show();
      jest.advanceTimersByTime(1);
      const placeholder = $container.querySelector(`esl-modal-placeholder[original-id=${id1}]`);
      expect(placeholder).toBeTruthy();
    });
  });

  describe('Placeholder for ESLModal not moved to body', () => {
    test('ESLModal not moved to body does not call placeholder creation', () => {
      $modal2.show();
      jest.advanceTimersByTime(1);
      const placeholder = $container.querySelector(`esl-modal-placeholder[original-id=${id2}]`);
      expect(placeholder).toBeFalsy();
    });
  });
});
