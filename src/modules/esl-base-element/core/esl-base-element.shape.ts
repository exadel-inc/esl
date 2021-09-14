import type {HTMLElementShape} from '../shape/html-element.shape';
import type {DOMEventsAttributesShape} from '../shape/dom-events.shape';
import type {AriaAttributesShape} from '../shape/wai-aria.shape';

/**
 * Base Custom Element shape definition to be correctly handled by TSX (Strict Typed JSX)
 */
export interface ESLBaseElementShape<T> extends HTMLElementShape, DOMEventsAttributesShape<T>, AriaAttributesShape {
}
