import {registerCore} from './core/registration';
import {registerPlugins} from './plugins/registration';

export * from './core/registration';
export * from './plugins/registration';

export function init() {
  registerCore();
  registerPlugins();
}
