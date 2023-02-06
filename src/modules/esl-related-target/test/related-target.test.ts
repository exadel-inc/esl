import {ESLRelatedTarget} from '../core/esl-related-target';
import {ESLPanelGroup} from '../../esl-panel-group/core/esl-panel-group';
import {ESLPanel} from '../../esl-panel/core/esl-panel';
import {ESLToggleable} from '../../esl-toggleable/core/esl-toggleable';

// @ts-ignore
import accordionTestTemplate from './template.html';

describe('ESLRelatedTarget (mixin): tests', () => {
  jest.useFakeTimers();

  let initialContent: string;
  let $panel: ESLPanel;
  let $targetPanels: ESLPanel[];

  beforeAll(() => {
    ESLPanelGroup.register();
    ESLPanel.register();
    ESLToggleable.register();
    ESLRelatedTarget.register();

    initialContent = document.body.innerHTML;
    document.body.innerHTML = accordionTestTemplate;
    $panel = document.querySelector('[esl-related-target]') as ESLPanel;
    $targetPanels = [...document.querySelectorAll('.chosen-panel')] as ESLPanel[];
  });
  afterAll(() => {
    document.body.innerHTML = initialContent;
  });

  describe('ESLRelatedTarget: behaviour tests', () => {
    const showRelationTest = () => {
      $targetPanels.forEach((panel: ESLPanel, i) => panel.toggle(i % 2 === 0));
      jest.advanceTimersByTime(1);
      $panel.show();
      jest.advanceTimersByTime(1);
      $targetPanels.forEach(($chosenPanel: ESLPanel) => expect($chosenPanel.open).toBe(true));
    };
    const hideRelationTest = () => {
      $targetPanels.forEach((panel: ESLPanel, i) => panel.toggle(i % 2 === 0));
      jest.advanceTimersByTime(1);
      $panel.hide();
      jest.advanceTimersByTime(1);
      $targetPanels.forEach(($chosenPanel: ESLPanel) => expect($chosenPanel.open).toBe(false));
    };

    test('ESLRelatedTarget with \'all\' action observation synchronize show state of toggleables', () => {
      $panel.setAttribute('esl-related-target-action', 'all');
      showRelationTest();
    });
    test('ESLRelatedTarget with \'all\' action observation synchronize hide state of toggleables', () => {
      $panel.setAttribute('esl-related-target-action', 'all');
      hideRelationTest();
    });
    test('ESLRelatedTarget with \'show\' action observation synchronize show state of toggleables', () => {
      $panel.setAttribute('esl-related-target-action', 'show');
      showRelationTest();
    });
    test('ESLRelatedTarget with \'hide\' action observation synchronize hide state of toggleables', () => {
      $panel.setAttribute('esl-related-target-action', 'hide');
      hideRelationTest();
    });

    test('ESLRelatedTarget with \'hide\' action observation does not synchronize show state of toggleables', () => {
      $panel.setAttribute('esl-related-target-action', 'hide');
      $targetPanels.forEach((panel: ESLPanel) => panel.hide());
      jest.advanceTimersByTime(1);
      $panel.show();
      jest.advanceTimersByTime(1);
      $targetPanels.forEach(($chosenPanel: ESLPanel) => expect($chosenPanel.open).toBe(false));
    });

    test('ESLRelatedTarget with \'show\' action observation does not synchronize hide state of toggleables', () => {
      $panel.setAttribute('esl-related-target-action', 'show');
      $targetPanels.forEach((panel: ESLPanel) => panel.show());
      jest.advanceTimersByTime(1);
      $panel.hide();
      jest.advanceTimersByTime(1);
      $targetPanels.forEach(($chosenPanel: ESLPanel) => expect($chosenPanel.open).toBe(true));
    });
  });
});
