# [ESL](../../../README.md) Alert

Version: *1.0.0-beta*.

***Important Notice: the component is under beta version, it tested and ready to use but be aware of its potential critical API changes.***

Authors: *Julia Murashko*.

ESLAlert is a simple component to show small notifications on your pages.

---

##Usage

First of all, register component using static `ESLAlert.init` method.
Then the following events can be dispatched globally (on window) to control alert: 
- `esl:alert:show` to show alert
- `esl:alert:hide` to hide alert

Use custom event details to customize alert.

Description TBD.

## Example

```javascript
window.dispatchEvent(new CustomEvent(`esl:alert:show`, {
    detail: {
       text: 'Hello World',
       cls: 'alert alert-info'
    }
}));
```

