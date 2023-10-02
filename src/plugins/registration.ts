import {registeredSettings} from '../settings/registration';

import {UIPHeader} from './header/header';
import {UIPOptions} from './header/options/options';
import {UIPOptionIcons} from './header/options/option-icons';
import {UIPSnippets} from './header/snippets/snippets';
import {UIPEditor} from './editor/editor';
import {UIPSettings} from './settings/settings';

export {UIPOptions, UIPOptionIcons, UIPEditor, UIPSettings, UIPSnippets, UIPHeader};

export const registerPlugins = (): void => {
  UIPHeader.register();
  UIPOptions.register();
  UIPSnippets.register();
  UIPEditor.register();
  registeredSettings().then(() => UIPSettings.register());
};
