# [ESL](../../../README.md) Base Popup

Version: *1.0.0-beta*.

***Important Notice: the component is under beta version, it was tested and now ready to use but be aware of its potential critical API changes.***

Authors: *Julia Murashko*, *Alexey Stsefanovich (ala'n)*.

ESLBasePopup - is a custom element, that is used as a base for "Popup like" components creation.

ESLPopupDispatcher - plugin component, that prevents activation of multiple ESLBasePopup instances in bounds of managed container.
Usually (and by default) binds to document.body. Use native DOM events to manage controlled instances state.

Use `ESLPopupDispatcher.init()` to initialize (and bind) ESLPopupDispatcher.

---

### Implementation API
 - onShow - 'show' actions to execute when instance becomes active
 - onHide - 'hide' actions to execute when instance becomes inactive
 
### Public API:
 - show - trigger popup activation
 - hide - trigger popup deactivation
 - toggle - toggle popup state

Description TBD.
