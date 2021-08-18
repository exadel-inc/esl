import {registerCore} from './core/registration';
import {registerSettings} from './plugins/settings/registration';
import {UIPEditor} from './plugins/editor/editor';
import {UIPOptions} from './plugins/options/options';

export * from './core/registration';

export * from './plugins/options/options';
export * from './plugins/editor/editor';
export * from './plugins/settings/registration';

export function init() {
  registerCore();
  registerSettings();
  UIPEditor.register();
  UIPOptions.register();
}
