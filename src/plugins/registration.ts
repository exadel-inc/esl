import {UIPEditor} from './editor/editor';
import {UIPOptions} from './options/options';
import {registerSettings} from './settings/registration';

export {UIPEditor, UIPOptions, registerSettings};

export const registerPlugins = () => {
  UIPEditor.register();
  UIPOptions.register();
  registerSettings();
};