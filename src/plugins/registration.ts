import {UIPCopy} from './copy/uip-copy';
import {UIPHeader} from './header/header';
import {UIPOptions} from './header/options/options';
import {UIPOptionIcons} from './header/options/option-icons';
import {UIPSnippets} from './header/snippets/snippets';
import {UIPEditor} from './editor/editor';
import {UIPSettings} from './settings/settings';

import {UIPSetting} from './settings/setting';
import {UIPTextSetting} from './settings/text-setting/text-setting';
import {UIPSelectSetting} from './settings/select-setting/select-setting';
import {UIPBoolSetting} from './settings/bool-setting/bool-setting';
import {UIPSliderSetting} from './settings/slider-setting/slider-setting';

export {UIPSetting, UIPSettings, UIPTextSetting, UIPBoolSetting, UIPSelectSetting, UIPSliderSetting};
export {UIPOptions, UIPOptionIcons, UIPEditor, UIPSnippets, UIPHeader};

export const registerSettings = (): void => {
  UIPBoolSetting.register();
  UIPTextSetting.register();
  UIPSelectSetting.register();
  UIPSliderSetting.register();
};

export const registerPlugins = (): void => {
  UIPCopy.register();
  UIPHeader.register();
  UIPOptions.register();
  UIPSnippets.register();
  UIPEditor.register();
  UIPSettings.register();
};
