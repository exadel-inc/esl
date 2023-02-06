# [ESL](https://esl-ui.com/) Toggleable

Version: *3.0.0*.

Authors: *Julia Murashko*, *Alexey Stsefanovich (ala'n)*.

<a name="intro"></a>

**ESLToggleable** - a custom element, that is used as a base for "Popup-like" components creation.

`ESLToggleableDispatcher` - plugin component, that prevents activation of multiple `ESLToggleable` instances in bounds of managed container.
Usually (and by default) binds to `document.body`. Uses native DOM events to manage controlled instances state.

Use `ESLToggleableDispatcher.init()` to initialize (and bind) `ESLToggleableDispatcher`.

---

### Toggleable Attributes / Properties
 - `open` - active state marker

 - `body-class` - CSS class to add on the body element
 - `active-class` - CSS class to add when the Toggleable is active
 - `group` (`groupName`) - Toggleable group meta information to organize groups
 - `no-auto-id` - Disallow automatic id creation when it's empty
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

### Events
- `esl:before:show` - thrown when toggleable change is going to be activated(open)
- `esl:before:hide` - thrown when toggleable change is going to be deactivated
- `esl:show` - thrown when toggleable change its state to active(open)
- `esl:hide` - thrown when toggleable change its state to inactive
