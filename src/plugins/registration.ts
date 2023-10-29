import {UIPCopy} from './copy/uip-copy';
import {UIPHeader} from './header/header';
import {UIPSnippets} from './header/snippets/snippets';
import {UIPEditor} from './editor/editor';
import {UIPSettings} from './settings/settings';

import {UIPSetting} from './settings/base-setting/base-setting';
import {UIPTextSetting} from './settings/text-setting/text-setting';
import {UIPSelectSetting} from './settings/select-setting/select-setting';
import {UIPBoolSetting} from './settings/bool-setting/bool-setting';
import {UIPSliderSetting} from './settings/slider-setting/slider-setting';
import {UIPThemeSwitcher} from './theme/uip-theme';
import {UIPDirSwitcher} from './direction/uip-dir';

export {UIPSetting, UIPSettings, UIPTextSetting, UIPBoolSetting, UIPSelectSetting, UIPSliderSetting};
export {UIPCopy, UIPDirSwitcher, UIPThemeSwitcher, UIPEditor, UIPSnippets, UIPHeader};

export const registerSettings = (): void => {
  UIPSettings.register();
  UIPBoolSetting.register();
  UIPTextSetting.register();
  UIPSelectSetting.register();
  UIPSliderSetting.register();
};

export const registerPlugins = (): void => {
  UIPCopy.register();
  UIPDirSwitcher.register();
  UIPThemeSwitcher.register();

  UIPHeader.register();
  UIPSnippets.register();
  UIPEditor.register();
};
