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

The other axis is called the minor axis. It is also possible to position a popup along it. To do this, we use a binding system called a tether axis. Imagine an invisible axis, a conditional line of mutual reference between the trigger and the popup. With just a few attributes, you can easily specify the position of the tether axis and position the popup in any way you want relative to it and to the trigger itself. The following images show schemes that will explain how it works.

<figure style="margin-bottom:1rem;text-align:center">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 400" style="max-width:950px;width:100%"><style>@import url(https://fonts.googleapis.com/css2?family=Sofia+Sans+Extra+Condensed);</style><defs><g id="trigger-tether"><path fill="#dcdcdc" stroke="silver" stroke-width="2" d="M0 0h500v250H0z"/><text x="80" y="135" font-family="Sofia Sans Extra Condensed" font-size="40">tether alignment on the trigger</text><circle r="5" fill="none" stroke="#ff69b4" stroke-width="2"/><text x="-30" y="-15" fill="#ff69b4" font-family="Sofia Sans Extra Condensed" font-size="22">position=&quot;top start&quot;</text><circle cx="250" r="5" fill="none" stroke="#ff69b4" stroke-width="2"/><text x="210" y="-15" fill="#ff69b4" font-family="Sofia Sans Extra Condensed" font-size="22">position=&quot;top&quot;</text><circle cx="500" r="5" fill="none" stroke="#ff69b4" stroke-width="2"/><text x="410" y="-15" fill="#ff69b4" font-family="Sofia Sans Extra Condensed" font-size="22">position=&quot;top end&quot;</text><circle cx="500" r="8" fill="none" stroke="#9400d3" stroke-width="2"/><text x="505" y="25" fill="#9400d3" font-family="Sofia Sans Extra Condensed" font-size="22">position=&quot;right start&quot;</text><circle cx="500" cy="125" r="8" fill="none" stroke="#9400d3" stroke-width="2"/><text x="515" y="130" fill="#9400d3" font-family="Sofia Sans Extra Condensed" font-size="22">position=&quot;right&quot;</text><circle cx="500" cy="250" r="8" fill="none" stroke="#9400d3" stroke-width="2"/><text x="505" y="235" fill="#9400d3" font-family="Sofia Sans Extra Condensed" font-size="22">position=&quot;right end&quot;</text><circle cy="250" r="5" fill="none" stroke="#ff4500" stroke-width="2"/><text x="-30" y="275" fill="#ff4500" font-family="Sofia Sans Extra Condensed" font-size="22">position=&quot;bottom start&quot;</text><circle cx="250" cy="250" r="5" fill="none" stroke="#ff4500" stroke-width="2"/><text x="200" y="275" fill="#ff4500" font-family="Sofia Sans Extra Condensed" font-size="22">position=&quot;bottom&quot;</text><circle cx="500" cy="250" r="5" fill="none" stroke="#ff4500" stroke-width="2"/><text x="390" y="275" fill="#ff4500" font-family="Sofia Sans Extra Condensed" font-size="22">position=&quot;bottom end&quot;</text><circle r="8" fill="none" stroke="#48d1cc" stroke-width="2"/><text x="-135" y="25" fill="#48d1cc" font-family="Sofia Sans Extra Condensed" font-size="22">position=&quot;left start&quot;</text><circle cy="125" r="8" fill="none" stroke="#48d1cc" stroke-width="2"/><text x="-105" y="130" fill="#48d1cc" font-family="Sofia Sans Extra Condensed" font-size="22">position=&quot;left&quot;</text><circle cy="250" r="8" fill="none" stroke="#48d1cc" stroke-width="2"/><text x="-125" y="235" fill="#48d1cc" font-family="Sofia Sans Extra Condensed" font-size="22">position=&quot;left end&quot;</text></g></defs><use x="150" y="80" href="#trigger-tether"/></svg>
<figcaption>1. Tether position on the trigger</figcaption>
</figure>

First of all, it is necessary to specify the position of the tether. This is performed using the already known `position` attribute. The value of this attribute consists of two values separated by a space. The first is the side of the trigger where the popup window should be displayed, and the second is the location of the tether, and two values are possible: `start` and `end`. If you do not specify the second value, the tether will be placed in the center by default. It works similarly to alignment. And this is what it looks like in the chart.

The next step is to indicate where the tether is positioned on the popup. This is also similar to alignment and is set by the `alignment-tether` attribute. You can specify two values: `start` and `end`, and if nothing is specified, the tether will be placed in the center by default. Here is a diagram that explains this.

<figure style="margin-bottom:1rem;text-align:center">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 200" style="max-width:950px;width:100%"><style>@import url(https://fonts.googleapis.com/css2?family=Sofia+Sans+Extra+Condensed);</style><defs><g id="popup-tether"><path fill="#dcdcdc" stroke="silver" stroke-width="2" d="M0 0h400v80H140l-40 40-40-40H0Z"/><text x="35" y="40" font-family="Sofia Sans Extra Condensed" font-size="40">tether alignment on the popup</text><circle cy="80" r="5" fill="none" stroke="red" stroke-width="2"/><text x="-100" y="105" fill="red" font-family="Sofia Sans Extra Condensed" font-size="22">alignment-tether=&quot;start&quot;</text><circle cx="200" cy="80" r="5" fill="none" stroke="brown" stroke-width="2"/><text x="170" y="105" fill="brown" font-family="Sofia Sans Extra Condensed" font-size="22">by default</text><circle cx="400" cy="80" r="5" fill="none" stroke="#9400d3" stroke-width="2"/><text x="330" y="105" fill="#9400d3" font-family="Sofia Sans Extra Condensed" font-size="22">alignment-tether=&quot;end&quot;</text></g></defs><use x="200" y="50" href="#popup-tether"/></svg>
<figcaption>2. Tether position on the popup</figcaption>
</figure>

The last step is to fine-tune the position. With these settings, you can refine the position of the tether on the trigger and the popup, as well as set the distance between the trigger and the popup. Here's a schematic view of the settings.

<figure style="margin-bottom:1rem;text-align:center">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 490" style="max-width:950px;width:100%"><style>@import url(https://fonts.googleapis.com/css2?family=Sofia+Sans+Extra+Condensed);</style><defs><path id="arrowW" d="m0 0 5 2v-4Z"/><path id="arrowE" d="m0 0-5 2v-4Z"/><path id="arrowN" d="m0 0 2 5h-4Z"/><path id="arrowS" d="m0 0 2-5h-4Z"/><g id="tether"><path fill="#dcdcdc" stroke="silver" stroke-width="2" d="M0 0h400v80H140l-40 40-40-40H0Z"/><text x="210" y="50" font-family="Sofia Sans Extra Condensed" font-size="40">popup w/ arrow</text><path fill="#dcdcdc" stroke="silver" stroke-width="2" d="M0 140h250v150H0z"/><text x="160" y="200" font-family="Sofia Sans Extra Condensed" font-size="40">trigger</text><path fill="#dcdcdc" stroke="silver" stroke-width="2" d="M-130 310h400v80h-400z"/><text x="-100" y="350" font-family="Sofia Sans Extra Condensed" font-size="40">popup w/o arrow</text><path stroke="#ff69b4" stroke-width=".5" d="M100-28v-4M100-15v50M100 48v4M100 65v50M100 128v4M100 145v50M0 170h100"/><use y="170" fill="#ff69b4" href="#arrowW"/><use x="100" y="170" fill="#ff69b4" href="#arrowE"/><path fill="none" stroke="#48d1cc" stroke-width=".5" d="m50 172-90 70h-100"/><text x="-123" y="140" fill="#9400d3" font-family="Sofia Sans Extra Condensed" font-size="20">margin-tether</text><path stroke="#ff69b4" stroke-width=".5" d="M100 120h30M120 111v38"/><use x="120" y="120" fill="#ff69b4" href="#arrowS"/><use x="120" y="140" fill="#ff69b4" href="#arrowN"/><path fill="none" stroke="#48d1cc" stroke-width=".5" d="m122 130 60-13h75"/><text x="180" y="115" fill="#9400d3" font-family="Sofia Sans Extra Condensed" font-size="20">offset-trigger</text><path stroke="#ff69b4" stroke-width=".5" d="M0 81v24M60 81v24M0 100h60"/><use y="100" fill="#ff69b4" href="#arrowW"/><use x="60" y="100" fill="#ff69b4" href="#arrowE"/><path fill="none" stroke="#48d1cc" stroke-width=".5" d="m30 102-75 40h-75"/><text x="-140" y="240" fill="#9400d3" font-family="Sofia Sans Extra Condensed" font-size="20">offset-placement</text><path stroke="#48d1cc" stroke-width=".5" d="M180 235v50M180 298v4M180 315v50M180 378v4M180 395v24M180 260h70"/><use x="180" y="260" fill="#48d1cc" href="#arrowW"/><use x="250" y="260" fill="#48d1cc" href="#arrowE"/><path fill="none" stroke="#ff69b4" stroke-width=".5" d="m220 342 110 40h75"/><text x="330" y="380" fill="#9400d3" font-family="Sofia Sans Extra Condensed" font-size="20">margin-tether</text><path stroke="#48d1cc" stroke-width=".5" d="M250 290h50M270 310h30M292 281v38"/><use x="292" y="290" fill="#48d1cc" href="#arrowS"/><use x="292" y="310" fill="#48d1cc" href="#arrowN"/><path fill="none" stroke="#ff69b4" stroke-width=".5" d="m294 300 85 17h80"/><text x="380" y="315" fill="#9400d3" font-family="Sofia Sans Extra Condensed" font-size="20">offset-trigger</text><path stroke="#48d1cc" stroke-width=".5" d="M180 340h90"/><use x="180" y="340" fill="#48d1cc" href="#arrowW"/><use x="270" y="340" fill="#48d1cc" href="#arrowE"/><path fill="none" stroke="#ff69b4" stroke-width=".5" d="m215 258 65-36h100"/><text x="280" y="220" fill="#9400d3" font-family="Sofia Sans Extra Condensed" font-size="20">offset-placement</text><text x="-140" y="-30" fill="silver" font-family="Sofia Sans Extra Condensed" font-size="20">conditional line of mutual reference</text><path fill="none" stroke="silver" stroke-width=".5" d="M98-10 56-28h-195"/><text x="-80" y="420" fill="silver" font-family="Sofia Sans Extra Condensed" font-size="20">conditional line of mutual reference</text><path fill="none" stroke="silver" stroke-width=".5" d="m178 405-62 18H-79"/></g></defs><use x="250" y="50" href="#tether"/></svg>
<figcaption>3. Popup positioning scheme</figcaption>
</figure>

As you can see, the tether is also the place where the arrow is displayed if you have a popup window with it. You can also see how the three `offset-placement`, `margin-tether`, `offset-trigger` properties can be used to determine the position of the tether and popup window.

To shift the tether on the trigger, use the `offset-placement` attribute. It sets the offset in pixels in the direction from `start` to `end`. Accordingly, a negative value moves the tether axis in the opposite direction.

When the position of the tether is clearly defined relative to the trigger, it remains to clearly define the position of the popup relative to the tether. This is done using the `alignment-tether` and `margin-tether` attributes. The first one was explained above, and the second one sets the safe distance from the edge of the popup to the tether axis. If the popup is displayed with an arrow, the specified value is increased by half the size of the arrow and sets the safe distance from the edge of the popup to the arrow.

Finally, the last parameter that directly affects the positioning of the popup is the distance between the edge of the popup and the edge of the trigger element. The `offset-trigger` attribute defines this distance.

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

The `fit-minor` strategy instructs the popup to always try to stay within the viewport but to adjust the positioning only along the minor coordinate axis. If the popup doesn't have enough space on the minor axis to stay in the viewport, it will forcefully shift its position, but no more than the amount that guarantees a safe distance from the edges of the popup, which is set by the `margin-tether` attribute. For example, your popup window has a default setting that aligns the popup with an arrow in the center. But the popup is near the right edge of the window, so the popup will be forced to move to the left to fit in the viewport. Since the arrow is centered on the trigger, it looks like the popup arrow has moved to the right.

The strategy called `fit` instructs the popup to adjust its positioning along both (major and minor) coordinate axes so that it always tries to stay within the viewport. This is like applying the `fit-major` and `fit-minor` strategies at the same time.

The `none` strategy instructs the popup to do nothing to prevent it from moving outside the viewport.

The updated position of the popup relative to the trigger after checking and applying refinement strategies is displayed in the read-only attribute `placed-at`.

##### Pessimistic scenario

Your popup is too large. So large that it creates problems in finding the position of the popup so that it fits all the specified criteria. What will happen and how will the popup behave?

If the size of the popup is so large and the trigger element is positioned so inconveniently that there is not enough space along the major axis to place it. At first, the popup will try to place itself where you specify via the `position` attribute. If there is not enough space, the popup will change the `position` value to the opposite. After that, it will not check for free space, everything will remain as it is. If there is no space here, then so be it! The popup should be displayed anyway.

If the size of the popup is inconvenient for correct placement along the minor axis (the popup arrow, or the popup itself has large margins or size), the following will happen. First, the popup will try to position itself as specified by the user. After that, it checks its starting side (left or top) to see if it is out of bounds. If it does, then the position is adjusted towards the end side by the amount of the overrun. At the same time, the position of the popup is checked. If it goes beyond the permitted limits, the position adjustment is canceled. After that, the same check is performed for the end side (right or bottom). Does it need to make adjustments? If it is necessary, will this adjustment break the position of the popup? If the new adjustment is still required, the adjustment is canceled. The popup will be displayed as it is.

##### Additional setup

You can set the minimum distance between the popup and the viewport. And your popup will always be at a distance from the edge of the viewport if there is enough free space. The `offsetContainer` property of the popup parameters sets this distance. By default, it is 15 pixels. To set your value, you must define the `default-params` attribute with the value `"{offsetContainer: your_value}"` on the popup element.

You can specify an element that will be used as the viewport. The attribute called `container` is used for this purpose. The value is an [ESLTraversingQuery](../esl-traversing-query/README.md) selector that specifies an element whose borders serve as the boundaries of the popup's visibility. By default, `window` is used.

To prevent the popup window with the activator element (trigger) from going outside the viewport during certain events (scrolling, resizing, or something similar), the IntersectionObserver API is used. The trigger element is observed. If it has left or is about to leave (partial leaving is detected) the viewport, the popup will be deactivated and hidden. It is possible to change the area near the edges of the viewport so that the observer reacts more gently or more severely to the approach of the element trigger to the edges. This is accomplished by using the margins at the edges of the viewport. The margins are set using the `intersectionMargin` property of the popup window parameters. The default is "0px". To set your value, you must define the `default-params` attribute with the value `"{intersectionMargin: your_value}"` on the popup element.

It is possible to disable the observation of the popup leaving the viewport. To do this, use the `disable-activator-observation` attribute. If you set this attribute on the popup, the popup will not adjust its position along the major axis (deactivating the `fit-major` behavior) and will not hide the popup when the triggered element goes outside the viewport when scrolling or resizing.

#### A few useful customization options

It is possible to configure so that when a popup is activated and displayed, the focus is transferred to it, i.e. it is selected to receive an input event from the user, and when the popup is deactivated and hidden, the focus returns to the activator element (trigger). This is handled by the `autofocus` property of the popup parameters. It is disabled by default. Therefore, to enable it, define the `default-params` attribute on the popup element with the following content `"{autofocus: true}"` and the `tabindex` attribute to set in 0.

You can also add additional classes and styles when activating and displaying the popup. This is set using the `extraClass` and `extraStyle` properties of the popup parameters. For example, on the popup element, we define the `default-params` attribute with the following content `"{extraClass: 'your-class', extraStyle: 'color: red'}"`.

#### Attributes | Properties:

- `position` - popup position relative to the trigger (currently supported: 'top', 'bottom', 'left', 'right' ) ('top' by default). In addition, it can contain a second option by space which defines to what side the popup aligns (currently supported: 'start', 'end') (it is centered if not specified)
  
- `position-origin` <i class="badge badge-sup badge-warning">beta</i> - this attribute specifies from which side of the trigger grows popup to achieve the desired position ('outer' by default). Available options:
  - `outer` - popup grows from the outside of the trigger relative to the positioning direction and cannot overlap the trigger
  - `inner` - popup grows to the inside of the trigger and can overlap the trigger if it is bigger than the trigger element
  
- `behavior` - popup behavior if it does not fit in the window ('fit' by default). Available options:
  - `fit` - default, the popup will always be positioned in the right place. Position dynamically updates so it will
    always be visible
  - `fit-major` - same as fit, but position dynamically updates only on major axes. Looks like a flip in relation to the trigger
  - `fit-minor` - same as fit, but position dynamically updates only on minor axes. Looks like alignment to the arrow
  - `none`, empty or unsupported value - will not be prevented from overflowing clipping boundaries, such as the viewport
  
- `alignment-tether` <i class="badge badge-sup badge-warning">beta</i> - sets the alignment of the popup relative to the tether. Currently supported values: 'start' and 'end' (it is centered if not specified)

- `margin-tether` - margins in pixels on the edges of popup. In other words, this is the safe zone between the pop-up arrow or the tether if an arrow is disabled (5 by default)

- `offset-placement` <i class="badge badge-sup badge-warning">beta</i> - sets the offset of the tether position on the trigger element (0 by default)

- `offset-trigger` - offset of the popup with an arrow from the trigger element. This is the value in pixels and also can be negative (3 by default)

- `container` - defines container element ([ESLTraversingQuery](../esl-traversing-query/README.md) selector) to determine bounds of popup visibility (window by default)
  
- `disable-activator-observation` (boolean) - disable hiding the popup depending on the visibility of the activator

- `arrow-class` - the class name of the element that is the popup's arrow (`esl-popup-arrow` by default)


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
