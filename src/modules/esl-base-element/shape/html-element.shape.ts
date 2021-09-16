/**
 * Base HTML DOM Element Shape types definitions for TSX
 * Declare base DOM HTMLElement attributes and JSX | React syntax specific features
 */
export interface HTMLElementShape {
  // Styles & Classes
  style?: StyleInput;
  class?: ClassNames;
  className?: ClassNames;

  // Content
  innerHTML?: string;
  innerText?: string;
  textContent?: string;

  // JSX specific attribute
  dangerouslySetInnerHTML?: {
    __html: string;
  };

  id?: string;
  title?: string;
  dir?: string;
  lang?: string;
  slot?: string;
  hidden?: boolean;
  translate?: 'yes' | 'no';
  placeholder?: string;
  tabIndex?: number;
  accessKey?: string;
  contextMenu?: string;
  draggable?: 'true' | 'false' | boolean;
  spellCheck?: 'true' | 'false' | boolean;
  contentEditable?: 'inherit' | 'true' | 'false' | boolean;

  // JSX DOM data attributes
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
