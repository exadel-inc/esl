import {isElement} from '../dom/api';
import {isObject} from '../misc/object';

/** An object that relates to some DOM element e.g. controller or {@link ESLMixinElement} */
export type ESLDomElementRelated = {
  /** Related DOM element */
  $host: Element;
};

/** An {@link Element} or {@link ESLDomElementRelated} */
export type ESLDomElementTarget = Element | ESLDomElementRelated;

/** Unwraps {@link ESLDomElementTarget} to {@link Element} */
export function resolveDomTarget(obj: ESLDomElementTarget): Element;
/**
 * Resolves unknown object to {@link Element} if it is {@link ESLDomElementTarget}-like,
 * other-vice returns `null`
 */
export function resolveDomTarget(obj: unknown): Element | null;
export function resolveDomTarget(obj: unknown): Element | null {
  if (isElement(obj)) return obj;
  if (isObject(obj) && isElement(obj.$host)) return obj.$host;
  return null;
}
