import {UIPEditor} from './editor/editor';
import {UIPOptions} from './options/options';
import {UIPSettings} from './settings/settings';

export {UIPEditor, UIPOptions, UIPSettings};

export const registerPlugins = () => {
  UIPEditor.register();
  UIPOptions.register();
  UIPSettings.register();
};
