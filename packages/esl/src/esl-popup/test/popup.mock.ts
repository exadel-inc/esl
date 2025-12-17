import {ESLPopup} from '../core/esl-popup';
import type {Rect} from '../../esl-utils/dom/rect';

export function createPopupMock(expectedRect: Rect): ESLPopup {
  const popup = new ESLPopup();
  vi.spyOn(popup, 'getBoundingClientRect').mockImplementation(function () { return (expectedRect as unknown) as DOMRect; });
  return popup;
}

export function createDimensional(expectedRect: Rect): HTMLElement {
  const el = document.createElement('div');
  vi.spyOn(el, 'getBoundingClientRect').mockImplementation(function () { return (expectedRect as unknown) as DOMRect; });
  return el;
}
