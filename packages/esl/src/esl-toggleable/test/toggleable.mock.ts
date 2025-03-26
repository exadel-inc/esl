import {ESLEventUtils} from '../../esl-utils/dom/events';
import type {ESLToggleable} from '../core';

export function createToggleableMock(init: Partial<ESLToggleable> = {}): ESLToggleable {
  const et = document.createElement('div');
  return Object.assign(et, {
    show: jest.fn(function () {
      this.open = true;
      ESLEventUtils.dispatch(this, 'esl:show');
    }),
    hide: jest.fn(function () {
      this.open = false;
      ESLEventUtils.dispatch(this, 'esl:hide');
    }),
    open: false
  }, init) as any;
}
