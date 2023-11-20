# [ESL](../../../) Panel

Version: *3.0.0*.

Authors: *Julia Murashko*, *Alexey Stsefanovich (ala'n)*, *Anastasia Lesun*.

<a name="intro"></a>

**ESLPanel** is a custom element that is used as a wrapper for content that can be shown or hidden.
Can use collapsing/expanding animation (smooth height change).
Can be used in conjunction with `ESLPanelGroup` to control a group of ESLPopups

```js
ESLPanel.register();
```

### ESLPanel Attributes | Properties:

 - `active-class` - class(es) to be added for active state ('open' by default)
 - `animate-class` - class(es) to be added during animation ('animate' by default)
 - `post-animate-class` - class(es) to be added during animation after next render ('post-animate' by default)
 - `initial-params` - initial params for current ESLPanel instance
 - `animating` - a marker of animation process running

ESLPanel extends [ESLToggleable](../esl-toggleable/README.md) you can find other supported options in its documentation.

### Events

- `esl:before:show` - thrown when panel is going to change its state to expanded
- `esl:before:hide` - thrown when panel is going to change its state to collapsed
- `esl:show` - thrown when panel change its state to expanded
- `esl:hide` - thrown when panel change its state to collapsed
- `esl:after:show` - thrown when panel changed its state to expanded
- `esl:after:hide` - thrown when panel changed its state to collapsed
