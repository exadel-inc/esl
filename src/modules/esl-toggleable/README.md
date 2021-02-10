# [ESL](../../../README.md) Toggleable

Version: *1.0.0-beta*.

***Important Notice: the component is under beta version, it was tested and now ready to use but be aware of its potential critical API changes.***

Authors: *Julia Murashko*, *Alexey Stsefanovich (ala'n)*.

ESLToggleable - is a custom element, that is used as a base for "Popup like" components creation.

ESLToggleableDispatcher - plugin component, that prevents activation of multiple ESLToggleable instances in bounds of managed container.
Usually (and by default) binds to document.body. Use native DOM events to manage controlled instances state.

Use `ESLToggleableDispatcher.init()` to initialize (and bind) ESLToggleableDispatcher.

---

### Implementation API
 - onShow - 'show' actions to execute when instance becomes active
 - onHide - 'hide' actions to execute when instance becomes inactive
 
### Public API:
 - show - trigger element activation
 - hide - trigger element deactivation
 - toggle - toggle element state

Description TBD.
