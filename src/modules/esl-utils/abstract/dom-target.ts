/** An object that relates to some DOM element e.g. controller or {@link ESLMixinElement} */
export type ESLDomElementRelated = {
  /** Related DOM element */
  $host: Element;
};

/** An {@link Element} or {@link ESLDomElementRelated} */
export type ESLDomElementTarget = Element | ESLDomElementRelated;
