# Installation 

TBD

# Project structure

UIP components are organized in the following way:

  - [Core Elements](src/core/README.md#uip-root)
  - Plugins
    - [UIPEditor](src/plugins/editor/README.md)
    - [UIPSettings](src/plugins/settings/README.md)
        - [UIPBoolSetting](src/settings/bool-setting/README.md)
        - [UIPSelectSetting](src/settings/select-setting/README.md)
        - [UIPTextSetting](src/settings/text-setting/README.md)
    - [UIPHeader](src/plugins/header/README.md)
        - [UIPOptions](src/header/options/README.md)
        - [UIPSnippets](src/header/snippets/README.md)

Any playground must have at least **core** components. **Plugins** are
optional, you can add them on your own free will. 

To implement custom UIPPlayground components, see [UIPPlugin](src/core/base/README.md#uip-plugin).

# Modules/components imports
Module's main parts lay inside modules folders. So importing the required
module is really straightforward:

```typescript
import {UIPRoot} from './root';
import {UIPEditor} from './editor';
import {UIPBoolSetting} from './bool-setting';
```

Every module has two versions of styles: *css* and *less*. If you want
to import styles for all UIP component, you can import either
*registration.less* or *registration.css* file.

Before using UIP components, you also need to *register* them. For example,
if you want to use [UIPRoot](src/core/base/README.md#uip-root) component, register it like that:

```typescript
import {UIPRoot} from './root';
UIPRoot.reguster();
```

# Browser support

UIPPlayground supports all modern browsers.
