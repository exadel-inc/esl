# Exadel Smart Library (ESL) &#9881;

ESL is a web components based library that gives you a set of **lightweight**
and **flexible** custom elements to make basic UX modules fast and leave your sites super performable.

---

## Browser support

Exadel Smart Library does not have dependencies but use the following list of native browser features:

- (ES6) Array.from, Array.prototype.find, Array.prototype.findIndex, Object.is
- (ES6) Promises
- (DOM) Custom Events
- (DOM) Node.isConnected, Element.closest, Element.toggleAttribute
- IntersectionObserver
- Custom Elements

All of them completely supported by modern browsers like Chrome, Firefox, Safari or Edge >43.

To make library work in older browser you can use the light polyfill for IntersectionObserver, Custom Elements
(Older versions of Edge and Safari)

Or make them work in IE11 or Edge<14 by using full polyfill with the whole list of polyfills.

See more details how the polyfilling approach might look like in the test-server example.

Builtin polyfills for DOM and ES6 features available under polyfills directory.
