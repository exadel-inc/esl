# ESL Carousel Autoplay Plugin (custom attribute)

<a name="intro"></a>

The `esl-carousel-autoplay` is a custom attribute (plugin/mixin) for `ESLCarousel` that provides autoplay functionality.
It lets the carousel automatically navigate between slides on a timed cycle, issuing a navigation command at each interval.
Attach the plugin directly on the `esl-carousel` element (it will self‑remove if applied elsewhere).
The plugin supports ESL media rule syntax, enabling responsive configuration.
Features include: hover/focus pause, separate external control/progress mixins, and per‑slide timeout overrides.

## Configuration

The only configuration source is the `esl-carousel-autoplay` attribute value (plugin config system).
Supports ESL media rule syntax (either unified arrow syntax or tuple form bound to the carousel `media` attribute).

Configuration properties:
 - `duration` (primary) – CSS time (`1s`, `500ms`) or number (ms). Required.
   * `> 0` – base autoplay cycle duration
   * `0` – no base cycle (autoplay stays enabled but inactive unless a slide overrides with a positive per‑slide timeout)
   * negative / invalid / `none` – globally disable the plugin
   Defaults to `10s` if omitted.
 - `command` (optional, default: `slide:next`) – navigation command to execute each cycle.
 - `intersection` (optional, default: `0.25`) – intersection ratio (0..1) required to run. Below threshold cycle is suspended.
 - `trackInteraction` (optional, default: `true`) – pause while hovered or focus (keyboard focus‑visible) is within interaction scope.
 - `interactionScope` (optional) – selector (ESLTraversingQuery) defining scope for interaction tracking (defaults to host carousel).
 - `containerCls` (optional) – CSS class applied to the carousel container while autoplay is enabled.
 - `blockerSelector` (optional) – selector (ESLTraversingQuery) for items that, when activated, stop carousel autoplay. Defaults to `::find(esl-share[active], esl-note[active])`.
 - `watchEvents` (optional) – space-separated list of event names that toggle blocking state on the carousel when fired. Defaults to `esl:change:active`.
  - `blockBehaviour` (optional, default: `stop`) – how runtime blockers behave:
    * `stop` – clear the current cycle and start a new one after unblocking
    * `pause` – pause and resume the current cycle preserving the remaining time

### Public properties / state

 - `enabled` (boolean, read/write) – autoplay is enabled and not manually stopped.
 - `duration` (number, readonly) – parsed global duration (ms). Negative / NaN means disabled.
 - `effectiveDuration` (number, readonly) – current slide duration (per‑slide override or global). `<= 0` pauses only the current slide.
 - `remaining` (number, readonly) – remaining time of the current cycle (ms).
 - `paused` (boolean, readonly) – autoplay is paused explicitly by user action and can be resumed.
 - `blocked` (boolean, readonly) – autoplay is temporarily suspended by external conditions (e.g. hidden viewport, user interaction, blockers).
 - `state` (`'disabled' | 'active' | 'paused' | 'blocked' | 'idle'`, readonly) – exclusive summary of current autoplay state.
 - `active` (boolean, readonly) – a timer is scheduled (cycle running).
 - `canRun` (boolean, readonly) – runtime allowance for scheduling the autoplay timer.
 - `allowed` (boolean, readonly) – backward-compatible alias of `canRun`.

### Public methods

 - `start(reason?)` – starts autoplay or resumes the paused cycle.
 - `pause(reason?)` – pauses autoplay preserving the remaining time.
 - `stop(reason?)` – fully stops autoplay and clears the current cycle.

`reason` is an optional compact machine-readable token. Typical values are:
 - `user:start:call`
 - `user:pause:call`
 - `user:stop:call`
 - `user:start:control`
 - `user:pause:control`
 - `user:stop:control`
 - `system:start:auto`
 - `system:pause:block`
 - `system:stop:block`
 - `system:stop:config`
 - `system:stop:slide-change`
 - `system:idle`

Notes:
 - `enabled = true` and `active = false` is normal when: base duration is `0`; current slide override is `0`/non‑positive; carousel not sufficiently visible; user is hovering or focused; navigation command currently not possible.
 - Base `duration = 0` does NOT disable the plugin – it just suppresses default cycles unless a per‑slide timeout overrides it.
 - Negative / invalid duration disables the plugin until changed.

### Manual control
Programmatic examples:
 - `carousel.autoplay.enabled = false` / `true`
 - `carousel.autoplay.stop()` / `start()`
 - `carousel.autoplay.pause()` to preserve remaining time

### Migration note for 6.2

In `6.2` autoplay controls are no longer configured through the `esl-carousel-autoplay` config object.

If you used:

```html
<esl-carousel esl-carousel-autoplay="{control: '.btn', controlBehaviour: 'pause'}"></esl-carousel>
```

switch to a dedicated control mixin placed directly on the control element:

```html
<div class="esl-carousel-nav-container">
  <button esl-carousel-autoplay-control="pause">Pause autoplay</button>
  <esl-carousel esl-carousel-autoplay="8s">...</esl-carousel>
</div>
```

In other words:
- remove `control`, `controlBehaviour`, and `controlCls` from autoplay config
- register `ESLCarouselAutoplayControlMixin` where autoplay controls are needed
- move control behaviour to the control host via `esl-carousel-autoplay-control`

<a name="autoplay-control-mixin"></a>

## ESL Carousel Autoplay State Attribute

`esl-carousel-autoplay-state` is a read-only state mixin hosted directly on any element.
It resolves a target carousel, listens for autoplay state changes and reflects current autoplay state on the host.

### Configuration

- `esl-carousel-autoplay-target` (`target`) – optional selector to find the target carousel.
  Uses `ESLTraversingQuery`. Defaults to `::parent(.esl-carousel-nav-container)::find(esl-carousel)`.

### Usage

Register the mixin:

```javascript
ESLCarouselAutoplayStateMixin.register();
```

Then attach it to any element that only needs the autoplay status:

```html
<div class="esl-carousel-nav-container">
  <span esl-carousel-autoplay-state></span>
  <esl-carousel esl-carousel-autoplay="8s">...</esl-carousel>
</div>
```

### Runtime State Attributes

When attached to an element the mixin manages the following state markers on the host:

- `disabled` – autoplay plugin is not available on the target carousel
- `autoplay-state` – exclusive current state of the target autoplay instance. Possible values:
  - `unavailable` – no autoplay plugin found on the target carousel
  - `disabled` – autoplay exists but is currently disabled/stopped
  - `active` – autoplay cycle is running
  - `paused` – autoplay is paused explicitly by user action
  - `blocked` – autoplay is currently blocked by viewport / interaction / blocker conditions
  - `idle` – autoplay is enabled but there is no active cycle right now

`esl-carousel-autoplay-control` and `esl-carousel-autoplay-progress` extend the same state model and add their own behaviour on top.

## ESL Carousel Autoplay Control Attribute

`esl-carousel-autoplay-control` is a separate control mixin hosted directly on the control element.
It extends `esl-carousel-autoplay-state` and adds action/a11y semantics.

### Configuration

- `esl-carousel-autoplay-control` (`behaviour`) – primary attribute. Supported values:
  - `stop` (default) – toggle autoplay, resetting the cycle on each start
  - `pause` – toggle autoplay, resuming the cycle from the same point
- `esl-carousel-autoplay-target` (`target`) – optional selector to find the target carousel.
  Uses `ESLTraversingQuery`. Defaults to `::parent(.esl-carousel-nav-container)::find(esl-carousel)`.

### Usage

Register the mixin:

```javascript
ESLCarouselAutoplayControlMixin.register();
```

Then attach it to any external or internal control element:

```html
<div class="esl-carousel-nav-container">
  <button esl-carousel-autoplay-control="stop">Toggle autoplay</button>
  <esl-carousel esl-carousel-autoplay="8s">...</esl-carousel>
</div>
```

Or with explicit targeting:

```html
<button
  esl-carousel-autoplay-control="pause"
  esl-carousel-autoplay-target="::next">
  Pause autoplay
</button>
<esl-carousel esl-carousel-autoplay="8s">...</esl-carousel>
```

### Runtime State Attributes

When attached to an element the mixin manages the following state markers on the host:

- `disabled` – autoplay plugin is not available on the target carousel (also useful for native `<button>` semantics)
- `autoplay-state` – exclusive current state of the target autoplay instance. Possible values:
  - `unavailable` – no autoplay plugin found on the target carousel
  - `disabled` – autoplay exists but is currently disabled/stopped
  - `active` – autoplay cycle is running
  - `paused` – autoplay is paused explicitly by user action
  - `blocked` – autoplay is currently blocked by viewport / interaction / blocker conditions
  - `idle` – autoplay is enabled but there is no active cycle right now (for example `duration: 0` or current slide cannot auto-advance)

The mixin also manages `aria-controls` and `aria-pressed` for basic toggle accessibility.

## Per‑Slide Timeout Customization

Use `esl-carousel-autoplay-timeout` on a slide to override the cycle duration for that slide.
If omitted, the global duration (which may be 0) is used.
If parsing fails or value is invalid, the global duration is used (NOT treated as pause unless that global duration itself is 0 / non‑positive).
`<= 0` per‑slide value pauses autoplay only while that slide is active.

Note: An intentionally invalid value in a media rule branch can be used to fallback to the global duration. Example: 
```html
<esl-carousel-slide esl-carousel-autoplay-timeout="0 | @desktop => inherit"></esl-carousel-slide>
```
Here `0` disables autoplay for this slide on non‑desktop breakpoints, while the invalid `inherit` token on `@desktop` resolves to the global autoplay duration (so autoplay runs there).

Example:
```html
<esl-carousel esl-carousel-autoplay="3s">
  <esl-carousel-slide>Default timeout (3s)</esl-carousel-slide>
  <esl-carousel-slide esl-carousel-autoplay-timeout="5s">Custom (5s)</esl-carousel-slide>
  <esl-carousel-slide esl-carousel-autoplay-timeout="1s">Fast (1s)</esl-carousel-slide>
  <esl-carousel-slide esl-carousel-autoplay-timeout="0">Paused on this slide</esl-carousel-slide>
</esl-carousel>
```

### Media Queries for per‑slide
```html
<esl-carousel-slide esl-carousel-autoplay-timeout="2s | @XS => 4s | @LG => 0">
  Adaptive durations (paused on @LG)
</esl-carousel-slide>
```

Tuple syntax variant (bound to carousel media):
```html
<esl-carousel media="all | @XS | @SM" esl-carousel-autoplay="3s">
  <esl-carousel-slide esl-carousel-autoplay-timeout="2s | 3s | 0"></esl-carousel-slide>
</esl-carousel>
```

Supported time formats:
 - CSS times: `1s`, `500ms`, `2.5s`
 - Plain numbers: `1000`, `2500`
 - `0` or negative: pause for the slide
 - ESL media rule sets: `1s | @MD => 2s | @LG => 0`

## Events

`esl:autoplay:change` (non-bubbling, non-cancelable) emitted on the carousel when:
 - Manual enable/disable changes
 - Runtime allowance changes (intersection / interaction / navigation availability)
 - Cycle (re)starts or stops (schedule cleared or created)

Event payload fields:
 - `enabled` – enabled state (autoplay not manually disabled and global duration is valid non‑negative value)
  - `paused` – autoplay is paused explicitly by user action and may be resumed
 - `blocked` – autoplay is currently blocked by runtime conditions
 - `active` – timer scheduled
  - `state` – exclusive summary state (`disabled`, `active`, `paused`, `blocked`, `idle`)
 - `duration` – full effective duration used for the current/next cycle (0 on idle state)
 - `remaining` – remaining cycle duration (0 on finished cycle; equals full duration on reset)
 - `reason` – compact machine-readable state transition token (see public methods section)

Use case examples: progress indicator, custom UI state, analytics.

## ESL Carousel Autoplay Progress Attribute

`esl-carousel-autoplay-progress` is a read-only progress mixin hosted directly on any element.
It extends `esl-carousel-autoplay-state` and adds autoplay progress CSS variables / animation markers.

### Configuration

- `esl-carousel-autoplay-target` (`target`) – optional selector to find the target carousel.
  Uses `ESLTraversingQuery`. Defaults to `::parent(.esl-carousel-nav-container)::find(esl-carousel)`.

### Usage

Register the mixin:

```javascript
ESLCarouselAutoplayProgressMixin.register();
```

Then attach it to any element that should reflect autoplay progress:

```html
<div class="esl-carousel-nav-container">
  <button esl-carousel-autoplay-progress></button>
  <esl-carousel esl-carousel-autoplay="8s">...</esl-carousel>
</div>
```

Or with explicit targeting:

```html
<button
  esl-carousel-autoplay-progress
  esl-carousel-autoplay-target="::next">
</button>
<esl-carousel esl-carousel-autoplay="8s">...</esl-carousel>
```

### Runtime State Attributes

Like `esl-carousel-autoplay-state`, the progress mixin reflects the shared autoplay state model on the host:

- `disabled` – autoplay plugin is not available on the target carousel
- `autoplay-state` – exclusive current state of the target autoplay instance. Possible values:
  - `unavailable` – no autoplay plugin found on the target carousel
  - `disabled` – autoplay exists but is currently disabled/stopped
  - `active` – autoplay cycle is running
  - `paused` – autoplay is paused explicitly by user action
  - `blocked` – autoplay is currently blocked by viewport / interaction / blocker conditions
  - `idle` – autoplay is enabled but there is no active cycle right now

### Progress Markers

The mixin also manages the following progress-specific markers on the host:

- `animate` – pulsed on each autoplay cycle start to retrigger CSS animation
- `--esl-autoplay-timeout` – remaining cycle duration in milliseconds
- `--esl-autoplay-duration` – full cycle duration in milliseconds
- `--esl-autoplay-progress` – completed progress ratio in the `0..1` range

`paused` and `blocked` are intentionally separate here too:
- `autoplay-state="paused"` means an explicit user pause
- `autoplay-state="blocked"` means runtime blocking (viewport / interaction / blockers)
- when blocking uses `blockBehaviour: 'pause'`, the progress mixin preserves the current remaining time while still exposing `autoplay-state="blocked"`

## Examples

### Basic autoplay
```html
<esl-carousel esl-carousel-autoplay="10s">
  <ul esl-carousel-slides>
    <li esl-carousel-slide>Slide 1</li>
    <li esl-carousel-slide>Slide 2</li>
    <li esl-carousel-slide>Slide 3</li>
  </ul>
</esl-carousel>
```

### Base suppressed (duration 0) with per‑slide override
```html
<esl-carousel esl-carousel-autoplay="0">
  <ul esl-carousel-slides>
    <li esl-carousel-slide esl-carousel-autoplay-timeout="4s">Only this slide auto advances</li>
    <li esl-carousel-slide>Static (no cycle here)</li>
  </ul>
</esl-carousel>
```

### Disable below breakpoint
```html
<esl-carousel esl-carousel-autoplay="8s | @XS => none">
```
(or use a negative value instead of `none`).

### Responsive with controls and container class
```html
<div class="esl-carousel-nav-container">
  <button esl-carousel-autoplay-control="pause">Toggle autoplay</button>
  <esl-carousel esl-carousel-autoplay="{duration: 0, containerCls: 'autoplay-enabled'} | @MD => 5s | @LG => 10s">
    <ul esl-carousel-slides>
      <li esl-carousel-slide>Slide 1</li>
      <li esl-carousel-slide>Slide 2</li>
    </ul>
  </esl-carousel>
</div>
```
This keeps plugin ready (duration 0) on small screens and starts cycles only from @MD / @LG.

---

Short reference:
- Set global `duration = 0` to keep autoplay enabled but idle until overridden per slide.
- Use `none` / negative to fully disable.
- Per‑slide `0` pauses only that slide.
- `enabled` writable for manual suspend/resume; `active` shows scheduled timer.
