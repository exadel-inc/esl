import {UIPHeader} from './header/header';
import {UIPOptions} from './header/options/options';
import {UIPOptionIcons} from './header/options/OptionIcons';
import {UIPSnippets} from './header/snippets/snippets';
import {UIPEditor} from './editor/editor';
import {UIPSettings} from './settings/settings';
import {registeredSettings} from '../registration';

export {UIPOptions, UIPOptionIcons, UIPEditor, UIPSettings, UIPSnippets, UIPHeader};

export const registerPlugins = () => {
  UIPHeader.register();
  UIPOptions.register();
  UIPSnippets.register();
  UIPEditor.register();
  registeredSettings().then(() => UIPSettings.register());
};
