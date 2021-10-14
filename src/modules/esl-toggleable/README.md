# [ESL](https://exadel-inc.github.io/esl/) Toggleable

Version: *2.2.0*

Authors: *Julia Murashko*, *Alexey Stsefanovich (ala'n)*

<a name="intro"></a>

ESLToggleable - a custom element, that is used as a base for "Popup-like" components creation.

ESLToggleableDispatcher - plugin component, that prevents activation of multiple ESLToggleable instances in bounds of managed container.
Usually (and by default) binds to document.body. Use native DOM events to manage controlled instances state.

Use `ESLToggleableDispatcher.init()` to initialize (and bind) ESLToggleableDispatcher.

---

### Toggleable Attributes / Property
 - `open` - active state marker

 - `body-class` - CSS class to add on the body element
 - `active-class` - CSS class to add when the Toggleable is active
 - `group` (`groupName`) - Toggleable group meta information to organize groups
 - `close-on` (`closeTrigger`) - Selector to mark inner close triggers
 - `close-on-esc` - Close the Toggleable on ESC keyboard event
 - `close-on-outside-action` - Close the Toggleable on a click/tap outside

 - `initial-params` - Initial params to pass to show/hide action on start
 - `default-params` - Default params to merge into passed action params

### Toggleable Implementation API
 - `onShow` - 'show' actions to execute when the instance becomes active
 - `onHide` - 'hide' actions to execute when the instance becomes inactive
 
### Toggleable Public API:
 - `show` - trigger element activation
 - `hide` - trigger element deactivation
 - `toggle` - toggle element state
