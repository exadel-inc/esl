import {UIPSetting} from './setting/setting';
import {UIPTextSetting} from './text-setting/text-setting';
import {UIPSelectSetting} from './select-setting/select-setting';
import {UIPBoolSetting} from './bool-setting/bool-setting';

export {UIPSetting, UIPTextSetting, UIPBoolSetting, UIPSelectSetting};

export const registerSettings = () => {
  UIPBoolSetting.register();
  UIPTextSetting.register();
  UIPSelectSetting.register();
};
