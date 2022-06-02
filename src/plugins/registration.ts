import {UIPEditor} from './editor/editor';
import {UIPHeader} from './header/header';
import {UIPOptions} from './header/options/options';
import {UIPSnippets} from './header/snippets/snippets';
import {UIPSettings} from './settings/settings';

export {UIPEditor, UIPOptions, UIPSettings, UIPSnippets, UIPHeader};

export const registerPlugins = () => {
  UIPEditor.register();
  UIPHeader.register();
  UIPOptions.register();
  UIPSnippets.register();
  UIPSettings.register();
};
