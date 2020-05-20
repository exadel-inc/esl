// Support for ES5 bundle target
import './../polyfills/es5-target-shim';
// Builtin polyfills
import './../polyfills/polyfills.es6';

if (!('customElements' in window)) {
  throw new Error('Browser is not support customElements, load polyfills before');
}

export * from './../core/all';

export * from './smart-image/smart-image';
export * from './smart-media/smart-media';

export * from './smart-carousel/smart-carousel';

export * from './smart-popup/smart-popup';
export * from './smart-collapsible/smart-collapsible';
export * from './smart-trigger/smart-trigger';
