/**
 * Target: IE11, Edge < 14
 */
import 'promise-polyfill/dist/polyfill'

import './../../polyfills/polyfills.es5';

import '@webcomponents/webcomponents-platform';

// @ts-ignore
import smoothscroll from 'smoothscroll-polyfill';
smoothscroll.polyfill();

import './polyfill-light';
