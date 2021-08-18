import {UIPSetting} from './settings/setting/setting';
import {UIPSettings} from './settings/settings';
import {UIPTextSetting} from './settings/setting/text-setting/text-setting';
import {UIPSelectSetting} from './settings/setting/select-setting/select-setting';
import {UIPBoolSetting} from './settings/setting/bool-setting/bool-setting';

export {UIPSetting, UIPSettings, UIPTextSetting, UIPBoolSetting, UIPSelectSetting};

export const registerSettings = () => {
  UIPSettings.register();
  UIPBoolSetting.register();
  UIPTextSetting.register();
  UIPSelectSetting.register();
};
