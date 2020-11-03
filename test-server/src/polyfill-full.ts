/**
 * Target: IE11, Edge < 14
 */
import 'promise-polyfill/dist/polyfill';

import './../../polyfills/polyfills.es5';

import '@webcomponents/webcomponents-platform';

import SmoothScroll from 'smoothscroll-polyfill';
SmoothScroll.polyfill();

import './polyfill-light';
