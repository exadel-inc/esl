import {rafDecorator} from '../../../src/modules/esl-utils/async/raf';
import {DeviceDetector} from '../../../src/modules/esl-utils/environment/device-detector';

// TODO: move to core esl-utils/fixes
/**
 * Small utility to provide 100vw and 100vh alternative CSS Variables
 * 100vh - is a scroll independent viewport width value
 * 100vh - is a device independent viewport height value (aso known as 100vh iOS fix)
 */
export const updateViewportVariables = () => {
  const $html = document.documentElement;
  $html.style.setProperty('--100vw', `${$html.clientWidth}px`);
  $html.style.setProperty('--100vh', `${window.innerHeight}px`);
};
export const updateViewportVariablesDebounced = rafDecorator(updateViewportVariables);

export const initViewportVariables = () => {
  // IE doesn’t support CSS Variables (hopefully same as 100vh issue :D)
  if (DeviceDetector.isIE) return;

  updateViewportVariables();
  window.addEventListener('resize', updateViewportVariablesDebounced);
};
