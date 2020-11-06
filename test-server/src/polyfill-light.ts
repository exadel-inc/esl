/**
 * Target: Edge, Safari 9
 */
import 'intersection-observer/intersection-observer';
import {ResizeObserver} from '@juggle/resize-observer';

if ('ResizeObserver' in window) {
  (window as any).ResizeObserver = ResizeObserver;
}

import '@webcomponents/custom-elements/custom-elements.min';
