import {ESLPanel} from '../../esl-panel/core';
import {ESLPanelGroup} from '../../esl-panel-group/core';
import {ESLTestTemplate} from '../../esl-utils/test/template';

const REFERENCES = {
  group: 'esl-panel-group',
  panel: 'esl-panel',
};

describe('ESLPanelGroup has-opened attribute behavior', () => {
  ESLPanelGroup.register();
  ESLPanel.register();

  describe('Initially opened panel group', () => {
    const TEMPLATE = ESLTestTemplate.create(`
      <esl-panel-group min-open-items="0">
        <esl-panel></esl-panel>
        <esl-panel></esl-panel>
        <esl-panel open></esl-panel>
      </esl-panel-group>
    `, REFERENCES).bind('beforeall');


    test('"has-opened" attribute should be present initially', () => expect(TEMPLATE.$group.hasAttribute('has-opened')).toBe(true));

    test('"has-opened" attribute should be removed after closing all panels', () => {
      TEMPLATE.$$panel.forEach((panel: ESLPanel) => panel.hide());
      expect(TEMPLATE.$group.hasAttribute('has-opened')).toBe(false);
    });

    test('"has-opened" attribute should be set after opening panels again', () => {
      (TEMPLATE.$$panel[0] as ESLPanel).show();
      expect(TEMPLATE.$group.hasAttribute('has-opened')).toBe(true);
      (TEMPLATE.$$panel[1] as ESLPanel).show();
      expect(TEMPLATE.$group.hasAttribute('has-opened')).toBe(true);
      (TEMPLATE.$$panel[2] as ESLPanel).show();
      expect(TEMPLATE.$group.hasAttribute('has-opened')).toBe(true);
    });

    test('"has-opened" attribute should be removed only after last panel is closed', () => {
      (TEMPLATE.$$panel[0] as ESLPanel).hide();
      expect(TEMPLATE.$group.hasAttribute('has-opened')).toBe(true);
      (TEMPLATE.$$panel[1] as ESLPanel).hide();
      expect(TEMPLATE.$group.hasAttribute('has-opened')).toBe(true);
      (TEMPLATE.$$panel[2] as ESLPanel).hide();
      expect(TEMPLATE.$group.hasAttribute('has-opened')).toBe(false);
    });
  });

  describe('Initially closed panel group', () => {
    const TEMPLATE = ESLTestTemplate.create(`
      <esl-panel-group min-open-items="0">
        <esl-panel></esl-panel>
        <esl-panel></esl-panel>
        <esl-panel></esl-panel>
      </esl-panel-group>
    `, REFERENCES).bind('beforeall');

    test('"has-opened" attribute shouldn`t be set initially', () => expect(TEMPLATE.$group.hasAttribute('has-opened')).toBe(false));

    test('"has-opened" attribute should be set after opening all panels', () => {
      TEMPLATE.$$panel.forEach((panel: ESLPanel) => panel.show());
      expect(TEMPLATE.$group.hasAttribute('has-opened')).toBe(true);
    });

    test('"has-opened" attribute should be removed after closing all panels', () => {
      TEMPLATE.$$panel.forEach((panel: ESLPanel) => panel.hide());
      expect(TEMPLATE.$group.hasAttribute('has-opened')).toBe(false);
    });
  });
});
