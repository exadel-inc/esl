# [ESL](https://exadel-inc.github.io/esl/) Base Element

Version: *1.0.0*

Authors: *Alexey Stsefanovich (ala'n)*

<a name="intro"></a>

Provides the ESLBaseElement - a base class for custom element declaration, and a set of common decorators.

### Available decorators:
 - `@attr` - to map string type property to HTML attribute.
 - `@boolAttr` - to map boolean property to HTML boolean (marker) attribute state.
 - `@jsonAttr` - to map object property to HTML attribute using JSON format to serialize / deserialize value.

Use `@override` or `@constant` decorator to override property that was created 
via `@attr`, `@boolAttr` or `@jsonAttr` on the parent level.

### Base Element static API
- `MyElement.is` - property that defines tag name
  
- `MyElement.register` - calls registration inside customElements registry
- `MyElement.registered` - returns promise that will be resolved as soon as the component is registered

### Example

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
