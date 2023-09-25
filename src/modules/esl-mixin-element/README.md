# [ESL](../../../) Mixin Element

Version: *2.0.0*

Authors: *Alexey Stsefanovich (ala'n)*

<a name="intro"></a>

**ESLMixinElement** provides the core for creating custom attribute elements (mixins) and TS (TypeScript) decorators to
simplify component creation.

`ESLMixinElement` - base class to create a mixin that attaches to the DOM element via a custom attribute

### Mixin Element static API
- `MyMixinElement.is` - property that defines connection attribute name
- `MyMixinElement.observedAttributes` - array of additional attributes to observe  
  _Note: mixin primary attribute (`is`) is under observation independently of `observedAttributes` value_
- `MyMixinElement.register` - register component inside `ESLMixinRegistry`
- `MyMixinElement.get` - returns an `ESLMixinElement` instance attached to the passed element

### ESLMixinElement base class static API
- `ESLMixinElement.get($el, name)` - returns mixin instance by the element and mixin name
- `ESLMixinElement.getAll($el)` - returns all mixins initialized on passed host element

### Base Element API
Properties:
- `$host` - readonly mixin target DOM element
- `connected` - readonly marker, true if element connected and base `connectedCallback` executed

Attributes:
- `connectedCallback` - called when the element is appended to the DOM
- `disconnectedCallback` - called when the element is disconnected from the DOM
- `attributeChangedCallback` - called when the observable attribute is changed
  (happens when the attribute is accessed for writing, independently of the actual value change).
  Note that mixin primary attribute value observation happens independently of `observedAttributes` value

- `$$cls` - checks or changes element CSS classes (uses CSSClassUtils)
- `$$attr` - checks or changes element attributes
- `$$fire` - dispatches event

- `$$on` - subscribes to the event manually or subscribes decorated method
- `$$off` - unsubscribes from the event manually or unsubscribes decorated method

### Element decorators

- `@attr` - to map string type property to HTML attribute
- `@boolAttr` - to map boolean property to HTML boolean (marker) attribute state
- `@jsonAttr` - to map object property to HTML attribute using JSON format to serialize/deserialize value

- `@listen` - decorate a method with `ESLListenerDescriptor` props

Use the `@prop` decorator to override a property created via `@attr`, `@boolAttr`, or `@jsonAttr` at the parent level
with non-attribute accessor value.

### Mixin Element Example

```ts
import {ESLMixinElement, attr, boolAttr, jsonAttr, listen} from '@exadel/esl';

class MyMixinComponent extends ESLMixinElement {
  static override is = 'my-mixin-attr';
  static override obserevedAttriutes = [
    /* attribute to observe additionally to mixin attribute */
  ];

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
  
  attributeChangedCallback(attributeName: string, oldValue: string, newValue: string) {
    // Called on attribute value change
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
