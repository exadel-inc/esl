# [ESL](../../../) Alert

Version: *1.0.0*

Authors: *Julia Murashko*

<a name="intro"></a>

ESLAlert is a component to show small notifications on your pages. ESLAlert can have multiple instances on the page.

---

<a name="usage"></a>

## Usage

First, use the common approach to register component: `ESLAlert.register()`.
Then you can attach `<esl-alert>` component to the expected place in the document or initialize it globally by using `ESLAlert.init` shortcut.

ESL Alert listens to DOM alerts to control its state. 
By default, the target to catch alerts is the `esl-alert` parent element. 
Target can be changed using `target` attribute with the [TraversingQuery](../esl-traversing-query/README.md) support, 
or through the `$target` property that accepts any EventTarget instance (including the window). 

ESL Alert listens to the following events: 
- `esl:alert:show` to show alert
- `esl:alert:hide` to hide alert

Use CustomEvent `details` to customize alert. Alert `details` accepts the following properties:

- `cls` - to pass class or classes(separated by space) to add to alert inner.
- `text` - to specify alert text content
- `html` - to alternatively specify alert HTML content

If one of `esl-alert`s catches the activation event it will prevent its propagation to parent elements.

<a name="example"></a>

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
