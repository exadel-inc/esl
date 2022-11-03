import {UIPHeader} from './header/header';
import {UIPOptions} from './header/options/options';
import {UIPSnippets} from './header/snippets/snippets';
import {UIPSettings} from './settings/settings';
import {registeredSettings} from '../registration';
import {registerAsyncPlugins} from './async-plugins';

export {UIPOptions, UIPSettings, UIPSnippets, UIPHeader};

export const registerPlugins = () => {
  registerAsyncPlugins();
  UIPHeader.register();
  UIPOptions.register();
  UIPSnippets.register();
  registeredSettings().then(() => UIPSettings.register());
};
