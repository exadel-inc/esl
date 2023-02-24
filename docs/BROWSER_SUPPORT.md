# Browser Support

<a name="content"></a>

Exadel Smart Library does not have dependencies but uses the following list of native browser features:

- ECMAScript 6 features
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

See more details on what polyfill approach might look like in the demo pages source code.

Also, ESL has built-in polyfills for some of DOM and ES6 features. They are available under [polyfills](../src/polyfills) directory:
  - ECMA Script 5: output shim (`HTMLElement` constructor call) - [es5-target-shim.ts](../src/polyfills/es5-target-shim.ts)
  - ECMA Script 6: DOM - [polyfills.es6.ts](../src/polyfills/polyfills.es6.ts)
    - `Node.isConnected` 
    - `KeyboardKey.prototype.key` 
    - `Element.prototype.toggleAttribute` 
