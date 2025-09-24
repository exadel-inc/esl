## Installation

Install UIPlayground [npm dependency](https://www.npmjs.com/package/@exadel/ui-playground)
   ```bash
   npm i @exadel/ui-playground --save
   ```
Run initialization function
   ```javascript
   import {init} from '@exadel/ui-playground/dist/registration.js';
   init();
   ```
Import CSS styles
   ```css
   @import "@exadel/ui-playground/dist/registration.css";
   ```

---

## Project Structure

UI playground components are divided into two main categories: **Core Components** and **Plugins**. The whole list of available components is described [here](/playground/components/).

UIP must have at least **Сore** components. **Plugins** are
optional, you can add them on your own free will.

To implement custom UIPlayground components, see [UIPPlugin](/playground/components/core/#uip-plugin).
