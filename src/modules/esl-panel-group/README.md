# [ESL](../../../) Panel Group

Version: *2.1.0*.  

Authors: *Julia Murashko*

<a name="intro"></a>

ESLPanelGroup is a custom element that is used as a container for a group of ESLPanels.
ESLPanelGroup provides group behaviour, such as synchronized content state change.

**Note:** ESLPanelGroup should be registered before ESLPanel.

```js
ESLPanelGroup.register();
```

### ESLPanelGroup Attributes | Properties:
 
- `mode` - rendering mode of the component (takes values from list of supported modes; 'accordion' by default)
- `mode-cls` - rendering mode class pattern (default: `esl-{mode}-view`). Uses ESLUtils `format` syntax for `mode` placeholder
- `mode-cls-target` - Element [ESLTraversingQuery](../esl-traversing-query/README.md)  selector to add class that identifies mode (ESLPanelGroup itself by default)
- `animation-class` - class(es) to be added during animation ('animate' by default)
- `no-animate` - list of comma-separated "modes" to disable collapse/expand animation (for both Group and Panel animations)
- `accordion-group` - defines accordion behavior: 
  * `single` (default) allows only one Panel to be open
  * `multiple` allows any number of open Panels
- `transform-params` - JSON of action params to pass into panels when executing reset action (happens when the mode is changed)

### Readonly attributes

- `view` - deprecated alias for `current-mode`
- `current-mode` - readonly attribute that indicates currently applied rendering mode of the panel group 

### Events

- `esl:change:mode` - thrown when panel group changes mode
