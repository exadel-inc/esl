# [ESL](../../../) Trigger

Version: *2.0.0*

Authors: *Alexey Stsefanovich (ala'n)*, *Julia Murashko*

<a name="intro"></a>

ESLTrigger - custom element, that allows to trigger ESLToggleable instances state changes.

### Attributes / Properties

- `active` - readonly marker of active Toggleable target

- `active-class` - CSS classes to set on active state

- `active-class-target` - target element TraversingQuery selector to set `active-class`

- `target` - target Toggleable TraversingQuery selector (`next` by default)

- `track-click` - `ESLMediaQuery` to define allowed to track click event media. (Default: `all`)
  
- `track-hover` - `ESLMediaQuery` to define allowed to track hover event media. (Default: `not all`)

- `mode` - action to pass to the Toggleable. Supports `show`, `hide` and `toggle` values (`toggle` by default)

- `ignore` - selector to ignore inner elements

- `a11y-target` - selector of inner target element to place aria attributes. Uses trigger itself if blank

- `show-delay` - show delay value (number in ms or `none`)

- `hide-delay` - hide delay value (number in ms or `none`)

- `hover-show-delay` - show delay override value for hover (number in ms or `none`)

- `hover-hide-delay` - hide delay override value for hover (number in ms or `none`)
