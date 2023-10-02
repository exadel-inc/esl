import {UIPRoot} from './base/root';
import {UIPStateModel, ChangeAttrConfig} from './base/model';
import {UIPPlugin} from './base/plugin';

import {UIPPreview} from './preview/preview';

export * from './utils/normalization';
export {UIPRoot, UIPPlugin, UIPStateModel, UIPPreview, ChangeAttrConfig};

export const registerCore = (): void => {
  UIPRoot.register();
  UIPPreview.register();
};
