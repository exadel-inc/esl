import {UIPSetting} from '../plugins/settings/setting';
import {UIPTextSetting} from './text-setting/text-setting';
import {UIPSelectSetting} from './select-setting/select-setting';
import {UIPBoolSetting} from './bool-setting/bool-setting';
import {UIPSliderSetting} from './slider-setting/slider-setting';

export {UIPSetting, UIPTextSetting, UIPBoolSetting, UIPSelectSetting, UIPSliderSetting};

export const registerSettings = () => {
  UIPBoolSetting.register();
  UIPTextSetting.register();
  UIPSelectSetting.register();
  UIPSliderSetting.register();
};
