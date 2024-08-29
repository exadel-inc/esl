# Installation 

Install UIPlayground [npm dependency](https://www.npmjs.com/package/@exadel/ui-playground):
   ```bash
   npm i @exadel/ui-playground --save
   ```

# Project structure

UIP components are organized in the following way:

Core Elements
  - [UIP Root](src/core/README.md#uip-root)
  - [UIP Preview](src/core/README.md)

Plugins
  - [UIP Editor](src/plugins/editor/README.md)
  - [UIP Settings and Setting](src/plugins/settings/README.md)
    - [UIP Text Setting](src/plugins/settings/text-setting/README.md)
    - [UIP Bool Setting](src/plugins/settings/bool-setting/README.md)
    - [UIP Select Setting](src/plugins/settings/select-setting/README.md)
  - [UIP Snippets](src/plugins/snippets/README.md)
    - [UIP Snippets Title](src/plugins/snippets-title/README.md)
    - [UIP Snippets List](src/plugins/snippets-list/README.md)
  - [UIP Theme Toggle](src/plugins/theme/README.md)
  - [UIP Note](src/plugins/note/README.md)
  - [UIP Copy](src/plugins/copy/README.md)
  - [UIP Text Direction Toggle](src/plugins/direction/README.md)
---

UIPlayground must have at least **Сore** components. **Plugins** are
optional, you can add them on your own free will.

To implement custom UIPlayground components, see [UIPPlugin](src/core/README.md#uip-plugin).

# Modules/components imports
To register all components, you can use the next callback:

```typescript
import {init} from '@exadel/ui-playground/esm/registration';
init();
```

There is also an ability to register only Core/Plugins/Settings parts. To do this, call one of the functions below:

```typescript
import {registerCore, registerPlugins, registerSettings} from '@exadel/ui-playground/esm/registration';
registerCore();
registerPlugins();
registerSettings();
```

The callbacks above register UIP components by themselves. But if you want to have a custom registration logic,
there is a way to register components manually:

```typescript
import {UIPRoot} from '@exadel/ui-playground/esm/registration';
UIPRoot.register();
```

Every module has two versions of styles: *css* and *less*. If you want
to import styles for all UIP component, you can import either
*registration.less* or *registration.css* file:

```less
@import '@exadel/ui-playground/esm/registration.css';
```

# Browser support

UIPlayground supports all modern browsers.
