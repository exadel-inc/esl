# [ESL](../../../README.md) Panel & Panel Stack

Version: *1.0.0*.  

Authors: *Julia Murashko*.

ESLPanel is a custom element that is used as a wrapper for content that can be shown or hidden.
Can use collapsing/expanding animation (smooth height change).
Can be used in conjunction with ESLPanelGroup to control a group of ESLPopups

ESLPanelGroup is a custom element that is used as a container for a group of ESLPanels.
ESLPanelGroup provides group behaviour, such as synchronized content state change.

**Note:** ESLPanelGroup should be registered before ESLPanel.

```javascript
ESLPanelGroup.register();
ESLPanel.register();
```

### ESLPanel Attributes | Properties:

 - `active-class` - class(es) to be added for active state ('open' by default)
 - `animate-class` - class(es) to be added during animation ('animate' by default)
 - `post-animate-class` - class(es) to be added during animation after next render ('post-animate' by default)
 - `fallback-duration` - time to clear animation common params (max-height style + classes) ('auto' by default)
 - `initial-params` - initial params for current ESLPanel instance
 
ESLPanel extends [ESLToggleable](./../esl-toggleable/README.md) you can find other supported options in its documentation.

### ESLPanelGroup Attributes | Properties:
 
- `mode` - rendering mode of the component (takes values from list of supported modes; 'accordion' by default).
- `mode-cls-target` - Element [ESLTraversingQuery](./../esl-traversing-query/README.md)  selector to add class that identifies mode (ESLPanelGroup itself by default)
- `animation-class` - class(es) to be added during animation ('animate' by default)
- `fallback-duration` - time to clear animation common params (max-height style + classes) ('auto' by default)
- `no-collapse` - list of comma separated modes to disable ESLPanelGroup own collapse/expand animation
