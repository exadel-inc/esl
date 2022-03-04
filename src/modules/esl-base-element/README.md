# [ESL](../../../) Base Element

Version: *1.1.0*

Authors: *Alexey Stsefanovich (ala'n)*

<a name="intro"></a>

Provides the core for creating custom elements and ts decorators to simplify components creation.

## Base Element
**ESLBaseElement** - base class for custom (tag) element declaration

### Base Element static API
- `MyElement.is` - property that defines tag name
- `MyElement.observedAttributes` - array of attributes to observe

- `MyElement.register` - register component inside `customElements` registry
- `MyElement.registered` - returns promise that will be resolved as soon as the component is registered

### Base Element API
Properties:
- `connected` - readonly marker, true if element connected and base `connectedCallback` executed

Attributes: 
- `connectedCallback` - called when the element is appended to the DOM
- `disconnectedCallback` - called when the element is disconnected from the DOM
- `attributeChangeCallback` - called when the observable attribute is changed

- `$$cls` - check or change element CSS classes (uses CSSClassUtils) 
- `$$attr` - check or change element attributes
- `$$fire` - dispatch event with `esl:` prefix


### Element decorators
Works for both `ESLBaseElement` and `ESLMixinElement`.

 - `@attr` - to map string type property to HTML attribute.
 - `@boolAttr` - to map boolean property to HTML boolean (marker) attribute state.
 - `@jsonAttr` - to map object property to HTML attribute using JSON format to serialize / deserialize value.

Use the `@prop` decorator to override a property
created via `@attr`, `@boolAttr` or `@jsonAttr` at the parent level
with non-attribute accessor value.

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
