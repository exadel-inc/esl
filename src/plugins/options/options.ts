import {bind} from '@exadel/esl/modules/esl-utils/decorators/bind';
import {CSSClassUtils} from '@exadel/esl';
import {randUID} from '@exadel/esl/modules/esl-utils/misc/uid';

import {UIPPlugin} from '../../core/registration';

/**
 * Custom element to provide controls for changing UIP visual appearance.
 * @extends UIPPlugin
 */
export class UIPOptions extends UIPPlugin {
  static is = 'uip-options';

  protected connectedCallback() {
    super.connectedCallback();
    this.bindEvents();
    this.render();
  }

  protected disconnectedCallback() {
    super.disconnectedCallback();
    this.unbindEvents();
  }

  protected bindEvents() {
    this.addEventListener('change', this._onOptionChange);
    this.root?.addEventListener('uip:configchange', this._onRootConfigChange);
  }

  protected unbindEvents() {
    this.removeEventListener('change', this._onOptionChange);
    this.root?.removeEventListener('uip:configchange', this._onRootConfigChange);
  }

  protected render() {
    this.innerHTML = '';
    this.renderMode();
    this.renderTheme();
    this.renderDirection();
  }

  protected renderMode() {
    const $mode = document.createElement('div');
    CSSClassUtils.add($mode, 'uip-option mode');
    const modeOptionId = randUID();
    $mode.innerHTML = `
        <div class="option-item">
            <input type="radio" id=${modeOptionId}-vertical name=${modeOptionId}-mode mode="vertical"
            class="option-radio-btn" ${this.root?.mode === 'vertical' ? 'checked' : ''}>
            <label class="option-label" for=${modeOptionId}-vertical>Vertical</label>
        </div>
        <div class="option-item">
            <input type="radio" id=${modeOptionId}-horizontal name=${modeOptionId}-mode mode="horizontal"
            class="option-radio-btn" ${this.root?.mode === 'horizontal' ? 'checked' : ''}>
            <label class="option-label" for=${modeOptionId}-horizontal>Horizontal</label>
        </div>`;
    this.appendChild($mode);
  }

  protected renderTheme() {
    const $theme = document.createElement('div');
    CSSClassUtils.add($theme, 'uip-option theme');
    const themeOptionId = randUID();
    $theme.innerHTML = `
        <div class="option-item">
            <input type="radio" id=${themeOptionId}-uip-light name=${themeOptionId}-theme theme="uip-light"
            class="option-radio-btn" ${this.root?.theme === 'uip-light' ? 'checked' : ''}>
            <label class="option-label" for=${themeOptionId}-uip-light>Light</label>
        </div>
        <div class="option-item">
            <input type="radio" id=${themeOptionId}-uip-dark name=${themeOptionId}-theme theme="uip-dark"
            class="option-radio-btn" ${this.root?.theme === 'uip-dark' ? 'checked' : ''}>
            <label class="option-label" for=${themeOptionId}-uip-dark>Dark</label>
        </div>`;
    this.appendChild($theme);
  }

  protected renderDirection() {
    const $dir = document.createElement('div');
    CSSClassUtils.add($dir, 'uip-option dir');
    const dirOptionId = randUID();
    $dir.innerHTML = `
        <div class="option-item">
            <input type="radio" id=${dirOptionId}-uip-ltr name=${dirOptionId}-dir direction="LTR"
            class="option-radio-btn" ${this.root?.direction === 'LTR' ? 'checked' : ''}>
            <label class="option-label" for=${dirOptionId}-uip-ltr>LTR</label>
        </div>
        <div class="option-item">
            <input type="radio" id=${dirOptionId}-uip-rtl name=${dirOptionId}-dir direction="RTL"
            class="option-radio-btn" ${this.root?.direction === 'RTL' ? 'checked' : ''}>
            <label class="option-label" for=${dirOptionId}-uip-rtl>RTL</label>
        </div>`;
    this.appendChild($dir);
  }

  @bind
  protected _onOptionChange(e: Event) {
    const target = e.target as HTMLElement;

    const mode = target.getAttribute('mode');
    const theme = target.getAttribute('theme');
    const dir = target.getAttribute('direction');

    if (this.root) {
      if (mode) this.root.mode = mode;
      if (theme) this.root.theme = theme;
      if (dir) this.root.direction = dir;
    }
  }

  @bind
  protected _onRootConfigChange(e: CustomEvent) {
    this.checkMarker(e.detail.attribute, e.detail.value);
  }

  protected checkMarker(attr: string, value: string) {
    const marker = (this.querySelector(`input[${attr}="${value}"]`) || this.querySelector(`input[${attr}]`)) as HTMLInputElement;
    if (marker) marker.checked = true;
  }
}
