# ESL Carousel Autoplay Plugin (custom attribute)

<a name="intro"></a>

The `esl-carousel-autoplay` is a custom attribute (mixin/plugin) for `ESLCarousel` that provides an autoplay functionality.
It allows the carousel to automatically transition between slides after a specified timeout, by producing a navigation command at the specified interval.
The `esl-carousel-autoplay` is a carousel plugin, so it should be added directly to the `esl-carousel` element, otherwise it will self destroy itself.
The plugin supports the ESLMedia query syntax, allowing different configurations for different media conditions.
Out of the box, it supports different customizations and features, such as pausing on hover/focus, simple control binding, progress bar, and per-slide timeout customization.

## Configuration

As the `esl-carousel-autoplay` is a plugin, it utilizes the ESLCarousel's plugin configuration system.
Tht means the only source of configuration is the `esl-carousel-autoplay` attribute value.
It supports ESLMedia query syntax to provide different configurations for different media conditions (and it could be declared with a tuple sintax according to media atrribute).

The configuration properties of the `esl-carousel-autoplay` are the following:
 - `duration` (primary property, could be declared as the only value in the attribute)
   Supports CSS time format (e.g. `1s`, `500ms`) or a number in milliseconds.
   Declares the autoplay cycle duration in milliseconds. The value is required. 
   To disable the autoplay (turn the plugin off), set the value to `0`, negative value or `none` (it is enough to set one of these values to deactivate all autoplay features).
   Set to `10s` if the value is not provided explicitly.
 - `command` (optional) (default: `slide:next`)
   Declares the autoplay command. Could be any `ESLCarouselSlideTarget` nav string.
 - `intersection` (optional) (default: `0.25`)
   The intersection ratio for the `IntersectionObserver` is to be used for the autoplay plugin.
   The value is a number between `0` and `1`, where `0` means that the autoplay will start immediately when the carousel appears in the viewport, and `1` means that the autoplay will start only when the carousel is fully visible in the viewport.
   Set to `0.25` if the value is not provided explicitly. (Values outside the [0,1] range are treated by browser/observer implementation and are not validated by the plugin.)
 - `trackInteraction` (optional) (default: `true`)
   If set to `true`, the autoplay will be paused on user interaction with the carousel (e.g. mouseover, focus, touchstart).
   If set to `false`, the autoplay will not be paused on user interaction.
 - `control` (optional)
   The ESLTraversingQuery selector for the elements that should be treated as the autoplay plugin enable/disable control(s).
 - `controlCls` (optional)
   The class to be added to control elements when autoplay is enabled. Supports ESL CSSClassUtils syntax.
 - `containerCls` (optional)
   The class to be added to the carousel container when autoplay is enabled. Supports ESL CSSClassUtils syntax.

### Public properties and states

Public properties:
  - `duration` (number, readonly): reflects the global autoplay duration in milliseconds (as set in configuration).
  - `effectiveDuration` (number, readonly): reflects the current effective autoplay duration in milliseconds (that will be used for the next cycle).
  - `enabled` (boolean, readonly): reflects whether autoplay feature is turned on.
  - `active` (boolean, readonly): indicates that a cycle timer is currently scheduled (internal timeout is set).

Note: the `enabled` state may be `true` while `active` is `false`. Autoplay is enabled but inactive when any of the following apply:
 - Current slide effective timeout is `0` (per‑slide pause)
 - Carousel is not sufficiently visible (intersection below threshold)
 - User interaction pause (hover / focus) with `trackInteraction: true`
 - Navigation command cannot execute now (`canNavigate` is false)

Plugin is fully disabled when `enabled` is `false` (no automatic reactivation until started again).

Public methods:
 - `start()`: enables the autoplay plugin (if it was disabled) and starts the autoplay cycle (if possible).
 - `stop()`: disables the autoplay plugin and stops any scheduled autoplay cycle.

Note: both `start()` and `stop()` methods can be called with boolean argument `true` to make start/stop action marked as temporal (not changing the `enabled` state). 
System uses such calls to pause autoplay temporarily (e.g. on interaction or insufficient visibility) without changing the `enabled` state.

## Per-Slide Timeout Customization

Individual slides can override the default autoplay timeout by using the `esl-carousel-autoplay-timeout` attribute.
This allows for different autoplay switch times for each slide.

Note: per-slide timeout `0` / `none` / or negative pauses autoplay only on that slide. 
Autoplay resumes automatically on a slide with positive timeout and navigable command. If the per‑slide attribute value is invalid / cannot be parsed, the plugin treats it as `0` (pause) for that slide.

### Usage

The `esl-carousel-autoplay-timeout` attribute can be added to any carousel slide.
For carousels showing multiple slides simultaneously (group mode), the autoplay uses the timeout defined by the first active slide.
If the value is invalid carousel will use plugin's main duration as fallback.
Negative values, `0`, or `none` will pause autoplay on that slide.

```html
<esl-carousel esl-carousel-autoplay="3s">
  <esl-carousel-slide>Default timeout (3s)</esl-carousel-slide>
  <esl-carousel-slide esl-carousel-autoplay-timeout="5s">Custom timeout (5s)</esl-carousel-slide>
  <esl-carousel-slide esl-carousel-autoplay-timeout="1s">Fast timeout (1s)</esl-carousel-slide>
  <esl-carousel-slide esl-carousel-autoplay-timeout="0">Autoplay paused only on this slide</esl-carousel-slide>
</esl-carousel>
```

### Media Query Support

The attribute supports ESL media query syntax for responsive timeout values:

```html
<!-- Unified query syntax -->
<esl-carousel-slide esl-carousel-autoplay-timeout="2s | @XS => 4s | @LG => 0">
  Different timeouts for different screen sizes (autoplay inactive on @LG)
</esl-carousel-slide>

<!-- Tuple query syntax (based on carousel's media attribute) -->
<esl-carousel media="all | @XS | @SM" esl-carousel-autoplay="3s">
  <esl-carousel-slide esl-carousel-autoplay-timeout="2s | 3s | 0">
    Timeout varies by breakpoint: 2s (all), 3s (@XS), 0 (inactive on @SM)
  </esl-carousel-slide>
</esl-carousel>
```

### Supported Time Formats

The attribute accepts the same time formats as the main autoplay duration:
- CSS time format: `1s`, `500ms`, `2.5s`
- Milliseconds as numbers: `1000`, `2500`
- `0`, `none` or negative number to pause on a slide
- ESL media query wrapped values: `1s | @MD => 2s | @LG => 0`

## Events

The `esl-carousel-autoplay` plugin emits the `esl:autoplay:change` event when it is changed to notify about one of the following changes:
 - Autoplay/plugin is enabled/disabled
 - Autoplay is paused/resumed (interaction / intersection / per-slide 0 / navigation ability changes)
 - Autoplay next cycle is started

Each of `esl:autoplay:change` events contains quick access (own properties) for the following state props:
 - `enabled` (boolean) - true if the autoplay plugin is enabled (root duration > 0), false otherwise
 - `active` (boolean) - true if the autoplay is active (timer scheduled), false otherwise
 - `duration` (number) - the current `effectiveDuration` in milliseconds

The `esl:autoplay:change` event is dispatched on the `esl-carousel` element. 
It is not propagated to the parent elements (non-bubbling event).
The `esl:autoplay:change` event is not cancelable.

Typical use cases include building a progress bar for the autoplay cycle and reacting to state changes when autoplay is paused on a slide (`0` timeout) or due to interaction / visibility / command limitations.

## Out of the box progress custom attribute

In addition to the status event, the `esl-carousel-autoplay` goes with an optional additional custom attribute `esl-carousel-autoplay-progress`.
It could be added to any element that should be used as a progress bar for the autoplay cycle.
The `esl-carousel-autoplay-progress` custom attribute will automatically bind to the `esl:autoplay:change` event and reflect autoplay cycle progress by setting the following properties:
 - `autoplay-enabled` boolean attribute - true if the autoplay plugin is enabled, false otherwise
 - `animate` boolean attribute - appears on each autoplay cycle start; drops for a one frame to allow CSS transitions/animation to be handled
 - `--esl-autoplay-timeout` CSS variable - the current autoplay duration as a CSS time value (e.g. `3000ms`)

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

### Autoplay with custom command and control
```html
<esl-carousel esl-carousel-autoplay="{duration: '5s', command: 'slide:next', control: '.esl-carousel-control'}">
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
The configuration below enables autoplay only on `MD` and `LG` breakpoints, with different durations for each breakpoint.
But utilizing the `control` and `containerCls` properties, for both enabled breakpoints.
```html
<esl-carousel esl-carousel-autoplay="{control: '.esl-carousel-control', duration: 0, containerCls: 'autoplay-enabled'} | @MD => 5s | @LG => 10s">
```
