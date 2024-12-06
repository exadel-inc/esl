# [ESL](../../../) Popup

Version: *2.0.0-beta*.  

Authors: *Dmytro Shovchko*, *Alexey Stsefanovich (ala'n)*.

***Important Notice: the component is under beta version, it is tested and ready to use but be aware of its potential critical API changes.***

<a name="intro"></a>

**ESLPopup** is a custom element used as a wrapper for content that can be displayed as a pop-up GUI element.
`ESLPopup` is based on `ESLToggleable` and works in pairs with `ESLTrigger` which allows triggering ESLPopup instances state changes.

ESLPopup can only function correctly if it's placed directly inside the `document.body`. 
Therefore, when it connects to the DOM, it checks if it's in the body and, if it's not, 
it moves itself to the `document.body` and leaves an `ESLPopupPlaceholder` element in its place. 

### ESLPopup

What is a popup window? It is a rectangular area with content that is displayed above the main content of the page right next to the element that activated the popup. In other words, it's just a rectangle whose position relative to the trigger element is calculated according to some rules. To use a popup element with ease, you need to know these rules, so here is a brief description of them.

#### Popups arrow

A popup is an element that is displayed quite often, along with an arrow that focuses on the element that triggered the popup. An arrow is a regular span element inside a popup that has a special class (see `ESLPopup Attributes` section for how to define a custom arrow class) on it. The `ESLPopup` element always checks for the presence of an arrow inside and creates it in case of its absence. So if you need a popup without an arrow, add the `disable-arrow` class to `ESLPopup` element.

#### Popups positioning

The position of the popup window is set relative to the element that activates it. The minimum necessary way to set the position is to specify which side of the trigger element you want the popup to be placed on. This can be done using the `position` attribute, in which you can specify one of four values: `top`, `bottom`, `left`, or `right`.

Positioning on the page works in a two-dimensional coordinate system. So we have two axes. One of them is called the major axis. It will be the vertical axis if we specify the `top` or `bottom` position, or it will be the horizontal axis if we specify `left` or `right`.

The other axis is called the minor axis. It is also possible to position a popup along it. The popup has a size: width or height, so we can specify a percentage offset of the popup from the center of the trigger element. For example, `0` means that the start edge of the popup is positioned opposite to the center of the trigger, `100` means the end edge of the popup is opposite the center of the trigger, and `50` means the center of the popup is opposite the center of the trigger. This is like left, right, and center for horizontal alignment, or top, bottom, and middle for vertical alignment. This way we have an additional option for setting the position of the popup. To do this, we use an attribute called `offset-arrow` in which we specify the percentage of offset. For pages with RTL text direction, the start and end edges of the popup are reversed.

When a popup is displayed with an arrow, the arrow may extend beyond the popup when using the `0` and `100` thresholds or values close to them. To prevent this, we use the concept of margins on the edges of the popup. It sets the value in pixels using the `margin-arrow` attribute. This means that the extreme positions of the popup when positioned along the minor axis should be at a distance specified by the `margin-arrow` attribute from the edges of the popup. This way, the popup arrow will never look bad at the edge positions.

Finally, the last parameter that directly affects the positioning of the popup is the distance between the edge of the popup and the edge of the trigger element. The `offsetTrigger` property of the popup parameters determines this distance. By default, it is 3 pixels. To set your value, you must define the `default-params` attribute with the value `"{offsetTrigger: your_value}"` on the popup element.

#### Behavioral positioning of the popup

With the positioning of the popup window, everything seems to be clear - there are features for setting the position precisely. But...

The browser viewport has a certain size and the page author does not always have the opportunity to position the trigger element conveniently. Therefore, there is always a certain possibility that, according to all the rules of positioning, the popup will go beyond the browser viewport. In such situations, the popup should have instructions:
 - whether it can go beyond the viewport;
 - if not, what behavioral strategy to use to adjust the positioning rules;
 - instructions for fine-tuning the behavioral positioning;
 - whether the popup should observe the intersection of the viewport for the entire time it is activated.

##### Optimistic scenario

If there is no space where you set it, then let's assume that you just guessed wrong and all the free space is on the other side or somewhere nearby. So let's let the popup find the optimal location on its own.

Here it is important to choose the behavioral strategy that the popup should follow. It is specified by the `behavior` attribute. Possible values: `fit`, `fit-major`, `fit-minor`, `none`.

The `fit-major` strategy instructs the popup to always try to stay within the viewport but to adjust its positioning only along the major coordinate axis. In practice, it looks like this: if you specify which side of the trigger the popup should be on, and there is no place for it, the popup seems to flip relative to the element trigger. If the position was top, it flips and becomes bottom, if it was left, it becomes right, and vice versa.

The `fit-minor` strategy instructs the popup to always try to stay within the viewport but to adjust the positioning only along the minor coordinate axis. In practice, it looks like this: if you specify an `offset-arrow` attribute (like alignment relative to the trigger element), but the popup goes outside the viewport, the `offset-arrow` will be changed to the minimum value sufficient to keep the popup within the viewport. For example, your popup has a default setting of showing an arrow in the middle. But the trigger is near the edge of the window, so the popup will be forced to move to the left to fit in the viewport. Since the arrow is centered on the trigger, it looks like the popup arrow has moved to the right.

The strategy called `fit` instructs the popup to adjust its positioning along both (major and minor) coordinate axes so that it always tries to stay within the viewport. This is like applying the `fit-major` and `fit-minor` strategies at the same time.

The `none` strategy instructs the popup to do nothing to prevent it from moving outside the viewport.

The updated position of the popup relative to the trigger after checking and applying refinement strategies is displayed in the read-only attribute `placed-at`.

##### Pessimistic scenario

Your popup is too large. So large that it creates problems in finding the position of the popup so that it fits all the specified criteria. What will happen and how will the popup behave?

If the size of the popup is so large and the trigger element is positioned so inconveniently that there is not enough space along the major axis to place it. At first, the popup will try to place itself where you specify via the `position` attribute. If there is not enough space, the popup will change the `position` value to the opposite. After that, it will not check for free space, everything will remain as it is. If there is no space here, then so be it! The popup should be displayed anyway.

If the size of the popup is inconvenient for correct placement along the minor axis (the popup arrow, or the popup itself has large margins or size), the following will happen. First, the popup will try to position itself as specified by the `offset-arrow` attribute. After that, it checks its starting side (left or top) to see if it is out of bounds. If it does, then the position is adjusted towards the end side by the amount of the overrun. At the same time, the position of the popup arrow is checked. If it goes beyond the permitted limits (popup boundaries + arrow indents), the position adjustment is canceled. After that, the same check is performed for the end side (right or bottom). Does it need to make adjustments? If it is necessary, will this adjustment break the position of the popup arrow? If the adjustment would break the popup arrow, the adjustment is canceled. The popup will be displayed as it is.

##### Additional setup

You can set the minimum distance between the popup and the viewport. And your popup will always be at a distance from the edge of the viewport if there is enough free space. The `offsetContainer` property of the popup parameters sets this distance. By default, it is 15 pixels. To set your value, you must define the `default-params` attribute with the value `"{offsetContainer: your_value}"` on the popup element.

You can specify an element that will be used as the viewport. The attribute called `container` is used for this purpose. The value is an [ESLTraversingQuery](../esl-traversing-query/README.md) selector that specifies an element whose borders serve as the boundaries of the popup's visibility. By default, `window` is used.

To prevent the popup window with the activator element (trigger) from going outside the viewport during certain events (scrolling, resizing, or something similar), the IntersectionObserver API is used. The trigger element is observed. If it has left or is about to leave (partial leaving is detected) the viewport, the popup will be deactivated and hidden. It is possible to change the area near the edges of the viewport so that the observer reacts more gently or more severely to the approach of the element trigger to the edges. This is accomplished by using the margins at the edges of the viewport. The margins are set using the `intersectionMargin` property of the popup window parameters. The default is "0px". To set your value, you must define the `default-params` attribute with the value `"{intersectionMargin: your_value}"` on the popup element.

It is possible to disable the observation of the popup leaving the viewport. To do this, use the `disable-activator-observation` attribute. If you set this attribute on the popup, the popup will not adjust its position along the major axis (deactivating the `fit-major` behavior) and will not hide the popup when the triggered element goes outside the viewport when scrolling or resizing.

#### A few useful customization options

It is possible to configure so that when a popup is activated and displayed, the focus is transferred to it, i.e. it is selected to receive an input event from the user, and when the popup is deactivated and hidden, the focus returns to the activator element (trigger). This is handled by the `autofocus` property of the popup parameters. It is disabled by default. Therefore, to enable it, define the `default-params` attribute on the popup element with the following content `"{autofocus: true}"` and the `tabindex` attribute to set in 0.

You can also add additional classes and styles when activating and displaying the popup. This is set using the `extraClass` and `extraStyle` properties of the popup parameters. For example, on the popup element, we define the `default-params` attribute with the following content `"{extraClass: 'your-class', extraStyle: 'color: red'}"`.

#### Attributes | Properties:

- `position` - popup position relative to the trigger (currently supported: 'top', 'bottom', 'left', 'right' ) ('top' by default)
  
- `position-origin` <i class="badge badge-sup badge-warning">beta</i> - this attribute specifies from which side of the trigger grows popup to achieve the desired position ('outer' by default). Available options:
  - `outer` - popup grows from the outside of the trigger relative to the positioning direction and cannot overlap the trigger
  - `inner` - popup grows from the inside of the trigger relative to the positioning direction and will overlap the trigger
  
- `behavior` - popup behavior if it does not fit in the window ('fit' by default). Available options:
  - `fit` - default, the popup will always be positioned in the right place. Position dynamically updates so it will
    always be visible
  - `fit-major` - same as fit, but position dynamically updates only on major axes. Looks like a flip in relation to the trigger
  - `fit-minor` - same as fit, but position dynamically updates only on minor axes. Looks like alignment to the arrow
  - `none`, empty or unsupported value - will not be prevented from overflowing clipping boundaries, such as the viewport

- `container` - defines container element ([ESLTraversingQuery](../esl-traversing-query/README.md) selector) to determine bounds of popup visibility (window by default)
  
- `disable-activator-observation` (boolean) - disable hiding the popup depending on the visibility of the activator

- `arrow-class` - the class name of the element that is the popup's arrow (`esl-popup-arrow` by default)
  
- `margin-arrow` - margins on the edges of the arrow. This is the value in pixels that will be between the edge of the popup and the arrow at extreme positions of the arrow when offsetArrow is set to 0 or 100 (5 by default)
  
- `offset-arrow` - offset of the arrow as a percentage of the popup edge. 0% - at the left edge, 100% - at the right edge, for RTL it is vice versa (50 by default)

ESLPopup extends [ESLToggleable](../esl-toggleable/README.md) you can find other supported options in its documentation.

#### Readonly Attributes

- `placed-at` - popup updated position relative to the trigger. In other words, this is the real position of the popup relative to the trigger after the position update in the case when 'fit' behavior is enabled

#### Public API

 - `$placeholder` - the placeholder element that replaces this popup that was moved to `document.body`
 - `$arrow` - getter that returns popups arrow element

### ESLPopupPlaceholder

This is a special element that has the sole responsibility of being a substitute for the original `ESLPopup` element that has been moved inside `document.body`. That is if the backend generated a page with `ESLPopup` in a certain place and it automatically moved to `document.body`, you do not have to search for this popup because `ESLPopupPlaceholder` stores a link to the original element.

#### Attributes | Properties:

When you add a placeholder to the DOM tree, all attributes are copied from the original to the placeholder. But there is an exception - the `id` attribute is converted to the `original-id` attribute.

#### Public API

 - `from` - static method that creates a placeholder for a given popup element
 - `$origin` - the original element that was here before it was replaced by a placeholder

### Styles

ESLPopup is a non-trivial component that calculates its position depending on user settings. So for styling, it would be advisable to use the basic styles that we provide with our library. You can easily override most of the rules from the base styles. Some properties are calculated, so you can't override them directly, but it is possible to set the value through CSS variables. For now, you can use the following variables:

- `--esl-popup-arrow-size` - arrow size ('20px' by default)
- `--esl-popup-background-color` - background color of the popup ('#fff' by default)
- `--esl-popup-border-color` - popup border color ('#dbdbdb' by default)
- `--esl-popup-border-width` - border width of the popup ('1px' by default)
- `--esl-popup-z-index` - z-index of the popup ('999' by default)

Or if you are using the LESS preprocessor, you can optionally use mixins instead of CSS variables. However, we would recommend using the general approach with CSS variables.

### Refreshing popup position

The popup component watches for outside events and updates its position automatically. In case when you require a popup position update and it can't do it automatically you should use `esl:refresh` event. The popup window will update its position in case when esl:refresh event was emitted from popup content, the container element, or popups trigger.
