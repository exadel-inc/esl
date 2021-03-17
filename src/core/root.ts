import {ESLBaseElement, attr} from '@exadel/esl/modules/esl-base-element/core';
import {EventUtils} from '@exadel/esl/modules/esl-utils/dom/events';
import {bind} from '@exadel/esl/modules/esl-utils/decorators/bind';
import {UIPEditor} from "../editor/editor";

export class UIPRoot extends ESLBaseElement {
  public static is = 'uip-root';
  private _state: string;

  @attr({defaultValue: 'vertical'}) public mode: string;
  @attr({defaultValue: 'light'}) public theme: string;

  public get state() {
    return this._state;
  }

  protected connectedCallback() {
    super.connectedCallback();
    this._onResize();
    this.bindEvents();
  }

  protected disconnectedCallback() {
    this.unbindEvents();
  }

  protected bindEvents() {
    this.addEventListener('request:change', this._onStateChange);
    window.addEventListener('resize', this._onResize);

    const $options = this.querySelector('.uip-options') as HTMLElement;
    $options.addEventListener('click', this._onOptionChange);
  }

  protected unbindEvents() {
    this.removeEventListener('request:change', this._onStateChange);

    const $options = this.querySelector('.uip-options') as HTMLElement;
    $options.removeEventListener('click', this._onOptionChange);
  }

  protected _onStateChange(e: CustomEvent) {
    this._state = e.detail.markup;
    EventUtils.dispatch(this, 'state:change', {detail: e.detail});
  }

  @bind
  protected _onOptionChange(e: Event) {
    const target = e.target as HTMLElement;
    if (!target) return;

    const mode = target.getAttribute('mode');
    const theme = target.getAttribute('theme');

    if (mode) this.mode = mode;

    if (!theme) return;
    this.theme = theme;

    const $editor = this.querySelector('uip-editor') as UIPEditor;
    if (!$editor) return;
    const editorConfig = $editor.editorConfig;
    editorConfig.theme = theme === 'dark' ? 'ace/theme/tomorrow_night' : 'ace/theme/chrome';
    $editor.setEditorConfig(editorConfig);
  }

  @bind
  protected _onResize() {
    if (window.matchMedia('(max-width: 992px)').matches) {
      this.mode = 'horizontal';
    }
  }
}
