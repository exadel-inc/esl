/**
 * Target: Edge, Safari 9
 */
import 'intersection-observer/intersection-observer';

// import {ResizeObserver} from '@juggle/resize-observer';
import { ResizeObserverPolyfill} from '../../src/polyfills/polyfillResizeObserver'

window.ResizeObserver = window.ResizeObserver || ResizeObserverPolyfill;

import '@webcomponents/custom-elements/custom-elements.min';
