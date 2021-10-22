# Installation 

TBD

# Project structure

UIP components are organized in the following way:

1. Core components
    - Base components
        - [UIPRoot](core/README.md#uip-root)
    - [UIPPreview](core/preview/README.md)
    - [UIPSnippets](core/snippets/README.md)
2. Plugins
    - [UIPEditor](plugins/editor/README.md)
    - [UIPOptions](plugins/options/README.md)
    - [UIPSettings](plugins/settings/settings/README.md)
        - [UIPBoolSetting](plugins/settings/settings/setting/bool-setting/README.md)
        - [UIPSelectSetting](plugins/settings/settings/setting/select-setting/README.md)
        - [UIPTextSetting](plugins/settings/settings/setting/text-setting/README.md)

Any playground must have at least **core** components. **Plugins** are
optional, you can add them on your own free will. 

To implement custom UIPPlayground components, see [UIPPlugin](core/README.md#uip-plugin).

# Modules/components imports
Modules main parts lay inside modules folders. So importing required
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
if you want to use [UIPRoot](src/core/README.md#uip-root) component, register it like that:

```typescript
import {UIPRoot} from './root';
UIPRoot.reguster();
```

# Browser support

UIPPlayground supports all modern browsers.
