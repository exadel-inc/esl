import {ESLPopup} from '../core/esl-popup';
import type {Rect} from '../../esl-utils/dom/rect';

export function createPopupMock(expectedRect: Rect): ESLPopup {
  const popup = new ESLPopup();
  jest.spyOn(popup, 'getBoundingClientRect').mockImplementation(() => (expectedRect as unknown) as DOMRect);
  return popup;
}

export function createDimensional(expectedRect: Rect): HTMLElement {
  const el = document.createElement('div');
  jest.spyOn(el, 'getBoundingClientRect').mockImplementation(() => (expectedRect as unknown) as DOMRect);
  return el;
}
