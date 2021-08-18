import {UIPRoot} from './base/root';
import {UIPStateModel, ChangeAttrConfig} from './base/model';
import {UIPPlugin} from './base/plugin';

import {UIPPreview} from './preview/preview';
import {UIPSnippets} from './snippets/snippets';

export {UIPRoot, UIPPlugin, UIPStateModel, UIPPreview, UIPSnippets, ChangeAttrConfig};

export const registerCore = () => {
  UIPRoot.register();
  UIPPreview.register();
  UIPSnippets.register();
};
