import {ESLEventUtils} from '../../esl-event-listener/core/api';
import {ESLAlert} from '../core/esl-alert';
import type {ESLAlertActionParams} from '../core/esl-alert';

describe('ESLAlert: general', () => {
  beforeAll(() => ESLAlert.register());

  test('ESLAlert: init', () => {
    const $el = ESLAlert.init();
    const $queryResult = document.querySelector(`body > ${ESLAlert.is}`)!;
    expect($el).toBeInstanceOf(ESLAlert);
    expect($el).toBe($queryResult);
  });
});

describe('ESLAlert: events', () => {
  ESLAlert.register();
  const $el = ESLAlert.init();
  jest.useFakeTimers();

  beforeEach(() => {
    document.body.append($el);
  });

  afterEach(() => {
    if (!$el.parentElement) return;
    document.body.removeChild($el);
  });

  test('Alert is hidden by default', () => {
    expect($el.open).toBe(false);
  });

  test('Show/Hide events ', () => {
    ESLEventUtils.dispatch($el, ESLAlert.prototype.SHOW_REQUEST_EVENT, {detail: {text: 'esl-alert-text'}});
    jest.advanceTimersByTime(1);
    expect($el.open).toBe(true);
    ESLEventUtils.dispatch($el, ESLAlert.prototype.HIDE_REQUEST_EVENT);
    jest.advanceTimersByTime(1);
    expect($el.open).toBe(false);
  });

  test('Auto hide by hideTime & hideDelay ', () => {
    const params: CustomEventInit<ESLAlertActionParams> = {detail: {hideTime: 100, hideDelay: 100, text: 'esl-alert-text'}};
    ESLEventUtils.dispatch($el, ESLAlert.prototype.SHOW_REQUEST_EVENT, params);
    jest.advanceTimersByTime(1);
    expect($el.open).toBe(true);
    jest.advanceTimersByTime(100);
    expect($el.open).toBe(false);
  });

  test('Add text params', () => {
    const params: CustomEventInit<ESLAlertActionParams> = {detail: {text: 'esl-alert-text'}};
    ESLEventUtils.dispatch($el, ESLAlert.prototype.SHOW_REQUEST_EVENT, params);
    expect('esl-alert-text').toEqual($el.textContent);
  });

  test('Add HTML params', () => {
    const params: CustomEventInit<ESLAlertActionParams> = {detail: {html: '<h2>esl-alert-html</h2>'}};
    ESLEventUtils.dispatch($el, ESLAlert.prototype.SHOW_REQUEST_EVENT, params);
    expect('<h2>esl-alert-html</h2>').toEqual($el.children[0].innerHTML);
  });

  test('Add class params', () => {
    const params: CustomEventInit<ESLAlertActionParams> = {detail: {cls: 'esl-alert-cls',  text: 'esl-alert-text'}};
    ESLEventUtils.dispatch($el, ESLAlert.prototype.SHOW_REQUEST_EVENT, params);
    expect($el.className).toContain('esl-alert-cls');
  });
});
