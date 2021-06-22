import {UIPRoot} from './core/root';
import {UIPEditor} from './editor/editor';
import {UIPPreview} from './preview/preview';
import {UIPSettings} from './settings/settings';
import {UIPTextSetting} from './settings/setting/text-setting/text-setting';
import {UIPSelectSetting} from './settings/setting/select-setting/select-setting';
import {UIPBoolSetting} from './settings/setting/bool-setting/bool-setting';
import {UIPSnippets} from './snippets/snippets';
import {UIPOptions} from './options/options';
import {ESLSelect} from '@exadel/esl';
import {ESLScrollbar} from '@exadel/esl/modules/esl-scrollbar/core';

export {
  UIPRoot,
  UIPEditor,
  UIPPreview,
  UIPSettings,
  UIPTextSetting,
  UIPSelectSetting,
  UIPBoolSetting,
  UIPSnippets,
  UIPOptions
};

export function init() {
  UIPRoot.register();
  UIPEditor.register();
  UIPPreview.register();
  UIPSettings.register();
  UIPTextSetting.register();
  UIPBoolSetting.register();
  UIPOptions.register();
  ESLSelect.register();
  ESLScrollbar.register();
  customElements.whenDefined(ESLSelect.is).then(() => UIPSelectSetting.register());
  customElements.whenDefined(UIPRoot.is).then(() => UIPSnippets.register());
}
