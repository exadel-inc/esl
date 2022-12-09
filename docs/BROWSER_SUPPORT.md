# Browser Support

<a name="content"></a>

Exadel Smart Library does not have dependencies but uses the following list of native browser features:

- ECMAScript 6 features
    - [Array.from](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/from) (no Iterable Objects support required)
      ([ESL polyfill](../src/polyfills/list/es6.array.from.ts) provided)
    - [Array.prototype.find](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find)
      ([ESL polyfill](../src/polyfills/list/es6.array.find.ts) provided)
    - [Array.prototype.findIndex](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/findIndex)
      ([ESL polyfill](../src/polyfills/list/es6.array.find.ts) provided)
    - [Array.prototype.include](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/includes)
      ([ESL polyfill](../src/polyfills/list/es6.array.includes.ts) provided)
    - [Object.is](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is)
      ([ESL polyfill](../src/polyfills/list/es6.object.is.ts) provided)
    - [Object.assign](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign) (accurate polyfill required)
      ([ESL polyfill](../src/polyfills/list/es6.object.assign.ts) provided)
    - [ES6 Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
- Web API
    - [Event](https://developer.mozilla.org/en-US/docs/Web/API/Event) constructor + `preventDefault` polyfill
    - [Custom Event](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent) constructor
    - [Node.isConnected](https://developer.mozilla.org/en-US/docs/Web/API/Node/isConnected)
    - [Element.matches](https://developer.mozilla.org/en-US/docs/Web/API/Element/matches)
    - [Element.closest](https://developer.mozilla.org/en-US/docs/Web/API/Element/closest)
    - [Element.toggleAttribute](https://developer.mozilla.org/en-US/docs/Web/API/Element/toggleAttribute)
    - [KeyboardEvent.key](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key)
    - [IntersectionObserver](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver)
    - [ResizeObserver](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver)
    - [Custom Elements](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements)

All of them are fully supported by modern browsers such as Chrome, Firefox, Safari or Edge (>43).

In order to make ESL work in older browsers, you can use a "light" polyfills list of IntersectionObserver, ResizeObserver and Custom Elements (for older versions of Edge and Safari).

Or make the library work in IE11 or Edge (<14) by using the "full" polyfills list provided.

See more details on what polyfill approach might look like in the demo pages source code.

Also, ESL has built-in polyfills for some of DOM and ES6 features. They are available under [polyfills](../src/polyfills) directory:
  - ECMA Script 5: output shim (`HTMLElement` constructor call) - [es5-target-shim.ts](../src/polyfills/es5-target-shim.ts)
  - ECMA Script 5: IE11, Edge <14 support - [polyfills.es5.ts](../src/polyfills/polyfills.es5.ts)
    - `Object.is`, `Object.assign` 
    - `Array.from`, `Array.prototype.find`, `Array.prototype.findIndex`, `Array.prototype.index`
    - `Event`, `CustomEvent`, `MouseEvent`, `KeyboardEvent`, `FocusEvent` shim
    - `Event.prototype.preventDefault` shim
    - `Element.prototype.closest`
    - `DOMTokenList.prototype.toggle`
    - *Note: there is no promise polyfill embedded*, use npm:[promise-polyfill](https://www.npmjs.com/package/promise-polyfill) or similar
  - ECMA Script 6: DOM - [polyfills.es6.ts](../src/polyfills/polyfills.es6.ts)
    - `Node.isConnected` 
    - `KeyboardKey.prototype.key` 
    - `Element.prototype.toggleAttribute` 
