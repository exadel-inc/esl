/** An object that relates to some DOM element e.g. controller or {@link ESLMixinElement} */
export type ESLDomElementRelated = {
  /** Related DOM element */
  $host: Element;
};

/** An {@link Element} or {@link ESLDomElementRelated} */
export type ESLDomElementTarget = Element | ESLDomElementRelated;

/** Resolves eligible object for a DOM target */
export const resolveDomTarget = (target: ESLDomElementTarget | Window): Element | Window =>
  target instanceof Window || target instanceof Element ? target : target.$host;
