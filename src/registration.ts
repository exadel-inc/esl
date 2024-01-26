import {registerCore} from './core/registration';
import {registerPlugins, registerSettings} from './plugins/registration';

export * from './core/registration';
export * from './plugins/registration';

export function init(): void {
  registerCore();
  registerPlugins();
  registerSettings();
}
