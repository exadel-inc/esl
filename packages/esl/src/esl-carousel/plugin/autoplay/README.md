# ESL Carousel Autoplay Plugin (custom attribute)

<a name="intro"></a>

The `esl-carousel-autoplay` is a custom attribute (mixin/plugin) for `ESLCarousel` that provides an autoplay functionality.
It allows the carousel to automatically transition between slides after a specified timeout, by producing a navigation command at the specified interval.
The `esl-carousel-autoplay` is a carousel plugin, so it should be added directly to the `esl-carousel` element, otherwise it will self destroy itself.
The plugin supports the ESLMedia query syntax, allowing different configurations for different media conditions.
Out of the box, it supports different customizations and features, such as pausing on hover/focus, simple control binding, and progress bar.

## Configuration

As the `esl-carousel-autoplay` is a plugin, it utilizes the ESLCarousel's plugin configuration system.
Tht means the only source of configuration is the `esl-carousel-autoplay` attribute value.
It supports ESLMedia query syntax to provide different configurations for different media conditions (and it could be declared with a tuple sintax according to media atrribute).

The configuration properties of the `esl-carousel-autoplay` are the following:
 - `duration` (primary property, could be declared as the only value in the attribute)
   Supports CSS time format (e.g. `1s`, `500ms`) or a number in milliseconds.
   Declares the autoplay cycle duration in milliseconds. The value is required. 
   To disable the autoplay set the value to `0`, negative value or `none` (it is enough to set one of these values to deactivate all autoplay features).
   Set to `10s` if the value is not provided explicitly.
 - `command` (optional) (default: `slide:next`)
   Declares the autoplay command. Could be any `ESLCarouselSlideTarget` nav string.
 - `trackInteraction` (optional) (default: `true`)
   If set to `true`, the autoplay will be paused on user interaction with the carousel (e.g. mouseover, focus, touchstart).
   If set to `false`, the autoplay will not be paused on user interaction.
 - `controls` (optional)
   The ESLTraversingQuery selector for the controls that should be treated as the autoplay plugin enable/disable controls.
 - `controlsCls` (optional)
   The class that will be added to the controls when the autoplay is enabled. Supports ESL CSSClassUtils syntax.
 - `containerCls` (optional)
   The class that will be added to the carousel container when the autoplay is enabled. Supports ESL CSSClassUtils syntax.

## Events

The `esl-carousel-autoplay` plugin emit the `esl:autoplay:change` event when the autoplay to notify about one of the following changes:
 - Autoplay/plugin is enabled/disabled
 - Autoplay is paused/resumed
 - Autoplay next cycle is started

Each of `esl:autoplay:change` event contains quick access (own properties) for the following state props:
 - `enabled` (boolean) - true if the autoplay plugin is enabled, false otherwise
 - `active` (boolean) - true if the autoplay is active (starts a new cycle), false otherwise
 - `duration` (number) - the current autoplay duration in milliseconds

The `esl:autoplay:change` event dispatched on the `esl-carousel` element. 
It is not propagated to the parent elements (non bubbling event).
The `esl:autoplay:change` event is not cancelable.

The primary use case of the `esl:autoplay:change` event is to create a progress bar for the autoplay cycle.

## Out of the box progress custom attribute

In addition to the status event, the `esl-carousel-autoplay` goes with an optional additional custom attribute `esl-carousel-autoplay-progress`.
It could be added to any element that should be used as a progress bar for the autoplay cycle.
The `esl-carousel-autoplay-progress` custom attribute will automatically bind to the `esl:autoplay:change` event and refect autoplay cycle progress by setting the following properties:
 - `autoplay-enabled` boolean attribute - true if the autoplay plugin is enabled, false otherwise
 - `animate` boolean attribute - appears on each autoplay cycle start; drops for a one frame to allow CSS transitions/animation to be handled
 - `--esl-autoplay-duration` CSS variable - the current autoplay duration in milliseconds

The only parameter that `esl-carousel-autoplay-progress` custom attribute accepts as its value is the `esl-carousel` ESLTraversingQuery selector.
If selector is not provided, the `esl-carousel-autoplay-progress` will try to find first `esl-carousel` element inside the closest `.esl-carousel-container` parent.

## Examples

### Basic autoplay with custom duration
```html
<esl-carousel esl-carousel-autoplay="10s">
  <ul esl-carousel-slides>
    <li esl-carousel-slide>Slide 1</li>
    <li esl-carousel-slide>Slide 2</li>
    <li esl-carousel-slide>Slide 3</li>
  </ul>
</esl-carousel>
```

### Autoplay with custom command and controls
```html
<esl-carousel esl-carousel-autoplay="{duration: '5s', command: 'slide:next', controls: '.esl-carousel-control'}">
  <ul esl-carousel-slides>
    <li esl-carousel-slide>Slide 1</li>
    <li esl-carousel-slide>Slide 2</li>
    <li esl-carousel-slide>Slide 3</li>
  </ul>
</esl-carousel>
<div class="esl-carousel-controls">
  <button type="button" class="esl-carousel-control">Next</button>
</div>
```

### Disabling autoplay on mobile breakpoint
```html
<esl-carousel esl-carousel-autoplay="10s | @XS => 0">
```
or
```html
<esl-carousel esl-carousel-autoplay="10s | @XS => none">
```
or
```html
<esl-carousel esl-carousel-autoplay="10s | @XS => {duration: 0}">
```

### Using ESLMediaRuleList capabilities
The configuration bellow make the autoplay to be enabled only on `MD` and `LG` breakpoints, with different durations for each breakpoint.
But utilizing the `controls` and `containerCls` properties, for both enabled breakpoints.
```html
<esl-carousel esl-carousel-autoplay="{controls: '.esl-carousel-control', duration: 0, containerCls: 'autoplay-enabled'} | @MD => 5s | @LG => 10s">
```
