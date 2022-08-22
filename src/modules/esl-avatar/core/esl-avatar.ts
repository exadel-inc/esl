import {ExportNs} from '../../esl-utils/environment/export-ns';
import {attr, ESLBaseElement} from '../../esl-base-element/core';
import {bind} from '../../esl-utils/decorators/bind';

@ExportNs('Avatar')
export class ESLAvatar extends ESLBaseElement {
  public static is = 'esl-avatar';
  public static observedAttributes = ['username', 'image-url'];

  /** The name of the user for whom the avatar is displayed */
  @attr() public username: string;
  /** URL of the avatar image */
  @attr() public imageUrl: string;

  public set image(val: string) {
    this.innerHTML = '';
    const $img = document.createElement('esl-image');
    $img.src = val;
    $img.mode = 'cover';
    $img.containerClass = 'with-image';
    $img.containerClassState = 'loaded';
    this.appendChild($img);
    $img.$$on('error', this._onImageError);
  }

  public set text(val: string) {
    this.innerHTML = '';
    const $text = document.createElement('div');
    $text.classList.add(`${ESLAvatar.is}-text`);
    $text.textContent = val;
    this.appendChild($text);
  }

  protected connectedCallback(): void {
    super.connectedCallback();
    this.update();
  }

  protected attributeChangedCallback(attrName: string, oldVal: string, newVal: string): void {
    if (!this.connected || oldVal === newVal) return;
    this.update();
  }

  protected updateText(): void {
    const username = this.username || '';
    this.text = username.trim()
      .split(' ')
      .reduce((acc, el, index) => (index > 1) ? acc : acc + el.slice(0, 1), '');
  }

  protected update(): void {
    if (this.imageUrl) {
      this.image = this.imageUrl;
    } else {
      this.updateText();
    }
  }

  @bind
  protected _onImageError(): void {
    this.updateText();
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
