# Exadel Smart Library (ESL) &#9881;

ESL is a web components based library that gives you a set of **lightweight**
and **flexible** custom elements to make basic UX modules fast and leave your sites super performable.

### Components
- ##### [ESL Image](./src/modules/esl-image/README.md)
- ##### [ESL Media](./src/modules/esl-media/README.md)
- ##### [ESL Scrollbar](./src/modules/esl-scrollbar/README.md)
- TBD: Popups category

### Utilities
- ##### [ESL Base Element](./src/modules/esl-base-element/README.md)
- ##### ESL Utils
  - TBD

---

## Browser support & Polyfills

Exadel Smart Library does not have dependencies but use the following list of native browser features:

- Ecma Script 6 features
  - [Array.from](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Array/from) (no Iterable Objects support required)
  - [Array.prototype.find](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Array/find) 
  - [Array.prototype.findIndex](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Array/findIndex) 
  - [Object.is](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Object/is)
  - [ES6 Promises](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Promise)
- Web API
  - [Custom Events](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent)
  - [Node.isConnected](https://developer.mozilla.org/en-US/docs/Web/API/Node/isConnected)
  - [Element.matches](https://developer.mozilla.org/ru/docs/Web/API/Element/matches)
  - [Element.closest](https://developer.mozilla.org/ru/docs/Web/API/Element/closest)
  - [Element.toggleAttribute](https://developer.mozilla.org/en-US/docs/Web/API/Element/toggleAttribute)
  - [IntersectionObserver](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver)
  - [ResizeObserver](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver)
  - [Custom Elements](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements)


All of them completely supported by modern browsers like Chrome, Firefox, Safari or Edge (>43).

To ESL work in older browser you can use the light polyfills list for IntersectionObserver, ResizeObserver and Custom Elements
(Older versions of Edge and Safari)

Or make them work in IE11 or Edge (<14) using full polyfills list provided.

See more details how the polyfilling approach might look like in the test-server examples.

Also, the library built-in polyfills for some of DOM and ES6 features available under [./polyfills](./src/polyfills) directory.
