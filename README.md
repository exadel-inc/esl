# Exadel Smart Library &#9881;

![npm](https://img.shields.io/npm/v/exadel/esl)
![version](https://img.shields.io/github/package-json/v/exadel-inc/esl)
![dependencies](https://img.shields.io/badge/dependencies-free-green)
![tests](https://github.com/exadel-inc/esl/workflows/tests/badge.svg?branch=main)
![License](https://img.shields.io/badge/license-MIT-green.svg)

Exadel Smart Library (**ESL**) is a web components based library that gives you a set of **lightweight** and **flexible** custom elements to easily create basic UX modules and make your websites super fast.

## Library Structure
### Components
- ##### [ESL Image](src/modules/esl-image/README.md)
- ##### [ESL Media](src/modules/esl-media/README.md)
- ##### [ESL Scrollbar](src/modules/esl-scrollbar/README.md)

- ##### [ESL A11yGroup](src/modules/esl-a11y-group/README.md)

- ##### [ESL Toggleable](src/modules/esl-toggleable/README.md)
- ##### [ESL Trigger](src/modules/esl-trigger/README.md)
- ##### [ESL Panel and Panel Group](src/modules/esl-panel/README.md)
- ##### [ESL Tab and Tabs](src/modules/esl-tab/README.md)
- ##### [ESL Popup](src/modules/esl-popup/README.md)
- ##### [ESL Alert](src/modules/esl-alert/README.md)

### Form Components
- ##### [ESL Select](src/modules/esl-forms/esl-select/README.md)
- ##### [ESL Select List](src/modules/esl-forms/esl-select-list/README.md)

### Utilities
- ##### [ESL Base Element](src/modules/esl-base-element/README.md)
- ##### [ESL Media Query](src/modules/esl-media-query/README.md)
- ##### [ESL Traversing Query](src/modules/esl-traversing-query/README.md)
- ##### [ESL Utils](src/modules/esl-utils/README.md)

---
## Installation Guide

0. Preconditions:
   - Make sure you have all needed polyfills to support browsers from your browser-support list. 
   See [Browser support & Polyfills](#browser-support--polyfills) for details.
   - Use bundler to build your project. Currently, only ESL modules are available for consumption.
  
1. Import Components/Modules you need.

    ```javascript
    import '@exadel/esl/modules/esl-component/core';
    ```
   - `core` module entry usually represents main part of the module;
   - include optional sub-features directly. See component's documentation for details.
    ```javascript
    import '@exadel/esl/modules/esl-media/providers/iframe-provider';
    ```
    - Some modules contain cumulative `all` entries.
    - Styles are distributed in two versions: 
      - 'ready to use' `core.css` or `core.less`
      - mixin version `core.mixin.less` for custom tagname definition

2. [Optional] Setup environment configuration, e.g. custom screen breakpoints.

    ```javascript
    import {ESLMediaBreakpoints} from '@exadel/esl/modules/esl-media-query/core';

    // define XS screen breakpoint for up to 800px screen width
    ESLMediaBreakpoints.addCustomBreakpoint('XS', 1, 800); 
    ```

3.  Register components via `register` static method call
    ```javascript
    ESLImage.register();
    ```
    *You can pass custom tag name to 'register' function, but use this option only in an exceptional situation.*

## Browser support & Polyfills

Exadel Smart Library does not have dependencies but uses the following list of native browser features:

- Ecma Script 6 features
  - [Array.from](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/from) (no Iterable Objects support required)
  - [Array.prototype.find](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find) 
  - [Array.prototype.findIndex](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/findIndex) 
  - [Array.prototype.include](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/includes)
  - [Object.is](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is)
  - [ES6 Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
- Web API
  - [Custom Events](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent)
  - [Node.isConnected](https://developer.mozilla.org/en-US/docs/Web/API/Node/isConnected)
  - [Element.matches](https://developer.mozilla.org/en-US/docs/Web/API/Element/matches)
  - [Element.closest](https://developer.mozilla.org/en-US/docs/Web/API/Element/closest)
  - [Element.toggleAttribute](https://developer.mozilla.org/en-US/docs/Web/API/Element/toggleAttribute)
  - [KeyboardEvent.key](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key)  
  - [IntersectionObserver](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver)
  - [ResizeObserver](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver)
  - [Custom Elements](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements)


All of them are fully supported by modern browsers, such as Chrome, Firefox, Safari or Edge (>43).

In order to make ESL work in older browsers you can use a "light" polyfills list of IntersectionObserver, ResizeObserver and Custom Elements
(Older versions of Edge and Safari)

Or make the library work in IE11 or Edge (<14) by using the "full" polyfills list provided.

See more details on what polyfill approach might look like in the test-server examples.

Also, ESL has built-in polyfills for some of DOM and ES6 features. They are available under [./polyfills](./src/polyfills) directory.

---

## Roadmap

- [UI Playground](https://github.com/exadel-inc/ui-playground) (_will be available soon_) demo server
- npm release
- More helpers and sugar of ESLBaseElement (event listener helpers and decorators)  
- Extension of esl-utils
- Dynamic Footnotes component
- Extension of esl-form elements (custom form base, helpers, validation and more)
- ESLCarousel component
- ESLToast component
- More components in the library

---

## Development Information for contributors

If you are a part of ESL team or want to contribute to the project
you can find useful information about the project processes and agreements here:

- #### [Development: Scripts](./docs/contribute/scripts.md)

- #### [Development: Styleguide](./docs/contribute/styleguide.md)

- #### [Development: Commit Convention](./docs/contribute/commit.md)
  
- #### [Contributor Licence Agreement](CLA.md)

---

**ESL Core Team**: [Alexey Stsefanovich](https://github.com/ala-n), [Julia Murashko](https://github.com/julia-murashko), [Yuliya Adamskaya](https://github.com/yadamskaya).

**ESL Contributors**: Aliaksandr Auseyeu, Andrey Belous, Dmytro Shovchko, Dzianis Mantsevich, Liubou Masiuk, Natallia Harshunova, Yana Bernatskaya.

**Exadel, Inc.**

[![](./docs/images/exadel-logo.png)](https://exadel.com)
