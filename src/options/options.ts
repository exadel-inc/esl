import {attr} from '@exadel/esl/modules/esl-base-element/core';
import {bind} from '@exadel/esl/modules/esl-utils/decorators/bind';
import {CSSClassUtils, ESLMediaQuery} from '@exadel/esl';

import {UIPEditor} from '../editor/editor';
import {UIPPlugin} from '../core/plugin';

export class UIPOptions extends UIPPlugin {
  static is = 'uip-options';

  @attr({defaultValue: 'vertical'}) public mode: string;
  @attr({defaultValue: 'uip-light'}) public theme: string;

  static _conditionQuery: ESLMediaQuery = new ESLMediaQuery('@-SM');

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
    this.unbindEvents();
    super.disconnectedCallback();
  }

  protected handleChange() {
  }

  protected bindEvents() {
    this.addEventListener('click', this._onOptionChange);
    UIPOptions._conditionQuery.addListener(this._onResize);
  }

  protected unbindEvents() {
    this.removeEventListener('click', this._onOptionChange);
    UIPOptions._conditionQuery.removeListener(this._onResize);
  }

  protected render() {
    this.innerHTML = '';
    if (this.mode) this.renderMode();
    if (this.theme) this.renderTheme();
  }

  protected renderMode() {
    const $mode = document.createElement('div');
    CSSClassUtils.add($mode, 'uip-option mode');
    $mode.innerHTML = `
        <div class="option-item">
            <label class="option-label">
            Vertical
            <input type="radio" name="mode" mode="vertical"
            class="option-radio-btn" ${this.mode === 'vertical' ? 'checked' : ''}>
            </label>
        </div>
        <div class="option-item">
            <label class="option-label">
            Horizontal
            <input type="radio" name="mode" mode="horizontal"
            class="option-radio-btn" ${this.mode === 'horizontal' ? 'checked' : ''}>
            </label>
        </div>`;
    this.appendChild($mode);
  }

  protected renderTheme() {
    const $theme = document.createElement('div');
    CSSClassUtils.add($theme, 'uip-option theme');
    $theme.innerHTML = `
        <div class="option-item">
            <label class="option-label">
            Light
            <input type="radio" name="theme" theme="uip-light"
            class="option-radio-btn" ${this.theme === 'uip-light' ? 'checked' : ''}>
            </label>
        </div>
        <div class="option-item">
            <label class="option-label">
            Dark
            <input type="radio" name="theme" theme="uip-dark"
            class="option-radio-btn" ${this.theme === 'uip-dark' ? 'checked' : ''}>
            </label>
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
    const $editor = this.root?.querySelector(`:scope > ${UIPEditor.is}`) as UIPEditor;
    const editorConfig = $editor?.editorConfig;
    if (!$editor || !editorConfig) return;

    editorConfig.theme = theme === 'uip-dark' ? UIPOptions.darkEditorTheme : UIPOptions.lightEditorTheme;
    $editor.setEditorConfig(editorConfig);
  }

  protected updateModeMarker(mode: string) {
    this.root && CSSClassUtils.remove(this.root, 'vertical-mode horizontal-mode');
    this.root && CSSClassUtils.add(this.root, `${mode}-mode`);
  }

  protected updateThemeMarker(theme: string) {
    this.root && CSSClassUtils.remove(this.root, 'uip-light-theme uip-dark-theme');
    this.root && CSSClassUtils.add(this.root, `${theme}-theme`);
    this.changeEditorTheme(theme);
  }

  @bind
  protected _onResize() {
    (UIPOptions._conditionQuery.matches)
      ? this.updateModeMarker('horizontal')
      : this.updateModeMarker(this.mode);
  }
}
