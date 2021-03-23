# [ESL](../../../README.md) Toggleable

Version: *1.0.0*.

Authors: *Julia Murashko*, *Alexey Stsefanovich (ala'n)*.

ESLToggleable - is a custom element, that is used as a base for "Popup like" components creation.

ESLToggleableDispatcher - plugin component, that prevents activation of multiple ESLToggleable instances in bounds of managed container.
Usually (and by default) binds to document.body. Use native DOM events to manage controlled instances state.

Use `ESLToggleableDispatcher.init()` to initialize (and bind) ESLToggleableDispatcher.

---

### Toggleable Attributes / Property
 - `open` - active state marker

 - `body-class` - CSS class to add on the body element
 - `active-class` - CSS class to add when Toggleable is active
 - `group` (`groupName`) - Toggleable group meta information to organize groups
 - `close-on` (`closeTrigger`) - Selector to mark inside close triggers
 - `close-on-esc` - Close Toggleable on ESC keyboard event
 - `close-on-outside-action` - Close Toggleable on a click/tap outside toggleable

 - `initial-params` - Initial params to pass to show/hide action on the start
 - `default-params` - Default params to merge into passed action params

### Toggleable Implementation API
 - `onShow` - 'show' actions to execute when instance becomes active
 - `onHide` - 'hide' actions to execute when instance becomes inactive
 
### Toggleable Public API:
 - `show` - trigger element activation
 - `hide` - trigger element deactivation
 - `toggle` - toggle element state
