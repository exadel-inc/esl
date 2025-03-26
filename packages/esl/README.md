# Exadel Smart Library
<p align="center">
  <img width="300" height="300" src="https://github.com/exadel-inc/esl/blob/main/docs/images/logo.png?raw=true">
</p>

[![npm](https://img.shields.io/npm/v/@exadel/esl?style=for-the-badge)](https://www.npmjs.com/package/@exadel/esl)
[![npm Downloads](https://img.shields.io/npm/dt/@exadel/esl.svg?label=npm%20downloads&style=for-the-badge)](https://www.npmjs.com/package/@exadel/esl)
[![version](https://img.shields.io/github/lerna-json/v/exadel-inc/esl?style=for-the-badge)](https://github.com/exadel-inc/esl/releases/latest)
[![build](https://img.shields.io/github/actions/workflow/status/exadel-inc/esl/validate.yml?style=for-the-badge)](https://github.com/exadel-inc/esl/actions/workflows/validate.yml)
[![Tests Coverage](https://img.shields.io/codeclimate/coverage/exadel-inc/esl?style=for-the-badge)](https://codeclimate.com/github/exadel-inc/esl)
[![License](https://img.shields.io/badge/license-MIT-green.svg?style=for-the-badge)](./README.md)

Exadel Smart Library (**ESL**) is an open-source **lightweight** and **flexible** UI component library based on web components.
Increase your site’s performance by building UX models with custom components from our library. 
The ESL web UI components library is compatible with any framework, which makes ESL ideal for projects regardless of 
their tech stack.

<p align="center">
<a href="https://esl-ui.com"><img src="./docs/images/welcome-btn.png" alt="Visit our UI component library website with examples" width="409" height="75" title="Click to visit our UI component library website with examples"/></a>
</p>

<p align="center" >★ <b>Check out our UI component library and support it with a star</b> ★</p>

- [Overview](#overview)
- [Library Structure](#library-structure)
- [Installation Guide](#installation-guide)
- [Development Information for Contributors](#development-information-for-contributors)

## Overview

Exadel Smart Library, or ESL for short, is a free web UI components library that reduces routine tasks and lets 
you efficiently create websites with multiple web components at hand.
When you’re deciding which is the best UI component library for your site, keep in mind that it should be compatible 
with other libraries and frameworks — like ESL is!

ESL UI component library allows you to access a toolkit full of reusable components. 
You can utilize these web components to complement projects or build your infrastructure from the ground up using 
ESL alone. Our web UI components library is high-quality, so the only thing you’ll have to focus on is applying styles 
to meet your project needs.

ESL is based solely on Web API and ECMAScript 6 features, which let our web UI components library work 
well across all modern browsers such as Firefox, Chrome, Safari, Opera, and Edge. 

## Library Structure

While building the UI component library, we included components, form components, and utilities that solve complex 
project architecture problems and comply with the DRY principle. 
See the rundown of web components and read the specs.

### Library Core

With our UI component library, you get flexible syntax sugar meant for building on top of basic components and 
controlling their life cycle.

- ##### [ESL Base Element](https://github.com/exadel-inc/esl/blob/HEAD/packages/esl/src/esl-base-element/README.md)
- ##### [ESL Mixin Element](https://github.com/exadel-inc/esl/blob/HEAD/packages/esl/src/esl-mixin-element/README.md)
- ##### [ESL Media Query](https://github.com/exadel-inc/esl/blob/HEAD/packages/esl/src/esl-media-query/README.md)
- ##### [ESL Traversing Query](https://github.com/exadel-inc/esl/blob/HEAD/packages/esl/src/esl-traversing-query/README.md)
- ##### [ESL Event Listener](https://github.com/exadel-inc/esl/blob/HEAD/packages/esl/src/esl-event-listener/README.md)
- ##### [ESL Utils](https://github.com/exadel-inc/esl/blob/HEAD/packages/esl/src/esl-utils/README.md)

### Components

Our HTML UI component library provides you with all the elements you’ll need to construct UX modules 
with excellent performance.

- ##### [ESL A11yGroup](https://github.com/exadel-inc/esl/blob/HEAD/packages/esl/src/esl-a11y-group/README.md) (beta)
- ##### [ESL Alert](https://github.com/exadel-inc/esl/blob/HEAD/packages/esl/src/esl-alert/README.md)
- ##### [ESL Animate](https://github.com/exadel-inc/esl/blob/HEAD/packages/esl/src/esl-animate/README.md)
- ##### [ESL Carousel](https://github.com/exadel-inc/esl/blob/HEAD/packages/esl/src/esl-carousel/README.md) (beta)
- ##### [ESL Footnotes](https://github.com/exadel-inc/esl/blob/HEAD/packages/esl/src/esl-footnotes/README.md) (beta)
- ##### [ESL Image Utils](https://github.com/exadel-inc/esl/blob/HEAD/packages/esl/src/esl-image-utils/README.md)
- ##### [ESL Image (Legacy)](https://github.com/exadel-inc/esl/blob/HEAD/packages/esl/src/esl-image/README.md)
- ##### [ESL Media](https://github.com/exadel-inc/esl/blob/HEAD/packages/esl/src/esl-media/README.md)
- ##### [ESL Panel](https://github.com/exadel-inc/esl/blob/HEAD/packages/esl/src/esl-panel/README.md)
- ##### [ESL Panel Group](https://github.com/exadel-inc/esl/blob/HEAD/packages/esl/src/esl-panel-group/README.md)
- ##### [ESL Popup](https://github.com/exadel-inc/esl/blob/HEAD/packages/esl/src/esl-popup/README.md) (beta)
- ##### [ESL Related Target](https://github.com/exadel-inc/esl/blob/HEAD/packages/esl/src/esl-related-target/README.md)
- ##### [ESL Scrollbar](https://github.com/exadel-inc/esl/blob/HEAD/packages/esl/src/esl-scrollbar/README.md)
- ##### [ESL Select](https://github.com/exadel-inc/esl/blob/HEAD/packages/esl/src/esl-forms/esl-select/README.md) (beta)
- ##### [ESL Select List](https://github.com/exadel-inc/esl/blob/HEAD/packages/esl/src/esl-forms/esl-select-list/README.md) (beta)
- ##### [ESL Share](https://github.com/exadel-inc/esl/blob/HEAD/packages/esl/src/esl-share/README.md) (beta)
- ##### [ESL Tab and Tabs](https://github.com/exadel-inc/esl/blob/HEAD/packages/esl/src/esl-tab/README.md)
- ##### [ESL Toggleable](https://github.com/exadel-inc/esl/blob/HEAD/packages/esl/src/esl-toggleable/README.md)
- ##### [ESL Trigger](https://github.com/exadel-inc/esl/blob/HEAD/packages/esl/src/esl-trigger/README.md)

---
## Installation Guide
<a name="instalation_guide"></a>

0. Preconditions:
   - Make sure you have all needed polyfills to support browsers from your browser-support list.
   See [Browser support & Polyfills](https://github.com/exadel-inc/esl/blob/HEAD/docs/BROWSER_SUPPORT.md) for details.
   - Use a bundler to build your project. Currently, only ES6 modules are available for consumption.

1. Install [esl npm dependency](https://www.npmjs.com/package/@exadel/esl):
    ```
    npm i @exadel/esl --save
    ```

2. Import Components/Modules you need:

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

3. [Optional] Setup environment configuration, e.g. custom screen breakpoints:

    ```javascript
    import {ESLScreenBreakpoints} from '@exadel/esl/modules/esl-media-query/core';

    // define XS screen breakpoint for up to 800px screen width
    ESLScreenBreakpoints.addCustomBreakpoint('XS', 1, 800); 
    ```

4.  Register web components via `register` static method call:
    ```javascript
    ESLImage.register();
    ```
    *You can pass custom tag name to 'register' function, but use this option only in an exceptional situation.*

---
<a name="contributing"></a>

## Development Information for Contributors

If you are part of ESL team or want to contribute to the project,
you can find useful information about the project processes and agreements here:

- #### [🔗 Contribution Guide](https://github.com/exadel-inc/esl/blob/HEAD/CONTRIBUTING.md)

- #### [🔗 Development Guide](https://github.com/exadel-inc/esl/blob/HEAD/docs/DEVELOPMENT.md)

- #### [🔗 Contributor Licence Agreement](https://github.com/exadel-inc/esl/blob/HEAD/CLA.md)

---
<a name="team"></a>

**ESL Core Team**

People who actively architect, maintain, and keep the idea of the ESL

<table><tbody><tr>
<td align="center" valign="top" width="16.6%">
    <a href="https://github.com/ala-n">
        <img src="https://github.com/ala-n.png?s=75" width="75" height="75" style="min-width: 75px"><br/>
        Alexey Stsefanovich
    </a><br/>
    Architect
</td>
<td align="center" valign="top" width="16.6%">
    <a href="https://github.com/abarmina">
        <img src="https://github.com/abarmina.png?s=75" width="75" height="75" style="min-width: 75px"><br/>
        Anna Barmina
    </a><br/>
    Maintainer
</td>
<td align="center" valign="top" width="16.6%">
    <a href="https://github.com/NastaLeo">
        <img src="https://github.com/NastaLeo.png?s=75" width="75" height="75" style="min-width: 75px"><br/>
        Anastasiya Lesun
    </a><br/>
    Maintainer
</td>
<td align="center" valign="top" width="16.6%">
    <a href="https://github.com/yadamskaya">
        <img src="https://github.com/yadamskaya.png?s=75" width="75" height="75" style="min-width: 75px"><br/>
        Yuliya Adamskaya
    </a><br/>
</td>
<td align="center" valign="top" width="16.6%">
    <a href="https://github.com/dshovchko">
        <img src="https://github.com/dshovchko.png?s=75" width="75" height="75" style="min-width: 75px"><br/>
        Dmytro Shovchko
    </a>
</td>
<td align="center" valign="top" width="16.6%">
    <a href="https://github.com/fshovchko">
        <img src="https://github.com/fshovchko.png?s=75" width="75" height="75" style="min-width: 75px"><br/>
        Feoktyst Shovchko
    </a>
</td>
</tr></tbody></table>

**ESL Contributors**: 

People who contributed to the ESL project

<table><tbody><tr>
<td align="center" valign="top" width="20%">
    <a href="https://github.com/julia-murashko">
        <img src="https://github.com/julia-murashko.png?s=75" width="75" height="75" style="min-width: 75px"><br/>
        Julia Murashko
    </a><br/>
    Initial Core Team Member
</td>
<td align="center" valign="top" width="20%">
    <a href="https://github.com/Natalie-Smirnova">
        <img src="https://github.com/Natalie-Smirnova.png?s=75" width="75" height="75" style="min-width: 75px"><br/>
        Natalie Smirnova
    </a>
</td>
<td align="center" valign="top" width="20%">
    <a href="https://github.com/grechihinrhp">
        <img src="https://github.com/grechihinrhp.png?s=75" width="75" height="75" style="min-width: 75px"><br/>
        Ruslan Grechihin
    </a>
</td>
<td align="center" valign="top" width="20%">
    <a href="https://github.com/HenadzV">
        <img src="https://github.com/HenadzV.png?s=75" width="75" height="75" style="min-width: 75px"><br/>
        Henadz Varany
    </a>
</td>
<td align="center" valign="top" width="20%">
    <a href="https://github.com/AlexanderBazukevich">
        <img src="https://github.com/AlexanderBazukevich.png?s=75" width="75" height="75" style="min-width: 75px"><br/>
        Alexander Bazukevich
    </a>
</td>
</tr><tr>
<td align="center" valign="top" width="20%">
    <a href="https://github.com/nattallius">
        <img src="https://github.com/nattallius.png?s=75" width="75" height="75" style="min-width: 75px"><br/>
        Natallia Harshunova
    </a><br/>
    Developer
</td>
<td align="center" valign="top" width="20%">
    <a href="https://github.com/Anna-MariiaPetryk">
        <img src="https://github.com/Anna-MariiaPetryk.png?s=75" width="75" height="75" style="min-width: 75px"><br/>
        Anna-Mariia Petryk
    </a><br/>
    Developer
</td>
<td align="center" valign="top" width="20%">
    <a href="https://github.com/YanaBr">
        <img src="https://github.com/YanaBr.png?s=75" width="75" height="75" style="min-width: 75px"><br/>
        Yana Bernatskaya
    </a><br/>
    Developer
</td>
<td align="center" valign="top" width="20%">
    <a href="https://github.com/alexanderavseev">
        <img src="https://github.com/alexanderavseev.png?s=75" width="75" height="75" style="min-width: 75px"><br/>
        Aliaksandr Auseyeu
    </a><br/>
    Consultant
</td>
<td align="center" valign="top" width="20%">
    <a href="https://github.com/andreybelous">
        <img src="https://github.com/andreybelous.png?s=75" width="75" height="75" style="min-width: 75px"><br/>
        Andrey Belous
    </a><br/>
    Consultant
</td>
</tr><tr>
<td align="center" valign="top" width="20%"></td>
<td align="center" valign="top" width="20%">
    <a href="https://github.com/dmantsevich">
        <img src="https://github.com/dmantsevich.png?s=75" width="75" height="75" style="min-width: 75px"><br/>
        Dzianis Mantsevich
    </a><br/>
    Consultant
</td>
<td align="center" valign="top" width="20%">
    <a href="https://github.com/liubou-masiuk">
        <img src="https://github.com/liubou-masiuk.png?s=75" width="75" height="75" style="min-width: 75px"><br/>
        Liubou Masiuk
    </a><br/>
    Consultant
</td>
<td align="center" valign="top" width="20%">
    <a href="https://www.linkedin.com/in/iryna-pavlenko-270930107">
        <img src="https://static-exp1.licdn.com/sc/h/244xhbkr7g40x6bsu4gi6q4ry?s=75" width="75" height="75" style="min-width: 75px"><br/>
         Iryna Pavlenko
    </a><br/>
    Designer
</td>
<td align="center" valign="top" width="20%"></td>
</tr></tbody></table>

**Exadel, Inc.**

[![](./docs/images/exadel-logo.png)](https://exadel.com)
