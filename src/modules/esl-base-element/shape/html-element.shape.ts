/**
 * Base HTML DOM Element Shape types definitions for TSX
 * Declare base DOM HTMLElement attributes and JSX | React syntax specific features
 */
export interface HTMLElementShape {
  // Styles & Classes
  /** {@link HTMLElement.style} property/attribute accessor */
  style?: StyleInput;
  /**
   * HTML Element class attribute definition
   * @see className
   */
  class?: ClassNames;
  /** {@link HTMLElement.className} property/attribute accessor */
  className?: ClassNames;

  // Content
  /** JSX DOM {@link HTMLElement.innerHTML} property accessor */
  innerHTML?: string;
  /** JSX DOM {@link HTMLElement.innerText} property accessor */
  innerText?: string;
  /** JSX DOM {@link HTMLElement.textContent} property accessor */
  textContent?: string;

  /** JSX React {@link HTMLElement.innerHTML} accessor */
  dangerouslySetInnerHTML?: {
    __html: string;
  };

  /** {@link HTMLElement.id} JSX property */
  id?: string;
  /** {@link HTMLElement.title} JSX property */
  title?: string;
  /** {@link HTMLElement.dir} JSX property */
  dir?: string;
  /** {@link HTMLElement.lang} JSX property */
  lang?: string;
  /** {@link HTMLElement.slot} JSX property */
  slot?: string;
  /** {@link HTMLElement.hidden} JSX property */
  hidden?: boolean;
  /** {@link HTMLElement.translate} JSX property */
  translate?: 'yes' | 'no';
  /** {@link HTMLElement.tabIndex} JSX property */
  tabIndex?: number;
  /** {@link HTMLElement.accessKey} JSX property */
  accessKey?: string;
  /** {@link HTMLElement.draggable} JSX property */
  draggable?: 'true' | 'false' | boolean;
  /** {@link HTMLElement.spellcheck} JSX property */
  spellCheck?: 'true' | 'false' | boolean;
  /** {@link HTMLElement.contentEditable} JSX property */
  contentEditable?: 'inherit' | 'true' | 'false' | boolean;

  /** {@link HTMLElement.dataset} JSX property */
  dataset?: {
    [key: string]: string;
  };

  /** Allowed Children definition */
  children?: HTMLElementChildren[] | HTMLElementChildren;

  // Living Standard
  /**
   * Specify that a standard HTML element should behave like a defined custom built-in element
   * @see https://html.spec.whatwg.org/multipage/custom-elements.html#attr-is
   */
  is?: string;
}

type StyleInput = string | CSSStyleDeclaration | (string | CSSStyleDeclaration)[];
type ClassName = string | {[key: string]: boolean} | false | null | undefined | ClassName[];
type ClassNames = ClassName | DOMTokenList;

type HTMLElementChild = HTMLElementChild[] | HTMLElement | string | number | boolean | undefined | null;
export type HTMLElementChildren = HTMLElementChild | HTMLElementChild[];
