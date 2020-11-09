/**
 * Target: Edge, Safari 9
 */
import 'intersection-observer/intersection-observer';

import {ResizeObserver} from '@juggle/resize-observer';
window.ResizeObserver = window.ResizeObserver || ResizeObserver;

import '@webcomponents/custom-elements/custom-elements.min';
