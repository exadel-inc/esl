import {UIPRoot} from './base/root';
import {UIPStateModel, ChangeAttrConfig} from './base/model';
import {UIPPlugin} from './base/plugin';

import {UIPPreview} from './preview/preview';
import {UIPSnippets} from '../plugins/header/snippets/snippets';
import {UIPHeader} from '../plugins/header/header';

export {UIPRoot, UIPPlugin, UIPStateModel, UIPPreview, UIPSnippets, UIPHeader, ChangeAttrConfig};

export const registerCore = () => {
  UIPRoot.register();
  UIPHeader.register();
  UIPPreview.register();
  UIPSnippets.register();
};
