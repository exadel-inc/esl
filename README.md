# UIPlayground

<p align="center">
  <img width="150" height="150" src="https://github.com/exadel-inc/ui-playground/blob/main/docs/images/uip-logo.png?raw=true">
</p>

<br/>

[![npm](https://img.shields.io/npm/v/@exadel/ui-playground?style=for-the-badge)](https://www.npmjs.com/package/@exadel/ui-playground)
[![version](https://img.shields.io/github/package-json/v/exadel-inc/ui-playground?style=for-the-badge)](https://github.com/exadel-inc/ui-playground/releases/latest)
[![build](https://img.shields.io/github/workflow/status/exadel-inc/ui-playground/lint/main?style=for-the-badge)](https://github.com/exadel-inc/ui-playground/actions/workflows/lint.yml)
[![License](https://img.shields.io/badge/license-MIT-green.svg?style=for-the-badge)](./README.md)

**UIPlayground** is a solution for presenting your custom components.

With the help of *UIP* components we allow user to *'play'* with a component.
You can choose from the variety of component's templates ([UIP Snippets](src/plugins/header/snippets/README.md)),
play with the component's settings ([UIP Settings](src/plugins/settings/README.md))
or even change its markup ([UIP Editor](src/plugins/editor/README.md))!
You can also manage Playground visual appearance by our options ([UIP Options](src/plugins/header/options/README.md))

Every element (except the *UIP Root*) isn't required, so you can combine them the way you want.

---
## Installation

Install UIPlayground [npm dependency](https://www.npmjs.com/package/@exadel/ui-playground)
   ```bash
   npm i @exadel/ui-playground --save
   ```
Run initialization function
   ```javascript
   import {init} from '@exadel/ui-playground/esm/registration.js';
   init();
   ```
Import CSS styles
   ```css
   @import "@exadel/ui-playground/esm/registration.css"
   ```

---
## UIP elements:
- ### Core
  - #### [UIP Plugin](src/core/base/README.md#uip-plugin)
  - #### [UIP Root](src/core/base/README.md#uip-root)
  - #### [UIP State Model](src/core/base/README.md#uip-state-model)
- ### Components
  - #### [UIP Preview](src/core/preview/README.md)
  - #### [UIP Editor](src/plugins/editor/README.md)
  - #### [UIP Header](src/plugins/header/README.md)
    - ##### [UIP Snippets](src/plugins/header/snippets/README.md)
    - ##### [UIP Options](src/plugins/header/options/README.md)
  - #### [UIP Settings](src/plugins/settings/README.md)
    - ##### [UIP Setting](src/settings/setting/README.md)
    - ##### [UIP Text Setting](src/settings/text-setting/README.md)
    - ##### [UIP Bool Setting](src/settings/bool-setting/README.md)
    - ##### [UIP Select Setting](src/settings/select-setting/README.md)
---
## Example

![Example](docs/images/UIPexample2.png)

```html
<uip-root editor-collapsed>
  <uip-header>
    <uip-options></uip-options>
  </uip-header>
  <script type="text/html" uip-snippet label="Logo">
    <div class="logo-content gray-clr">
      <img src="assets/uip-logo.png" alt="Logo">
      <a class="get-started" href="{{ '/general/getting-started/'}}" data-test-msg="Get Started!"></a>
    </div>
  </script>
  <uip-preview></uip-preview>
  <uip-settings target=".logo-content">
    <uip-text-setting label="Alternative Button Text:" target=".get-started"
                      attribute="data-test-msg"></uip-text-setting>
    <uip-slider-setting label="Width:" target=".logo-content img"
                        attribute="width" min="100" max="500"></uip-slider-setting>
    <uip-select-setting label="Color:" attribute="class" mode="append">
      <option value="gray-clr">Dark gray</option>
      <option value="blue-clr">Blue</option>
      <option value="purple-clr">Purple</option>
    </uip-select-setting>
  </uip-settings>
</uip-root>
```

---

## Roadmap

- Integration with [ESL](https://github.com/exadel-inc/esl): demo pages
- Ability to control the width of Setting section
- Documentation and more demo content
- Css and JS support for Editor
- Readonly mode for Editor

---

## License

Distributed under the MIT License. See [LICENSE](https://github.com/exadel-inc/ui-playground/blob/HEAD/CLA.md)
for more information.

---

**Exadel, Inc.**

[![](docs/images/exadel-logo.png)](https://exadel.com)
