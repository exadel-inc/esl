import {UIPDefaults} from './core/config/config';
import {registerCore} from './core/registration';
import {registerPlugins, registerSettings} from './plugins/registration';

import type {UIPDefaultConfig} from './core/config/config';

export * from './core/registration';
export * from './plugins/registration';

export function init(config?: Partial<UIPDefaultConfig>): void {
  UIPDefaults.applyDefaults(config);

  registerCore();
  registerPlugins();
  registerSettings();
}
