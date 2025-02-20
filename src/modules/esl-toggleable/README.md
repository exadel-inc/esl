# [ESL](https://esl-ui.com/) Toggleable

Version: *3.1.0*.

Authors: *Julia Murashko*, *Alexey Stsefanovich (ala'n)*.

<a name="intro"></a>

**ESLToggleable** - a custom element, that is used as a base for "Popup-like" components creation.

`ESLToggleableDispatcher` - plugin component, that prevents activation of multiple `ESLToggleable` instances in bounds of managed container.
Usually (and by default) binds to `document.body`. Uses native DOM events to manage controlled instances state.

Use `ESLToggleableDispatcher.init()` to initialize (and bind) `ESLToggleableDispatcher`.

---

### Toggleable Attributes / Properties
 - `open` - active state marker

 - `active-class` - CSS class(es) (supports CSSClassUtils syntax) to add
   when the Toggleable is active (and remove when inactive)
 - `body-class` - CSS class(es) (supports CSSClassUtils syntax) to add on the body element (removes when inactive).
 - `container-active-class` - CSS class(es) (supports CSSClassUtils syntax) to add
   when the Toggleable is active (and remove when inactive) to/from 'container' element defined
   by `container-active-class-target`.
 - `container-active-class-target` - selector for the closest parent element to add/remove classes
   from `container-active-class`. The default value is `*` (direct parent).

 - `group` (`groupName`) - Toggleable group meta information to organize groups
 - `no-auto-id` - Disallow automatic id creation when it's empty

 - `close-on` (`closeTrigger`) - Selector to mark inner close triggers
 - `close-on-esc` - Close the Toggleable on ESC keyboard event
 - `close-on-outside-action` - Close the Toggleable on a click/tap outside

 - `a11y` - Accessibility behavior pattern. <i class="badge badge-sup badge-success">new</i>  
    Available values:
    - `none` (default) - does not affect focus management or behavior
    - `autofocus` - focus on the first focusable element on show
    - `popup` - focus on the first focusable element and return focus to the activator after the last focusable element. Closees on focus lost when `close-on-outside-action` is set.
    - `modal` - focus on the first focusable element and trap focus inside the Toggleable. Does not allow focus lost outside. Closes active Toggleables in 'ppopup' mode.
    - `dialog` - focus on the first focusable element and trap focus inside the Toggleable. Does not allow focus lost outside. Does not close active Toggleables in 'ppopup' mode. <i class="badge badge-sup badge-warning">beta</i>

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
