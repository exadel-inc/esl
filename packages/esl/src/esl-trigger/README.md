# [ESL](../../../) Trigger

Version: *2.1.0*.

Authors: *Alexey Stsefanovich (ala'n)*, *Julia Murashko*.

<a name="intro"></a>

**ESLTrigger** - a custom element, that allows triggering `ESLToggleable` instances state changes.

**NOTE** (update `5.8.0`): Starting from `5.8.0` version, default `ESLTrigger` styles handle missing target element by setting `display: none` to the trigger element. 
If you want to keep the trigger visible, you can override default styles for the `no-target` attribute of the trigger `esl-trigger[no-target] { display: block; }`, 
or just skip importing default styles in your project.
It is also important to note that there is no more indirect console warning about missing target element, 
use selector query with `no-target` attribute or rely on hidden state of the trigger element that comes out of the box now.

### Attributes / Properties
- 
- `active-class` - CSS classes to set on active state

- `active-class-target` - target element ESLTraversingQuery selector to set `active-class`

- `target` - target Toggleable ESLTraversingQuery selector

- `track-click` - [MediaQuery](../esl-media-query/README.md) to define allowed to track click event media. (Default: `all`)
  
- `track-hover` - [MediaQuery](../esl-media-query/README.md) to define allowed to track hover event media. (Default: `not all`)

- `ignore-esc` - to disallow handle ESC keyboard event to hide target element

- `mode` - action to pass to the Toggleable. Supports `show`, `hide` and `toggle` values (`toggle` by default)

- `ignore` - selector to ignore inner elements

- `a11y-target` - selector of inner target element to place aria attributes. Uses trigger itself if blank

- `a11y-label-active` - value of aria-label for active state

- `a11y-label-inactive` - value of aria-label for inactive state

- `show-delay` - show delay value (number in ms or `none`)

- `hide-delay` - hide delay value (number in ms or `none`)

- `hover-show-delay` - show delay override value for hover (number in ms or `none`)

- `hover-hide-delay` - hide delay override value for hover (number in ms or `none`)

### Readonly Attributes / Properties

- `active` - readonly marker of active Toggleable target

- `no-target` - readonly marker to indicate that no target Toggleable was found <i class="badge badge-sup badge-success">new</i>

### Events

- `esl:change:active` - thrown when trigger changes its state
