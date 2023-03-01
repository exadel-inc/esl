# [ESL](../../../) Base Element

Version: *1.2.0*

Authors: *Alexey Stsefanovich (ala'n)*

<a name="intro"></a>

Provides the core for creating custom elements and TS (TypeScript) decorators to simplify component creation.

**ESLBaseElement** - base class for custom (tag) element declaration

### Base Element static API
- `MyElement.is` - property that defines tag name
- `MyElement.observedAttributes` - an array of attributes to observe

- `MyElement.register` - register component inside `customElements` registry
- `MyElement.registered` - returns a promise that will be resolved as soon as the component is registered

### Base Element API
Properties:
- `connected` - readonly marker, true if element connected and base `connectedCallback` executed

Attributes: 
- `connectedCallback` - called when the element is appended to the DOM
- `disconnectedCallback` - called when the element is disconnected from the DOM
- `attributeChangedCallback` - called when the observable attribute is changed
  (happens when the attribute is accessed for writing, independently of the actual value change)

- `$$cls` - checks or changes element CSS classes (uses CSSClassUtils) 
- `$$attr` - checks or changes element attributes
- `$$fire` - dispatches event

- `$$on` - subscribes to the event manually or subscribes decorated method
- `$$off` - unsubscribes from the event manually or unsubscribes decorated method

### Element decorators

 - `@attr` - to map string type property to HTML attribute
 - `@boolAttr` - to map boolean property to HTML boolean (marker) attribute state
 - `@jsonAttr` - to map object property to HTML attribute using JSON format to serialize / deserialize value

 - `@listen` - decorate a method with `ESLListenerDescriptor` props
 - `@prop` - a decorator to create prototype-level value definition.  
   It also gives an ability to override a property created via `@attr`, `@boolAttr` or `@jsonAttr` at the parent level
   with non-attribute accessor value.

### Base Example

```ts
import {ESLBaseElement, attr, boolAttr, jsonAttr, listen} from '@exadel/esl';

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

### Event Listener example

The following listeners will be subscribed and unsubscribed automatically 
```ts
import {ESLBaseElement, listen} from '@exadel/esl';

class MyCustomComponent {
  @listen('click')
  onClick(e: MouseEvent) { /* Handle click event */}

  @listen({event: 'click', selector: '.btn'})
  onBtnClick(e: MouseEvent) { /* Handle btn click event */}
}
```

### Event Listener manual example

Manual event listeners management
```ts
import {ESLBaseElement, listen} from '@exadel/esl';

class MyCustomComponent {
  bindEvents() {
    // Meta information fetched from `@listen` decorator 
    this.$$on(this.onClick);

    // Subscribe event
    this.$$on(this.onEvent, 'event');

    // Subscribe event with descriptor
    this.$$on(this.onEvent, {event: 'some-event'});
  }

  unbindEvents() {
    // Unsubscribe listener related to `onClick` method
    this.$$off(this.onClick);

    // Unsubscribe `event`
    this.$$off('event'); // or this.$$off(this.onEvent);

    // Unsubscribe host event listeners that hadled by `window`
    this.$$off({target: window});

    // Unsubscribe all events
    this.$$off();
  }

  @listen({event: 'click', auto: false})
  onClick(e: MouseEvent) { /* Handle btn click event */ }

  onEvent(e: Event) { /* ... */ }
}
```
