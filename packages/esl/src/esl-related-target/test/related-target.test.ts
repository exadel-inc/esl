import {ESLRelatedTarget} from '../core/esl-related-target';
import {ESLPanelGroup} from '../../esl-panel-group/core/esl-panel-group';
import {ESLPanel} from '../../esl-panel/core/esl-panel';
import {ESLToggleable} from '../../esl-toggleable/core/esl-toggleable';
import {ESLTestTemplate} from '../../esl-utils/test/template';

describe('ESLRelatedTarget (mixin): tests', () => {

  beforeAll(() => {
    vi.useFakeTimers();

    ESLPanelGroup.register();
    ESLPanel.register();
    ESLToggleable.register();
    ESLRelatedTarget.register();
  });

  describe('ESLRelatedTarget: general behaviour tests', () => {
    const REFERENCES = {
      origin: 'esl-toggleable#origin-tgbl',
      related: 'esl-toggleable.related-tgbl',
    };
    const TEMPLATE = ESLTestTemplate.create(`
      <esl-toggleable id="origin-tgbl" esl-related-target=".related-tgbl"></esl-toggleable>
      <esl-toggleable class="related-tgbl"></esl-toggleable>
      <esl-toggleable class="related-tgbl"></esl-toggleable>
    `, REFERENCES).bind('beforeeach');

    const showRelationTest = () => {
      TEMPLATE.$$related.forEach((panel: ESLPanel, i) => panel.toggle(i % 2 === 0));
      vi.advanceTimersByTime(1);
      (TEMPLATE.$origin as ESLToggleable).show();
      vi.advanceTimersByTime(1);
      TEMPLATE.$$related.forEach(($chosenPanel: ESLPanel) => expect($chosenPanel.open).toBe(true));
    };
    const hideRelationTest = () => {
      TEMPLATE.$$related.forEach((panel: ESLPanel, i) => panel.toggle(i % 2 === 0));
      vi.advanceTimersByTime(1);
      (TEMPLATE.$origin as ESLToggleable).hide();
      vi.advanceTimersByTime(1);
      TEMPLATE.$$related.forEach(($chosenPanel: ESLPanel) => expect($chosenPanel.open).toBe(false));
    };

    test('ESLRelatedTarget with \'all\' action observation synchronize show state of toggleables', () => {
      (TEMPLATE.$origin as ESLToggleable).setAttribute('esl-related-target-action', 'all');
      showRelationTest();
    });
    test('ESLRelatedTarget with \'all\' action observation synchronize hide state of toggleables', () => {
      (TEMPLATE.$origin as ESLToggleable).show();
      (TEMPLATE.$origin as ESLToggleable).setAttribute('esl-related-target-action', 'all');
      hideRelationTest();
    });
    test('ESLRelatedTarget with \'show\' action observation synchronize show state of toggleables', () => {
      (TEMPLATE.$origin as ESLToggleable).setAttribute('esl-related-target-action', 'show');
      showRelationTest();
    });
    test('ESLRelatedTarget with \'hide\' action observation synchronize hide state of toggleables', () => {
      (TEMPLATE.$origin as ESLToggleable).show();
      (TEMPLATE.$origin as ESLToggleable).setAttribute('esl-related-target-action', 'hide');
      hideRelationTest();
    });

    test('ESLRelatedTarget with \'hide\' action observation does not synchronize show state of toggleables', () => {
      (TEMPLATE.$origin as ESLToggleable).setAttribute('esl-related-target-action', 'hide');
      TEMPLATE.$$related.forEach((panel: ESLPanel) => panel.hide());
      vi.advanceTimersByTime(1);
      (TEMPLATE.$origin as ESLToggleable).show();
      vi.advanceTimersByTime(1);
      TEMPLATE.$$related.forEach(($chosenPanel: ESLPanel) => expect($chosenPanel.open).toBe(false));
    });

    test('ESLRelatedTarget with \'show\' action observation does not synchronize hide state of toggleables', () => {
      (TEMPLATE.$origin as ESLToggleable).setAttribute('esl-related-target-action', 'show');
      TEMPLATE.$$related.forEach((panel: ESLPanel) => panel.show());
      vi.advanceTimersByTime(1);
      (TEMPLATE.$origin as ESLToggleable).hide();
      vi.advanceTimersByTime(1);
      TEMPLATE.$$related.forEach(($chosenPanel: ESLPanel) => expect($chosenPanel.open).toBe(true));
    });
  });

  describe('ESLRelatedTarget: nested behaviour tests', () => {
    const REFERENCES = {
      origin: 'esl-toggleable#origin',
      related: 'esl-toggleable#related',
      nested: 'esl-toggleable#nested'
    };
    const FRAGMENT = ESLTestTemplate.create(`
      <esl-toggleable id="origin" esl-related-target="#related">
        <esl-toggleable id="related">
          <esl-toggleable id="nested">
          </esl-toggleable>
        </esl-toggleable>
      </esl-toggleable>
    `, REFERENCES).bind('beforeeach');

    test('ESLRelatedTarget does not catch bubbling show events', () => {
      (FRAGMENT.$nested as ESLToggleable).show();
      vi.advanceTimersByTime(1);
      expect((FRAGMENT.$related as ESLToggleable).open).toBe(false);
    });

    test('ESLRelatedTarget does not catch bubbling show events', () => {
      (FRAGMENT.$nested as ESLToggleable).show();
      (FRAGMENT.$related as ESLToggleable).show();
      vi.advanceTimersByTime(1);
      (FRAGMENT.$nested as ESLToggleable).hide();
      vi.advanceTimersByTime(1);
      expect((FRAGMENT.$related as ESLToggleable).open).toBe(true);
    });
  });
});
