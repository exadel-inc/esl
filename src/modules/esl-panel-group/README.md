# [ESL](../../../) Panel Group

Version: *3.0.0*.  

Authors: *Julia Murashko*, *Alexey Stsefanovich (ala'n)*, *Anastasia Lesun*.

<a name="intro"></a>

**ESLPanelGroup** is a custom element used as a container for a group of `ESLPanel`s. 
`ESLPanelGroup` provides group behavior, such as synchronized content state change.

```js
ESLPanelGroup.register();
```

### ESLPanelGroup Attributes | Properties:
 
- `panel-sel` - child panels selector ('esl-panel' by default)
- `mode` - rendering mode of the component (takes values from the list of supported modes; 'accordion' by default)
- `mode-cls` - rendering mode class pattern (default: `esl-{mode}-view`). Uses ESLUtils `format` syntax for `mode` placeholder
- `mode-cls-target` - Element [ESLTraversingQuery](../esl-traversing-query/README.md)  selector to add class that identifies mode (ESLPanelGroup itself by default)
- `animation-class` - class(es) to be added during animation ('animate' by default)
- `no-animate` - list of breakpoints to skip collapse/expand animation (for both Group and Panel animations)
- `refresh-strategy` - defines behavior of active panel(s) in case of configuration change:
  * `initial` - activates initially opened panel(s)
  * `last` - maintains a currently active panel(s) open
  * `open` - open max of available panels
  * `close` - close all the panels (to the min of open items)
- `min-open-items` - defines the minimum number ('0 | 1 | number | all') of panels that could be opened ('1' by default)
- `max-open-items` - defines the maximum number ('0 | 1 | number | all') of panels that could be opened ('1' by default)
- `transform-params` - JSON of action params to pass into panels when executing reset action (happens when the mode is changed)

### Readonly attributes

- `has-opened` - readonly attribute that indicates whether the panel group has opened panels
- `current-mode` - readonly attribute that indicates the currently applied rendering mode of the panel group
- `animating` - a marker of animation process running

### Events

- `esl:change:mode` - thrown when panel group changes mode
