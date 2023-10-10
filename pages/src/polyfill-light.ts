/**
 * Target: Edge, Safari 9
 */
import '@exadel/esl/polyfills/polyfills.es6';

// IE, Safari <13.3
import {ResizeObserver} from '@juggle/resize-observer';
// import { ResizeObserverPolyfill} from '../../src/polyfills/polyfillResizeObserver'

window.ResizeObserver = window.ResizeObserver || ResizeObserver;

// Safari <14
import SmoothScroll from 'smoothscroll-polyfill';
SmoothScroll.polyfill();
