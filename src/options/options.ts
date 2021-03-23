import {boolAttr, attr, ESLBaseElement} from "@exadel/esl/modules/esl-base-element/core";
import {bind} from "@exadel/esl/modules/esl-utils/decorators/bind";
import {UIPEditor} from "../editor/editor";
import {CSSUtil, TraversingQuery} from "@exadel/esl";

export class UIPOptions extends ESLBaseElement {
  static is = 'uip-options';

  @boolAttr() public mode: boolean;
  @boolAttr() public theme: boolean;

  @attr({defaultValue: ''}) public target: string;
  @attr({readonly: true}) public selectedMode: string;
  @attr({readonly: true}) public selectedTheme: string;

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
    this.addEventListener('click', this._onOptionChange);
  }

  protected unbindEvents() {
    this.removeEventListener('click', this._onOptionChange);
  }

  protected render(){
    this.innerHTML = '<span class="section-name">Options:</span>';
    if (this.mode) this.renderMode();
    if (this.theme) this.renderTheme();
  }

  protected renderMode() {
    const mode = '<div class="uip-option mode">' +
      '<button class="option-item" mode="vertical">vertical</button> ' +
      '<button class="option-item" mode="horizontal">horizontal</button> ' +
      '</div>';

    const $mode = new DOMParser().parseFromString(mode, 'text/html').body;

    this.appendChild($mode);
  }

  protected renderTheme() {
    const theme =   '<div class="uip-option theme">' +
    '<button class="option-item" theme="light">light</button>' +
    '<button class="option-item" theme="dark">dark</button>' +
    '</div>';

    const $theme = new DOMParser().parseFromString(theme, 'text/html').body;

    this.appendChild($theme);
  }

  @bind
  protected _onOptionChange(e: Event) {
    const target = e.target as HTMLElement;
    if (!target) return;

    const mode = target.getAttribute('mode');
    const theme = target.getAttribute('theme');

    let $clsTarget = this.target && TraversingQuery.first(this.target, this) as HTMLElement;
    if (!$clsTarget) $clsTarget = this;
    if (mode) {
      CSSUtil.removeCls($clsTarget, 'vertical-mode');
      this.selectedMode = mode;
    }

    if (!theme) return;
    this.selectedTheme = theme;

    const $editor = this.querySelector('uip-editor') as UIPEditor;
    if (!$editor) return;
    const editorConfig = $editor.editorConfig;
    editorConfig.theme = theme === 'dark' ? 'ace/theme/tomorrow_night' : 'ace/theme/chrome';
    $editor.setEditorConfig(editorConfig);
  }
}
