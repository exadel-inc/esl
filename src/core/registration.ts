import {UIPRoot} from './base/root';
import {UIPStateModel, ChangeAttrConfig} from './base/model';
import {UIPPlugin} from './base/plugin';

import {UIPPreview} from './preview/preview';

export {UIPRoot, UIPPlugin, UIPStateModel, UIPPreview, ChangeAttrConfig};

export * from './processors/normalization';
export * from './processors/rendering';
export * from './processors/templates';

export const registerCore = (): void => {
  UIPRoot.register();
  UIPPreview.register();
};
