# [ESL](../../../) Base Element

Version: *1.1.0*

Authors: *Alexey Stsefanovich (ala'n)*

<a name="intro"></a>

Provides the core to create custom elements and ts decorators to simplify components creation.

## Base elements:
- **ESLBaseElement** - base class for standard custom element declaration
- **ESLMixinElement** (beta) - base class to create mixin element that attaches to element via custom attribute

### Base Element static API
- `MyElement.is` - property that defines tag name
- `MyElement.observedAttributes` - array of attributes to observe

- `MyElement.register` - register component inside `customElements` registry
- `MyElement.registered` - returns promise that will be resolved as soon as the component is registered

### Mixin Element static API (beta)
- `MyMixinElement.is` - property that defines connection attribute name
- `MyMixinElement.observedAttributes` - array of additional attributes to observe

- `MyMixinElement.register` - register component inside `ESLMixinRegistry`

### Shared Element API
- `connectedCallback` - called when element appends to the DOM
- `disconnectedCallback` - called when element is disconnected from the DOM
- `attributeChangeCallback` - called when observed attribute has changed

- `$$cls` - check or change element CSS classes (uses CSSClassUtils) 
- `$$attr` - check or change element attributes
- `$$fire` - dispatch event with `esl:` prefix

### Base Element API
- `connected` - readonly marker, true if element connected and base `connectedCallback` executed

### Mixin Element API (beta)
- `$host` - readonly mixin target DOM element

### Element decorators:
Works for both `ESLBaseElement` and `ESLMixinElement`.

 - `@attr` - to map string type property to HTML attribute.
 - `@boolAttr` - to map boolean property to HTML boolean (marker) attribute state.
 - `@jsonAttr` - to map object property to HTML attribute using JSON format to serialize / deserialize value.

Use `@prop` decorator to override property 
that was created via `@attr`, `@boolAttr` or `@jsonAttr` on the parent level
with non attribute accessor value.

### Base Example

```ts
import {ESLBaseElement, attr, boolAttr, jsonAttr} from '@exadel/esl';

class MyCustomComponent extends ESLBaseElement {
    static is = 'my-element';

    /** Reflects 'my-string-prop' attribute */
    @attr() public myStringProp: string; 
    /** Reflects to 'my-marker' attribute-marker */
    @boolAttr() public myMarker: boolean; 
    /** Reflects to JSON value in 'my-config' attribute */
    @jsonAttr() public myConfig: Recorg<string, string>;

    connectedCallback() {
        super.connectedCallback();
        // Init my component
    }

    disconnectedCallback() {
        // Unsubscribe listeners, revert side effects
        super.disconnectedCallback();
    }
}

// Register custom tag with name provided in the static `is` property
MyCustomComponent.register();

// Or register custom tag with passed tag name
MyCustomComponent.register('my-tag');
```

### Mixin Example (beta)

```ts
import {ESLMixinElement, attr, boolAttr, jsonAttr} from '@exadel/esl';

class MyMixiinComponent extends ESLMixinElement {
    static is = 'my-mixin-attr';

    /** Reflects 'my-string-prop' attribute */
    @attr() public myStringProp: string; 
    /** Reflects to 'my-marker' attribute-marker */
    @boolAttr() public myMarker: boolean; 
    /** Reflects to JSON value in 'my-config' attribute */
    @jsonAttr() public myConfig: Recorg<string, string>;

    connectedCallback() {
        super.connectedCallback();
        // Init my component
    }

    disconnectedCallback() {
        // Unsubscribe listeners, revert side effects
        super.disconnectedCallback();
    }
}

// Register mixin element for attribute provided in the static `is` property
MyCustomComponent.register();
```
