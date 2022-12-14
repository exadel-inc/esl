import * as fs from 'fs';
import * as path from 'path';
import {ESLNestedAccordion} from '../core/esl-nested-accordion';
import {ESLPanelGroup} from '../../esl-panel-group/core/esl-panel-group';
import {ESLPanel} from '../../esl-panel/core/esl-panel';
import {ESLTrigger} from '../../esl-trigger/core/esl-trigger';

describe('ESLNestedAccordion: nested panels hide if parent panel (with esl-nested-accordion) is closing', () => {

  ESLPanelGroup.register();
  ESLTrigger.register();
  ESLPanel.register();
  ESLNestedAccordion.register();

  document.body.innerHTML = fs.readFileSync(path.resolve(__dirname, 'nested-accordion-template.html'), 'utf8');

  jest.useFakeTimers();
  describe('Hide all nested panels under esl-nested-accordion mixin', () => {
    test('Direct call of hide function', () => {
      const $panel = document.querySelector('[esl-nested-accordion]') as ESLPanel;
      const $children = [...$panel.querySelectorAll('esl-panel')] as ESLPanel[];
      const $parentPanel = $panel.closest('#parent-panel') as ESLPanel;
      $panel.hide();
      jest.advanceTimersByTime(1);
      $children.forEach(($child: ESLPanel) => expect($child.open).toBe(false));
      expect($parentPanel.open).toBe(true);
    });
  });
});
