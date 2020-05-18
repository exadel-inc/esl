// Support for ES5 bundle target
import './../polyfills/es5-target-shim';
// Builtin polyfills
import './../polyfills/polyfills.es6';

if (!('customElements' in window)) {
  throw new Error('Browser is not support customElements, load polyfills before');
}

export * from './../helpers/all';

export * from './../components/smart-image/smart-image';
export * from './../components/smart-media/smart-media';

export * from './../components/smart-carousel/smart-carousel';

export * from './../components/smart-popup/smart-popup';
export * from './../components/smart-collapsible/smart-collapsible';
export * from './../components/smart-trigger/smart-trigger';
