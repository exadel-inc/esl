# [ESL](../../../README.md) Panel & Panel Stack

Version: *1.0.0-beta*.  
***Important Notice: the component is under beta version, it was tested and now ready to use but be aware of its potential critical API changes.***

Authors: *Julia Murashko*.

ESLPanel - is a custom element, that is used as a wrapper for content that 
can be shown/hidden or collapsed (height animation).

ESLPanelGroup - is a custom element, container that is used to control a group of panels and provides group behaviour, such as synchronized content state change.

**Note:** ESLPanelGroup should be registered before ESLPanel.

```javascript
ESLPanelGroup.register();
ESLPanel.register();
```

### Attributes:

**ESLPanel component**

 - `active-class` - classes to be added while active state
 - `animate-class` - classes to be added during animation
 - `post-animate-class` - classes to be added during animation after next render
 - `fallback-duration` - time after which the animation will be cleared ('auto' by default)
 - `initial-params` - initial params for current ESLPanel instance
 
**Note:** List of other supported attributes you can find here [ESLToggleable](./../esl-toggleable/README.md).
 
**ESLPanelGroup component**
 
- `mode` - mode of the component. Takes values from list of supported modes ('accordion' by default).
- `mode-cls-target` - target element [ESLTraversingQuery](./../esl-traversing-query/README.md) select to add mode classes
- `animation-class` - classes to be added during animation
- `fallback-duration` - time after which the animation will be cleared ('auto' by default)
- `no-collapse` - Prevent collapse animation according to [ESLMediaRuleList](./../esl-media-query/README.md) ESLMediaRuleList
