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

You can visit our **[Demo Site](https://esl-ui.com/)**.

<p align="center" >★ <b>Try out our open library and if you like it please support us with a star on GitHub</b> ★</p>

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
<a name="instalation_guide"></a>

0. Preconditions:
   - Make sure you have all needed polyfills to support browsers from your browser-support list. 
   See [Browser support & Polyfills](https://github.com/exadel-inc/esl/blob/HEAD/docs/BROWSER_SUPPORT.md) for details.
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

---
## Roadmap
<a name="roadmap"></a>

- ESL Carousel component
- ESL Animate service
- Sharable assets from demo site (styles components)
- Interactive Documentation and more demo site features
- Demo pages [UI Playground](https://github.com/exadel-inc/ui-playground) integration
- More helpers and sugar of ESLBaseElement (event listener helpers and decorators)
- Stable version of ESL Footnotes and ESL Popup components
- Extension of esl-form elements (custom form base, helpers, validation and more)
- Anchor Navigation component
- More components in the library

<a name="roadmap_end"></a>

---
<a name="contributing"></a>

## Development Information for contributors

If you are a part of ESL team or want to contribute to the project
you can find useful information about the project processes and agreements here:

- #### [🔗 Contribution Guide](https://github.com/exadel-inc/esl/blob/HEAD/CONTRIBUTING.md)

- #### [🔗 Development Guide](https://github.com/exadel-inc/esl/blob/HEAD/docs/DEVELOPMENT.md)

- #### [🔗 Contributor Licence Agreement](https://github.com/exadel-inc/esl/blob/HEAD/CLA.md)

---
<a name="team"></a>

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
[Feoktyst Shovchko](https://github.com/fshovchko), 
[Liubou Masiuk](https://github.com/liubou-masiuk), 
[Natallia Harshunova](https://github.com/nattallius), 
[Yana Bernatskaya](https://github.com/YanaBr).

**Exadel, Inc.**

[![](./docs/images/exadel-logo.png)](https://exadel.com)
