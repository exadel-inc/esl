import {ExportNs} from '../../esl-utils/environment/export-ns';
import {ESLBaseElement} from '../../esl-base-element/core';
import {attr, bind, boolAttr, prop} from '../../esl-utils/decorators';

@ExportNs('Avatar')
export class ESLAvatar extends ESLBaseElement {
  public static override is = 'esl-avatar';
  public static observedAttributes = ['image-url', 'username'];

  /** Event to dispatch on change of {@link ESLAvatar} */
  @prop('esl:avatar:changed') public AVATAR_CHANGED_EVENT: string;

  /** URL of the avatar image */
  @attr() public imageUrl: string;
  /** Policy of loading image that is outside of the viewport */
  @attr({defaultValue: 'lazy'}) public loading: 'eager' | 'lazy';
  /** The name of the user for whom the avatar is displayed */
  @attr({defaultValue: ''}) public username: string;

  /** @readonly Marker of displaying mode with image */
  @boolAttr({readonly: true}) public withImg: boolean;
  /** @readonly Marker of displaying mode without image, only text */
  @boolAttr({readonly: true}) public textOnly: boolean;

  /** @readonly Ready state marker */
  @boolAttr({readonly: true}) public ready: boolean;

  /** Gets a text to display in text-only mode and for alt property of image */
  public get text(): string {
    return this.username.trim()
      .split(' ')
      .filter(Boolean)
      .reduce((acc, el, index) => (index > 1) ? acc : acc + el.slice(0, 1), '');
  }

  protected override connectedCallback(): void {
    super.connectedCallback();
    this.init();
  }

  protected override attributeChangedCallback(attrName: string, oldVal: string, newVal: string): void {
    if (!this.connected || oldVal === newVal) return;
    this.init(true);
  }

  /** Initializes the avatar */
  public init(force?: boolean): void {
    if (this.ready && !force) return;
    this.buildImageContent();
    this.onReady();
  }

  /** Builds the image on avatar */
  protected buildImageContent(): void {
    const {imageUrl} = this;
    if (!imageUrl) return this._onImageError();

    const $img = new Image();
    $img.loading = this.loading || 'lazy';
    $img.alt = this.text;
    $img.src = imageUrl;
    $img.onerror = this._onImageError;
    this.appendContent($img, true);
  }

  /** Builds the text on avatar */
  protected buildTextContent(): void {
    const $text = document.createElement('div');
    $text.textContent = this.text;
    this.appendContent($text, false);
  }

  /** Appends content to the component */
  protected appendContent($content: HTMLElement, isImage: boolean): void {
    this.innerHTML = '';
    $content.classList.add(`${ESLAvatar.is}-${isImage ? 'img' : 'text'}`);
    this.appendChild($content);
    this.$$attr('with-img', isImage);
    this.$$attr('text-only', !isImage);
  }

  /** Actions on image loading error */
  @bind
  protected _onImageError(): void {
    this.buildTextContent();
  }

  /** Actions on complete init and ready component */
  private onReady(): void {
    this.$$attr('ready', true);
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
