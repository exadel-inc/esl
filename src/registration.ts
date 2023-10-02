import {registerCore} from './core/registration';
import {registerPlugins} from './plugins/registration';
import {registerSettings} from './settings/registration';

export * from './core/registration';
export * from './plugins/registration';
export * from './settings/registration';

export function init(): void {
  registerCore();
  registerPlugins();
  registerSettings();
}
