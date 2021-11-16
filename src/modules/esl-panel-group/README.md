# [ESL](https://esl-ui.com/) Panel Group

Version: *2.1.0*.  

Authors: *Julia Murashko*.

ESLPanelGroup is a custom element that is used as a container for a group of ESLPanels.
ESLPanelGroup provides group behaviour, such as synchronized content state change.

**Note:** ESLPanelGroup should be registered before ESLPanel.

```js
ESLPanelGroup.register();
```

### ESLPanelGroup Attributes | Properties:
 
- `mode` - rendering mode of the component (takes values from list of supported modes; 'accordion' by default).
- `mode-cls-target` - Element [ESLTraversingQuery](https://esl-ui.com/utils/esl-traversing-query/)  selector to add class that identifies mode (ESLPanelGroup itself by default)
- `animation-class` - class(es) to be added during animation ('animate' by default)
- `fallback-duration` - time to clear animation common params (max-height style + classes) (2s by default)
- `no-collapse` - list of comma-separated "modes" to disable collapse/expand animation (for both Group and Panel animations)
- `accordion-group` - defines accordion behavior: 
  * `single` (default) allows only one Panel to be open.
  * `multiple` allows any number of open Panels.
