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
  }

  protected unbindEvents() {
    this.removeEventListener('change', this._onOptionChange);
  }

  protected render() {
    this.innerHTML = '';
    this.renderTheme();
    this.renderSettingsControl();
    this.renderEditorControl();
    this.renderDirection();
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

  protected renderSettingsControl() {
    const $settings = document.createElement('div');
    CSSClassUtils.add($settings, 'uip-option');
    const settingsControlId = randUID();
    $settings.innerHTML = `
        <div class="option-item">
            <input type="checkbox" id=${settingsControlId}-settings-control name=${settingsControlId}-control
            class="option-checkbox" settings-control='settings'>
            <label class="option-label" for=${settingsControlId}-settings-control>Settings</label>
        </div>`;
    this.appendChild($settings);
  }

  protected renderEditorControl() {
    const $editor = document.createElement('div');
    CSSClassUtils.add($editor, 'uip-option');
    const editorControlId = randUID();
    $editor.innerHTML = `
        <div class="option-item">
            <input type="checkbox" id=${editorControlId}-settings-control name=${editorControlId}-control
            class="option-checkbox" editor-control='editor'>
            <label class="option-label" for=${editorControlId}-settings-control>Editor</label>
        </div>`;
    this.appendChild($editor);
  }

  protected renderDirection() {
    const $dir = document.createElement('div');
    CSSClassUtils.add($dir, 'uip-option dir');
    const dirOptionId = randUID();
    $dir.innerHTML = `
        <div class="option-item">
            <input type="radio" id=${dirOptionId}-uip-ltr name=${dirOptionId}-dir direction="ltr"
            class="option-radio-btn" ${this.root?.direction === 'ltr' ? 'checked' : ''}>
            <label class="option-label" for=${dirOptionId}-uip-ltr>LTR</label>
        </div>
        <div class="option-item">
            <input type="radio" id=${dirOptionId}-uip-rtl name=${dirOptionId}-dir direction="rtl"
            class="option-radio-btn" ${this.root?.direction === 'rtl' ? 'checked' : ''}>
            <label class="option-label" for=${dirOptionId}-uip-rtl>RTL</label>
        </div>`;
    this.appendChild($dir);
  }

  @bind
  protected _onOptionChange(e: Event) {
    const target = e.target as HTMLInputElement;

    const theme = target.getAttribute('theme');
    const settings = target.getAttribute('settings-control');
    const editor = target.getAttribute('editor-control');
    const dir = target.getAttribute('direction');

    if (this.root) {
      if (theme) this.root.theme = theme;
      if (settings) this.root.settings = target.checked ? 'collapsed' : 'expanded';
      if (editor) this.root.editor = target.checked ? 'collapsed' : 'expanded';
      if (dir) this.root.direction = dir;
    }
  }
}
