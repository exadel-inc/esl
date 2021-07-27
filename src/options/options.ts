import {attr} from '@exadel/esl/modules/esl-base-element/core';
import {bind} from '@exadel/esl/modules/esl-utils/decorators/bind';
import {CSSClassUtils, ESLMediaQuery} from '@exadel/esl';
import {generateUId} from '@exadel/esl/modules/esl-utils/misc/uid';

import {UIPPlugin} from '../core/plugin';

export class UIPOptions extends UIPPlugin {
  static is = 'uip-options';

  @attr({defaultValue: 'vertical'}) public mode: string;
  @attr({defaultValue: 'uip-light'}) public theme: string;

  static _conditionQuery: ESLMediaQuery = new ESLMediaQuery('@-SM');

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
    const modeOptionId = generateUId();
    $mode.innerHTML = `
        <div class="option-item">
            <input type="radio" id=${modeOptionId}-vertical name=${modeOptionId}-mode mode="vertical"
            class="option-radio-btn" ${this.mode === 'vertical' ? 'checked' : ''}>
            <label class="option-label" for=${modeOptionId}-vertical>Vertical</label>
        </div>
        <div class="option-item">
            <input type="radio" id=${modeOptionId}-horizontal name=${modeOptionId}-mode mode="horizontal"
            class="option-radio-btn" ${this.mode === 'horizontal' ? 'checked' : ''}>
            <label class="option-label" for=${modeOptionId}-horizontal>Horizontal</label>
        </div>`;
    this.appendChild($mode);
  }

  protected renderTheme() {
    const $theme = document.createElement('div');
    CSSClassUtils.add($theme, 'uip-option theme');
    const themeOptionId = generateUId();
    $theme.innerHTML = `
        <div class="option-item">
            <input type="radio" id=${themeOptionId}-light name=${themeOptionId}-theme theme="uip-light"
            class="option-radio-btn" ${this.theme === 'uip-light' ? 'checked' : ''}>
            <label class="option-label" for=${themeOptionId}-light>Light</label>
        </div>
        <div class="option-item">
            <input type="radio" id=${themeOptionId}-dark name=${themeOptionId}-theme theme="uip-dark"
            class="option-radio-btn" ${this.theme === 'uip-dark' ? 'checked' : ''}>
            <label class="option-label" for=${themeOptionId}-dark>Dark</label>
        </div>`;
    this.appendChild($theme);
  }

  @bind
  protected _onOptionChange(e: Event) {
    const target = e.target as HTMLElement;

    const mode = target.getAttribute('mode');
    const theme = target.getAttribute('theme');

    if (mode) this.updateModeMarker(mode);
    if (theme) this.updateThemeMarker(theme);
  }

  protected updateModeMarker(mode: string) {
    this.mode = mode;
    if (this.root) this.root.mode = mode;
  }

  protected updateThemeMarker(theme: string) {
    this.theme = theme;
    if (this.root) this.root.theme = theme;
  }

  @bind
  protected _onResize() {
    (UIPOptions._conditionQuery.matches)
      ? this.updateModeMarker('horizontal')
      : this.updateModeMarker(this.mode);
  }
}
