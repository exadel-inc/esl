import {ExportNs} from '../../esl-utils/environment/export-ns';
import {ESLBaseElement} from '../../esl-base-element/core';
import {attr, bind, boolAttr, prop} from '../../esl-utils/decorators';

@ExportNs('Avatar')
export class ESLAvatar extends ESLBaseElement {
  public static override is = 'esl-avatar';
  public static observedAttributes = ['src', 'username'];

  /** Event to dispatch on change of {@link ESLAvatar} */
  @prop('esl:avatar:changed') public AVATAR_CHANGED_EVENT: string;

  /** Source path of the avatar image */
  @attr() public src: string;
  /** The limit number of letters to be displayed in text-only mode */
  @attr({defaultValue: 2}) public abbrLength: number;
  /** Policy of loading image that is outside of the viewport */
  @attr({defaultValue: 'lazy'}) public loading: 'eager' | 'lazy';
  /** The name of the user for whom the avatar is displayed */
  @attr({defaultValue: ''}) public username: string;

  /** @readonly Marker of displaying mode with image */
  @boolAttr({readonly: true}) public withImage: boolean;
  /** @readonly Ready state marker */
  @boolAttr({readonly: true}) public ready: boolean;

  /** Gets an abbreviation to display in text-only mode and for alt property of image */
  public get abbr(): string {
    return this.username.trim()
      .split(' ')
      .filter(Boolean)
      .reduce((acc, el, index) => (index >= this.abbrLength) ? acc : acc + el.slice(0, 1), '');
  }

  protected override connectedCallback(): void {
    super.connectedCallback();
    this.init();
  }

  protected override attributeChangedCallback(attrName: string, oldVal: string, newVal: string): void {
    if (!this.connected || oldVal === newVal) return;
    this.init();
  }

  /** Initializes the avatar */
  public init(): void {
    this.buildImageContent();
    this.initA11y();
    this.$$attr('ready', true);
  }

  /** Sets initial a11y attributes */
  protected initA11y(): void {
    if (this.$$attr('title') === null) this.title = this.username;
  }

  /** Builds the image on avatar */
  protected buildImageContent(): void {
    const {abbr, loading, src} = this;
    if (!src) return this._onImageError();

    const $img = new Image();
    $img.loading = loading || 'lazy';
    $img.alt = abbr;
    $img.src = src;
    $img.onerror = this._onImageError;
    this.appendContent($img, true);
  }

  /** Builds the text on avatar */
  protected buildTextContent(): void {
    const $text = document.createElement('abbr');
    $text.textContent = this.abbr;
    this.appendContent($text, false);
  }

  /** Appends content to the component */
  protected appendContent($content: HTMLElement, isImage: boolean): void {
    this.innerHTML = '';
    $content.classList.add(`${ESLAvatar.is}-${isImage ? 'img' : 'text'}`);
    this.appendChild($content);
    this.$$attr('with-image', isImage);
    this.onChange();
  }

  /** Actions on image loading error */
  @bind
  protected _onImageError(): void {
    this.buildTextContent();
  }

  /** Actions on complete init and ready component */
  private onChange(): void {
    this.$$fire(this.AVATAR_CHANGED_EVENT, {bubbles: false});
  }
}
declare global {
  export interface ESLLibrary {
    Avatar: typeof ESLAvatar;
  }
  export interface HTMLElementTagNameMap {
    'esl-avatar': ESLAvatar;
  }
}