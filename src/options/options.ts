import {bind} from '@exadel/esl/modules/esl-utils/decorators/bind';
import {CSSClassUtils, ESLMediaQuery} from '@exadel/esl';
import {generateUId} from '@exadel/esl/modules/esl-utils/misc/uid';

import {UIPPlugin} from '../core/plugin';

export class UIPOptions extends UIPPlugin {
  static is = 'uip-options';

  private _mode: string;
  private _theme: string;
  
  static _conditionQuery: ESLMediaQuery = new ESLMediaQuery('@-SM');

  protected connectedCallback() {
    super.connectedCallback();
    this.bindEvents();

    if (this.root) {
      this._mode = this.root.mode;
      this._theme = this.root.theme;
    }
    this.render();

    this.updateModeMarker(this._mode);
    this.updateThemeMarker(this._theme);
    this._onResize();
  }

  protected disconnectedCallback() {
    super.disconnectedCallback();
    this.unbindEvents();
  }

  protected bindEvents() {
    this.addEventListener('click', this._onOptionChange);
    UIPOptions._conditionQuery.addListener(this._onResize);
    this.root?.addEventListener('uip:configchange', this._onRootConfigChange);
  }

  protected unbindEvents() {
    this.removeEventListener('click', this._onOptionChange);
    UIPOptions._conditionQuery.removeListener(this._onResize);
    this.root?.removeEventListener('uip:configchange', this._onRootConfigChange);
  }

  protected render() {
    this.innerHTML = '';
    if (this._mode) this.renderMode();
    if (this._theme) this.renderTheme();
  }

  protected renderMode() {
    const $mode = document.createElement('div');
    CSSClassUtils.add($mode, 'uip-option mode');
    const modeOptionId = generateUId();
    $mode.innerHTML = `
        <div class="option-item">
            <input type="radio" id=${modeOptionId}-vertical name=${modeOptionId}-mode mode="vertical"
            class="option-radio-btn ${this._mode === 'vertical' ? 'checked' : ''}">
            <label class="option-label" for=${modeOptionId}-vertical>Vertical</label>
        </div>
        <div class="option-item">
            <input type="radio" id=${modeOptionId}-horizontal name=${modeOptionId}-mode mode="horizontal"
            class="option-radio-btn ${this._mode === 'horizontal' ? 'checked' : ''}">
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
            <input type="radio" id=${themeOptionId}-uip-light name=${themeOptionId}-theme theme="uip-light"
            class="option-radio-btn ${this._theme === 'uip-light' ? 'checked' : ''}">
            <label class="option-label" for=${themeOptionId}-uip-light>Light</label>
        </div>
        <div class="option-item">
            <input type="radio" id=${themeOptionId}-uip-dark name=${themeOptionId}-theme theme="uip-dark"
            class="option-radio-btn ${this._theme === 'uip-dark' ? 'checked' : ''}">
            <label class="option-label" for=${themeOptionId}-uip-dark>Dark</label>
        </div>`;
    this.appendChild($theme);
  }

  @bind
  protected _onOptionChange(e: Event) {
    const target = e.target as HTMLElement;

    const mode = target.getAttribute('mode');
    const theme = target.getAttribute('theme');

    if (mode) {
      this._mode = mode;
      this.updateModeMarker(mode);
    }

    if (theme) {
      this._theme = theme;
      this.updateThemeMarker(theme);
    }
  }

  @bind
  protected _onRootConfigChange(e: CustomEvent) {
    this.checkMarker(e.detail.attribute, e.detail.value);
  }

  protected updateModeMarker(mode: string) {
    this.checkMarker('mode', mode);
    if (this.root) this.root.mode = mode;
  }

  protected updateThemeMarker(theme: string) {
    this.checkMarker('theme', theme);
    if (this.root) this.root.theme = theme;
  }

  protected checkMarker(option: string, value: string) {
    const optionList = this.querySelector(`.uip-option.${option}`);
    optionList?.querySelectorAll('.option-radio-btn').forEach( marker => {
      marker.id.includes(value) ? marker.classList.add('checked') : marker.classList.remove('checked');
    });
  }

  @bind
  protected _onResize() {
    (UIPOptions._conditionQuery.matches)
      ? this.updateModeMarker('horizontal')
      : this.updateModeMarker(this._mode);
  }
}
