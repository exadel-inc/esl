# Exadel Smart Library &#9881;
<p align="center">
  <img width="300" height="300" src="https://github.com/exadel-inc/esl/blob/main/docs/images/logo.png?raw=true">
</p>

[![npm](https://img.shields.io/npm/v/@exadel/esl?style=for-the-badge)](https://www.npmjs.com/package/@exadel/esl)
[![npm Downloads](https://img.shields.io/npm/dt/@exadel/esl.svg?label=npm%20downloads&style=for-the-badge)](https://www.npmjs.com/package/@exadel/esl)
[![version](https://img.shields.io/github/package-json/v/exadel-inc/esl?style=for-the-badge)](https://github.com/exadel-inc/esl/releases/latest)
[![build](https://img.shields.io/github/workflow/status/exadel-inc/esl/validate/main?style=for-the-badge)](https://github.com/exadel-inc/esl/actions/workflows/validate.yml)
[![License](https://img.shields.io/badge/license-MIT-green.svg?style=for-the-badge)](./README.md)

Exadel Smart Library (**ESL**) is a web components based library that gives you a set of **lightweight** and **flexible** custom elements to easily create basic UX modules and make your websites super fast.

**[Demo Site](https://exadel-inc.github.io/esl/)** (*draft*)

## Library Structure
### Components
- ##### [ESL Image](https://github.com/exadel-inc/esl/blob/HEAD/src/modules/esl-image/README.md)
- ##### [ESL Media](https://github.com/exadel-inc/esl/blob/HEAD/src/modules/esl-media/README.md)
- ##### [ESL Scrollbar](https://github.com/exadel-inc/esl/blob/HEAD/src/modules/esl-scrollbar/README.md)

- ##### [ESL A11yGroup](https://github.com/exadel-inc/esl/blob/HEAD/src/modules/esl-a11y-group/README.md)

- ##### [ESL Toggleable](https://github.com/exadel-inc/esl/blob/HEAD/src/modules/esl-toggleable/README.md)
- ##### [ESL Trigger](https://github.com/exadel-inc/esl/blob/HEAD/src/modules/esl-trigger/README.md)
- ##### [ESL Panel and Panel Group](https://github.com/exadel-inc/esl/blob/HEAD/src/modules/esl-panel/README.md)
- ##### [ESL Tab and Tabs](https://github.com/exadel-inc/esl/blob/HEAD/src/modules/esl-tab/README.md)
- ##### [ESL Alert](https://github.com/exadel-inc/esl/blob/HEAD/src/modules/esl-alert/README.md)
- ##### [ESL Popup](https://github.com/exadel-inc/esl/blob/HEAD/src/modules/esl-popup/README.md) (beta)

### Form Components
- ##### [ESL Select](https://github.com/exadel-inc/esl/blob/HEAD/src/modules/esl-forms/esl-select/README.md)
- ##### [ESL Select List](https://github.com/exadel-inc/esl/blob/HEAD/src/modules/esl-forms/esl-select-list/README.md)

### Utilities
- ##### [ESL Base Element](https://github.com/exadel-inc/esl/blob/HEAD/src/modules/esl-base-element/README.md)
- ##### [ESL Media Query](https://github.com/exadel-inc/esl/blob/HEAD/src/modules/esl-media-query/README.md)
- ##### [ESL Traversing Query](https://github.com/exadel-inc/esl/blob/HEAD/src/modules/esl-traversing-query/README.md)
- ##### [ESL Utils](https://github.com/exadel-inc/esl/blob/HEAD/src/modules/esl-utils/README.md)

---
## Installation Guide

0. Preconditions:
   - Make sure you have all needed polyfills to support browsers from your browser-support list. 
   See [Browser support & Polyfills](#browser-support--polyfills) for details.
   - Use bundler to build your project. Currently, only ES6 modules are available for consumption.

1. Install [esl npm dependency](https://www.npmjs.com/package/@exadel/esl)
    ```
    npm i @exadel/esl --save
    ```

2. Import Components/Modules you need.

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

3. [Optional] Setup environment configuration, e.g. custom screen breakpoints.

    ```javascript
    import {ESLScreenBreakpoints} from '@exadel/esl/modules/esl-media-query/core';

    // define XS screen breakpoint for up to 800px screen width
    ESLScreenBreakpoints.addCustomBreakpoint('XS', 1, 800); 
    ```

4.  Register components via `register` static method call
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

Also, ESL has built-in polyfills for some of DOM and ES6 features. They are available under [./polyfills](https://github.com/exadel-inc/esl/blob/HEAD/src/polyfills) directory.

---

## Roadmap
- Interactive Documentation + demo site redesign
- ESL Carousel component
- [UI Playground](https://github.com/exadel-inc/ui-playground) integration to demo site
- More helpers and sugar of ESLBaseElement (event listener helpers and decorators)
- Stable version of ESL Footnotes and ESL Popup components
- Extension of esl-form elements (custom form base, helpers, validation and more)
- Anchor Navigation component  
- ESLToast component
- More components in the library

---

## Development Information for contributors

If you are a part of ESL team or want to contribute to the project
you can find useful information about the project processes and agreements here:

- #### [Development: Scripts](https://github.com/exadel-inc/esl/blob/HEAD/docs/contribute/scripts.md)

- #### [Development: Styleguide](https://github.com/exadel-inc/esl/blob/HEAD/docs/contribute/styleguide.md)

- #### [Development: Commit Convention](https://github.com/exadel-inc/esl/blob/HEAD/docs/contribute/commit.md)

- #### [Development: Pages](https://github.com/exadel-inc/esl/blob/HEAD/docs/contribute/pages.md)

- #### [Branches Flow](https://github.com/exadel-inc/esl/blob/HEAD/docs/contribute/branches.md)
  
- #### [Contributor Licence Agreement](https://github.com/exadel-inc/esl/blob/HEAD/CLA.md)

---

**ESL Core Team**: 
[Alexey Stsefanovich](https://github.com/ala-n), 
[Julia Murashko](https://github.com/julia-murashko), 
[Yuliya Adamskaya](https://github.com/yadamskaya),
[Dmytro Shovchko](https://github.com/dshovchko),
[Anna Barmina](https://github.com/abarmina).

**ESL Contributors**: 
[Aliaksandr Auseyeu](https://github.com/alexanderavseev),
[Anna-Mariia Petryk](https://github.com/Anna-MariiaPetryk),
[Anastasiya Lesun](https://github.com/NastaLeo),
[Andrey Belous](https://github.com/andreybelous),
[Dzianis Mantsevich](https://github.com/dmantsevich), 
[Liubou Masiuk](https://github.com/liubou-masiuk), 
[Natallia Harshunova](https://github.com/nattallius), 
[Yana Bernatskaya](https://github.com/YanaBr).

**Exadel, Inc.**

[![](./docs/images/exadel-logo.png)](https://exadel.com)
