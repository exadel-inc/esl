# Installation 

TBD

# Project structure

UIP components are organized in the following way:

[Core Elements](src/core/README.md#uip-root)

Plugins:
  - [UIPEditor](src/plugins/editor/README.md)
  - [UIPSettings](src/plugins/settings/README.md)
      - [UIPBoolSetting](src/settings/bool-setting/README.md)
      - [UIPSelectSetting](src/settings/select-setting/README.md)
      - [UIPTextSetting](src/settings/text-setting/README.md)
      - [UIPSliderSetting](src/settings/slider-setting/README.md)
  - [UIPHeader](src/plugins/header/README.md)
      - [UIPOptions](src/header/options/README.md)
      - [UIPSnippets](src/header/snippets/README.md)

Any playground must have at least **Сore** components. **Plugins** are
optional, you can add them on your own free will.

To implement custom UIPPlayground components, see [UIPPlugin](src/core/README.md#uip-plugin).

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

Before using UIP components, you also need to *register* them. The callbacks above do this by themselves.
But if you want to have a custom registration logic, there is a way to register components manually:

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
