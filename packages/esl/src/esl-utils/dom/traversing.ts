import {isElement} from './api';
import type {Predicate} from '../misc/functions';

/** Checks if element matches passed selector or exact predicate function */
export const isMatches = (el: Element, matcher?: string | ((el: Element) => boolean)): boolean => {
  if (typeof matcher === 'string') return !matcher || el.matches(matcher);
  if (typeof matcher === 'function') return matcher.call(el, el);
  return typeof matcher === 'undefined';
};

/** Safely checks if the target element is within the container element */
export const isSafeContains = (container: Node | null | undefined, element: Node | null | undefined): boolean => {
  return isElement(element) && isElement(container) && container.contains(element);
};

/** Checks that `nodeA` and `nodeB` are from the same tree path */
export function isRelativeNode(nodeA: null | undefined, nodeB: Node | null | undefined): false;
/** Checks that `nodeA` and `nodeB` are from the same tree path */
export function isRelativeNode(nodeA: Node | null | undefined, nodeB: null | undefined): false;
/** Checks that `nodeA` and `nodeB` are from the same tree path */
export function isRelativeNode(nodeA: Node | null | undefined, nodeB: Node | null | undefined): boolean;
export function isRelativeNode(nodeA: Node | null | undefined, nodeB: Node | null | undefined): boolean {
  if (!isElement(nodeA) || !isElement(nodeB)) return false;
  return nodeA.contains(nodeB) || nodeB.contains(nodeA);
}

type IteratorFn = (el: Element) => Element | null;

/** Creates function that finds next dom element, that matches selector, in the sequence declared by `next` function */
export const createSequenceFinder = (next: IteratorFn, includeSelf: boolean = false) => {
  return function (base: Element, predicate: string | Predicate<Element>): Element | null {
    if (includeSelf && isMatches(base, predicate)) return base;
    for (let target: Element | null = next(base); target && target !== base; target = next(target)) {
      if (isMatches(target, predicate)) return target;
    }
    return null;
  };
};

/** @returns first matching next sibling or null*/
export const findNext = createSequenceFinder((el) => el.nextElementSibling);
/** @returns first matching previous sibling or null*/
export const findPrev = createSequenceFinder((el) => el.previousElementSibling);
/** @returns first matching parent or null*/
export const findParent = createSequenceFinder((el) => el.parentElement);
/** @returns first matching ancestor starting from passed element or null*/
export const findClosest = createSequenceFinder((el) => el.parentElement, true);
/** @returns first matching host element starting from passed element*/
export const findHost = createSequenceFinder((el) => {
  const root = el.getRootNode();
  return (root instanceof ShadowRoot) ? root.host : null;
}, true);

/** @returns Array of all matching elements in subtree or empty array */
export const findAll = (base: Element, sel: string): Element[] => {
  return sel ? Array.from(base.querySelectorAll(sel)) : [base];
};
/** @returns Array of all matching children or empty array */
export const findChildren = (base: Element, sel: string): Element[] => {
  return Array.from(base.children).filter((el: Element) => !sel || el.matches(sel));
};

/**
 * Finds closest parent node of `node` by `predicate`.
 * Optional `skipSelf` to skip initial node
 */
export const findClosestBy = (node: Node | null, predicate: (node: Node) => boolean, skipSelf = false): Node | null => {
  let current = skipSelf && node ? node.parentNode : node;
  while (current) {
    if (predicate(current)) return current;
    current = current.parentNode;
  }
  return null;
};

/**
 * Finds looped next element within parent circle
 */
export const findNextLooped =
  createSequenceFinder((el) => el.nextElementSibling || (el.parentElement && el.parentElement.firstElementChild));

/**
 * Finds looped previous element within parent circle (looped)
 */
export const findPrevLooped =
  createSequenceFinder((el) => el.previousElementSibling || (el.parentElement && el.parentElement.lastElementChild));
