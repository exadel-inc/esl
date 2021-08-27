# [ESL](../../../README.md) Panel & Panel Stack

Version: *2.0.0*.  

Authors: *Julia Murashko*.

ESLPanel is a custom element that is used as a wrapper for content that can be shown or hidden.
Can use collapsing/expanding animation (smooth height change).
Can be used in conjunction with ESLPanelGroup to control a group of ESLPopups

```javascript
ESLPanel.register();
```

### ESLPanel Attributes | Properties:

 - `active-class` - class(es) to be added for active state ('open' by default)
 - `animate-class` - class(es) to be added during animation ('animate' by default)
 - `post-animate-class` - class(es) to be added during animation after next render ('post-animate' by default)
 - `fallback-duration` - time to clear animation common params (max-height style + classes) ('auto' by default)
 - `initial-params` - initial params for current ESLPanel instance
 
ESLPanel extends [ESLToggleable](./../esl-toggleable/README.md) you can find other supported options in its documentation.
