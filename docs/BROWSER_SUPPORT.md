# Browser Support

<a name="content"></a>

Exadel Smart Library does not have dependencies but uses the following list of native browser features:

- ECMAScript 6 features
    - [Array.from](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/from) (no Iterable Objects support required)
    - [Array.prototype.find](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find)
    - [Array.prototype.findIndex](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/findIndex)
    - [Array.prototype.include](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/includes)
    - [Object.is](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is)
    - [Object.assign](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign) (accurate polyfill required)
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

All of them are fully supported by modern browsers such as Chrome, Firefox, Safari (>13) or Edge (>43).

In order to make ESL work in older browsers, you can use polyfill (for older versions of Safari).
