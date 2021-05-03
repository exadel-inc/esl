import {attr} from '@exadel/esl/modules/esl-base-element/core';
import {bind} from '@exadel/esl/modules/esl-utils/decorators/bind';
import {UIPEditor} from '../editor/editor';
import {CSSClassUtils, ESLMediaQuery} from '@exadel/esl';
import {UIPPlugin} from '../core/plugin';

export class UIPOptions extends UIPPlugin {
  static is = 'uip-options';

  @attr({defaultValue: 'vertical'}) public mode: string;
  @attr({defaultValue: 'light'}) public theme: string;

  @attr({defaultValue: ''}) public target: string;

  private _conditionQuery: ESLMediaQuery | null = new ESLMediaQuery('@-SM');

  static darkEditorTheme = 'ace/theme/tomorrow_night';
  static lightEditorTheme = 'ace/theme/chrome';

  protected connectedCallback() {
    super.connectedCallback();

    this.bindEvents();
    this.render();

    this.updateModeMarker(this.mode);
    this.updateThemeMarker(this.theme);
    this._onResize();
  }

  protected disconnectedCallback() {
    super.disconnectedCallback();
    this.unbindEvents();
  }

  protected handleChange() {}

  protected bindEvents() {
    this.addEventListener('click', this._onOptionChange);
    window.addEventListener('resize', this._onResize);
  }

  protected unbindEvents() {
    this.removeEventListener('click', this._onOptionChange);
    window.removeEventListener('resize', this._onResize);
  }

  protected render() {
    if (this.mode) this.renderMode();
    if (this.theme) this.renderTheme();
  }

  protected renderMode() {
    const $mode = document.createElement('div');
    $mode.classList.add('uip-option');
    $mode.classList.add('mode');
    $mode.innerHTML = `
        <div class="option-item">
            <input type="radio" id="vertical-mode" mode="vertical" class="option-radio-btn">
            <label for="vertical-mode" class="option-label">Vertical</label>
        </div>
        <div class="option-item">
            <input type="radio" id="horizontal-mode" mode="horizontal" class="option-radio-btn">
            <label for="horizontal-mode" class="option-label">Horizontal</label>
        </div>`;
    this.appendChild($mode);
  }

  protected renderTheme() {
    const $theme = document.createElement('div');
    $theme.classList.add('uip-option');
    $theme.classList.add('theme');
    $theme.innerHTML = `
        <div class="option-item">
            <input type="radio" id="light-theme" theme="light" class="option-radio-btn">
            <label for="light-theme" class="option-label">Light</label>
        </div>
        <div class="option-item">
            <input type="radio" id="dark-theme" theme="dark" class="option-radio-btn">
            <label for="dark-theme" class="option-label">Dark</label>
        </div>`;
    this.appendChild($theme);
  }

  @bind
  protected _onOptionChange(e: Event) {
    const target = e.target as HTMLElement;

    if (!target || target.classList.value !== 'option-radio-btn') return;

    const mode = target.getAttribute('mode');
    const theme = target.getAttribute('theme');

    if (mode) {
      this.mode = mode;
      this.updateModeMarker(this.mode);
    }

    if (theme) {
      this.theme = theme;
      this.updateThemeMarker(this.theme);
    }
  }

  protected changeEditorTheme(theme: string) {
    const $editor = this.root?.querySelector(`${UIPEditor.is}`) as UIPEditor;
    if (!$editor) return;
    const editorConfig = $editor.editorConfig;
    editorConfig.theme = theme === 'dark' ? UIPOptions.darkEditorTheme : UIPOptions.lightEditorTheme;
    $editor.setEditorConfig(editorConfig);
  }

  protected updateModeMarker(mode: string) {
    this.root && CSSClassUtils.remove(this.root, 'vertical-mode horizontal-mode');
    this.root && CSSClassUtils.add(this.root, `${mode}-mode`);
  }

  protected updateThemeMarker(theme: string) {
    this.root && CSSClassUtils.remove(this.root, 'light-theme dark-theme');
    this.root && CSSClassUtils.add(this.root, `${theme}-theme`);
    this.changeEditorTheme(theme);
  }

  @bind
  protected _onResize() {
    (this._conditionQuery?.matches)
      ? this.updateModeMarker('horizontal')
      : this.updateModeMarker(this.mode);
  }
}
