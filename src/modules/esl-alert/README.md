# [ESL](../../../README.md) Alert

Version: *1.0.0*.

Authors: *Julia Murashko*.

ESLAlert - is a component to show small notifications on your pages. ESLAlert can have multiple instances on the page.

---

##Usage

First, use the common approach to register component: `ESLAlert.register()`
Then you can attach `<esl-alert>` component in place or initialize it globally using `ESLAlert.init` shortcut.

ESL Alert listening DOM alerts to control its state. 
By default, the target to catch alerts is the `esl-alert` parent element. 
Target can be changed using target attribute with the [TraversingQuery](../esl-traversing-query/README.md) support, 
or trough the $target property that accepts any EventTarget instance (including the window). 

ESL Alert listens the following events: 
- `esl:alert:show` to show alert
- `esl:alert:hide` to hide alert

Use the custom event details to customize alert. Custom details accepts the following properties:

- `cls` - to path class or classes(separated by space) to add to alert inner.
- `text` - to specify alert text content
- `html` - to alternatively specify alert HTML content

If one of the alert catches the activation event it will prevent its propagation to parent elements.

## Example
```html
<body>
  <div class="container">
    ...
    <my-component></my-component>
    ...
  </div>
  <esl-alert></esl-alert>
</body>
```

```javascript
// my-component
this.dispatchEvent(new CustomEvent(`esl:alert:show`, {
    detail: {
       text: 'Hello World',
       cls: 'alert alert-info'
    }
}));
```
