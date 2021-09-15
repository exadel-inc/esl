# [ESL](https://exadel-inc.github.io/esl/) Popup

Version: *2.0.0-beta*.  

Authors: *Alexey Stsefanovich (ala'n), Dmytro Shovchko*.

***Important Notice: the component is under beta version, it is tested and ready to use but be aware of its potential critical API changes.***

<a name="intro"></a>

ESLPopup is a custom element that is used as a wrapper for content that can be displayed as a pop-up GUI element.
ESLPopup is based on ESLToggleable and works in pair with ESLTrigger that allows triggering ESLPopup instances state changes.

### ESLPopup Attributes | Properties:

- `position` (string) - popup position relative to trigger (currently supported: 'top', 'bottom', 'left', 'right' ) ('top' by default)
  
- `behavior` (string) - popup behavior if it does not fit in the window ('fit' by default). Available options:
  - `fit` - default, popup will always be positioned in the right place. Position dynamically updates so it will always be visible
  - empty or unsupported value - will not be prevented from overflowing clipping boundaries, such as the viewport

ESLPopup extends [ESLToggleable](https://exadel-inc.github.io/esl/components/esl-toggleable/) you can find other supported options in its documentation.

### Readonly Attributes

- `placed-at` (string) - popup updated position relative to the trigger. In other words, this is the real position of the popup relative to the trigger after the position update in the case when 'fit' behavior is enabled
