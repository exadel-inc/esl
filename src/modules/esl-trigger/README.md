# [ESL](../../../README.md) Trigger

Version: *1.1.0*

Authors: *Alexey Stsefanovich (ala'n)*, *Julia Murashko*

ESLTrigger - custom element, that allows to trigger ESLToggleable instances state changes.

### Attributes / Properties

- `active` - readonly marker of active Toggleable target

- `active-class` - CSS classes to set on active state

- `active-class-target` - target element TraversingQuery selector to set `active-class`

- `target` - target Toggleable TraversingQuery selector (`next` by default)

- `event` - event to handle by trigger. Supports `click`, `hover` modes or any custom (`click` by default)

- `mode` - action to pass to the Toggleable. Supports `show`, `hide` and `toggle` values (`toggle` by default)

- `ignore` - selector to ignore inner elements

- `a11y-target` - selector of inner target element to place aria attributes. Uses trigger itself if blank

- `show-delay` - show delay value in ms

- `hide-delay` - hide delay value in ms

- `touch-show-delay` - show delay value for touch devices in ms

- `touch-hide-delay` - hide delay value for touch devices in ms
