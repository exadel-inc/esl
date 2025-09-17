import type {HTMLElementShape} from '../shape/html-element.shape';
import type {DOMEventsAttributesShape} from '../shape/dom-events.shape';
import type {AriaAttributesShape} from '../shape/wai-aria.shape';

/** Defines the shape of the Base Custom Element for TSX (strongly typed JSX) */
export interface ESLBaseElementShape<T> extends HTMLElementShape, DOMEventsAttributesShape<T>, AriaAttributesShape {
}

declare global {
  export interface ESLIntrinsicElements {}

  namespace JSX {
    interface IntrinsicElements extends ESLIntrinsicElements {}
  }
}
