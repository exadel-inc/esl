# smart-wc-library

Custom web components library


## Browser support

Smart Library does not have dependencies but use the following list of native browser features:

- (ES6) Promises
- (ES6) Custom Events
- IntersectionObserver
- Custom Elements

All of them completely supported by modern browsers like Chrome, Firefox, Safari or Edge >43.

To make library work in older browser you can use the light polyfill for IntersectionObserver, Custom Elements
(Older versions of Edge and Safari)

Or make them work in IE11 or Edge<14 by using full polyfill with the whole list of polyfills.

See more details how the polyfilling approach might look like in the test-server example.