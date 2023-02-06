# [ESL](../../../) Popup

Version: *2.0.0-beta*.  

Authors: *Alexey Stsefanovich (ala'n), Dmytro Shovchko*.

***Important Notice: the component is under beta version, it is tested and ready to use but be aware of its potential critical API changes.***

<a name="intro"></a>

ESLPopup is a custom element that is used as a wrapper for content that can be displayed as a pop-up GUI element.
ESLPopup is based on ESLToggleable and works in pair with ESLTrigger that allows triggering ESLPopup instances state changes.

ESLPopup can only function correctly if it's placed directly inside the document.body. Therefore, when it connects to the DOM, it checks if it's in the body, and if it's not, it moves itself to the document.body and leaves an ESLPopupPlaceholder element in its place. 

### ESLPopup Attributes | Properties:

- `position` (string) - popup position relative to the trigger (currently supported: 'top', 'bottom', 'left', 'right' ) ('top' by default)
  
- `behavior` (string) - popup behavior if it does not fit in the window ('fit' by default). Available options:
  - `fit` - default, popup will always be positioned in the right place. Position dynamically updates so it will always be visible
  - `fit-major` - same as fit, but position dynamically updates only on major axes. Looks like a flip in relation to the trigger
  - `fit-minor` - same as fit, but position dynamically updates only on minor axes. Looks like alignment to the arrow
  - empty or unsupported value - will not be prevented from overflowing clipping boundaries, such as the viewport
  
- `container` - defines container element ([TraversingQuery](../esl-traversing-query/README.md) selector) to determinate bounds of popup visibility (window by default)
  
- `disable-activator-observation` (boolean) - disable hiding the popup depending on the visibility of the activator
  
- `margin-arrow` - margins on the edges of the arrow. This is the value in pixels that will be between the edge of the popup and the arrow at extreme positions of the arrow when offsetArrow is set to 0 or 100 (5 by default)
  
- `offset-arrow` - offset of the arrow as a percentage of the popup edge. 0% - at the left edge, 100% - at the right edge, for RTL it is vice versa (50 by default)

ESLPopup extends [ESLToggleable](../esl-toggleable/README.md) you can find other supported options in its documentation.

### Readonly Attributes

- `placed-at` (string) - popup updated position relative to the trigger. In other words, this is the real position of the popup relative to the trigger after the position update in the case when 'fit' behavior is enabled
