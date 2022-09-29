# [ESL](../../../) Mixin Element

Version: *1.0.0*

Authors: *Alexey Stsefanovich (ala'n)*

<a name="intro"></a>

**ESLMixinElement** provides the core for creating custom attribute elements (mixins) and TS (TypeScript) decorators to
simplify component creation.

`ESLMixinElement` - base class to create a mixin element that attaches to the element via a custom attribute

### Mixin Element static API
- `MyMixinElement.is` - property that defines connection attribute name
- `MyMixinElement.observedAttributes` - array of additional attributes to observe

- `MyMixinElement.register` - register component inside `ESLMixinRegistry`
- `MyMixinElement.get` - returns an `ESLMixinRegistry` instance attached to passed element

### Base Element API
Properties:
- `$host` - readonly mixin target DOM element
- `connected` - readonly marker, true if element connected and base `connectedCallback` executed

Attributes:
- `connectedCallback` - called when the element is appended to the DOM
- `disconnectedCallback` - called when the element is disconnected from the DOM
- `attributeChangeCallback` - called when the observable attribute is changed

- `$$cls` - check or change element CSS classes (uses CSSClassUtils)
- `$$attr` - check or change element attributes
- `$$fire` - dispatch event

- `$$on` - subscribe to the event manually or subscribe decorated method
- `$$off` - unsubscribe from the event manually or unsubscribe decorated method

### Element decorators

- `@attr` - to map string type property to HTML attribute
- `@boolAttr` - to map boolean property to HTML boolean (marker) attribute state
- `@jsonAttr` - to map object property to HTML attribute using JSON format to serialize / deserialize value

- `@listen` - decorate method with `ESLListenerDescriptor` props

Use the `@prop` decorator to override a property created via `@attr`, `@boolAttr`, or `@jsonAttr` at the parent level
with non-attribute accessor value.

### Mixin Element Example

```ts
import {ESLMixinElement, attr, boolAttr, jsonAttr, listen} from '@exadel/esl';

class MyMixinComponent extends ESLMixinElement {
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

  @listen('click')
  onClick(e: MouseEvent) { /* Handle btn click event */ }
}

// Register mixin element for attribute provided in the static `is` property
MyMixinComponent.register();
```
