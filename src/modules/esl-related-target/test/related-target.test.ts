import {ESLRelatedTarget} from '../core/esl-related-target';
import {ESLToggleable} from '../../esl-toggleable/core/esl-toggleable';
import {ESLPanelGroup} from '../../esl-panel-group/core/esl-panel-group';
import {ESLPanel} from '../../esl-panel/core/esl-panel';
import {ESLTrigger} from '../../esl-trigger/core/esl-trigger';
// @ts-ignore
import html from './nested-accordion-template.html';

describe('', () => {

  document.body.innerHTML = html;

  jest.useFakeTimers();
  beforeAll(() =>  {
    ESLPanelGroup.register();
    ESLTrigger.register();
    ESLPanel.register();
    ESLRelatedTarget.register();

  });

  const $panel = document.querySelector('[esl-related-target]') as ESLPanel;
  const $chosenPanels = [...document.querySelectorAll('.chosen-panel')] as ESLPanel[];

  describe('esl-related-target-action = all', () => {
    test('Direct call ', () => {
      $panel.setAttribute('esl-related-target-action', 'all');
      $panel.show();
      $chosenPanels.forEach(($chosenPanel: ESLPanel) => expect($chosenPanel.open).toBe(true));
      $panel.hide();
      $chosenPanels.forEach(($chosenPanel: ESLPanel) => expect($chosenPanel.open).toBe(false));
    });
  });

  describe('esl-related-target-action=hide', () => {
    test('call ', () => {
      $panel.setAttribute('esl-related-target-action', 'hide');
      $panel.hide();
      $chosenPanels.forEach(($chosenPanel: ESLPanel) => expect($chosenPanel.open).toBe(false));
    });
  });

  describe('Show all nested panels under esl-nested-accordion mixin', () => {
    test('Direct call ', () => {
      $panel.setAttribute('esl-related-target-action', 'show');
      $panel.show();
      $chosenPanels.forEach(($child: ESLPanel) => expect($child.open).toBe(true));
    });
  });
});

describe('ESLRelatedTarget: show/hide depending on mixin element state', () => {
  const $el = ESLToggleable.create();
  const $relatedEl = ESLToggleable.create();
  $relatedEl.setAttribute('id', 'related-toggleable');
  $el.setAttribute(ESLRelatedTarget.is, '#related-toggleable');

  jest.useFakeTimers();
  beforeAll(() =>  {
    ESLToggleable.register();
    ESLRelatedTarget.register();
    document.body.appendChild($el);
    document.body.appendChild($relatedEl);
  });
  afterAll(() => {
    ($el.parentElement === document.body) && document.body.removeChild($el);
    ($relatedEl.parentElement === document.body) && document.body.removeChild($relatedEl);
  });

  describe('Synchronization of mixin and target states: SHOW_REQUEST on the current mixin element leads to show target element', () => {
    beforeEach(() =>  $el.hide());
    test('Direct call of show function', () => {
      expect($relatedEl.open).toBe(false);
      $el.show();
      jest.advanceTimersByTime(1);
      expect($relatedEl.open).toBe(true);
    });
    test('SHOW_REQUEST_EVENT dispatching', () => {
      expect($relatedEl.open).toBe(false);
      $el.dispatchEvent(new CustomEvent($el.SHOW_REQUEST_EVENT));
      jest.advanceTimersByTime(1);
      expect($relatedEl.open).toBe(true);
    });
  });

  describe('Synchronization of mixin and target states: HIDE_REQUEST on the current mixin element leads to show target element', () => {
    beforeEach(() =>  $el.show());
    test('Direct call of hide function', () => {
      expect($relatedEl.open).toBe(true);
      $el.hide();
      jest.advanceTimersByTime(1);
      expect($relatedEl.open).toBe(false);
    });
    test('HIDE_REQUEST_EVENT dispatching', () => {
      expect($relatedEl.open).toBe(true);
      $el.dispatchEvent(new CustomEvent($el.HIDE_REQUEST_EVENT));
      jest.advanceTimersByTime(1);
      expect($relatedEl.open).toBe(false);
    });
  });
});
