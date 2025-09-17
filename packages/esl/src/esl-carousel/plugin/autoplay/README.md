# ESL Carousel Autoplay Plugin (custom attribute)

<a name="intro"></a>

The `esl-carousel-autoplay` is a custom attribute (plugin/mixin) for `ESLCarousel` that provides autoplay functionality.
It lets the carousel automatically navigate between slides on a timed cycle, issuing a navigation command at each interval.
Attach the plugin directly on the `esl-carousel` element (it will self‑remove if applied elsewhere).
The plugin supports ESL media rule syntax, enabling responsive configuration.
Features include: hover/focus pause, simple enable/disable controls, progress helper, and per‑slide timeout overrides.

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
 - `control` (optional) – selector for element(s) acting as manual enable/disable toggles.
 - `controlCls` (optional) – CSS class applied to external autoplay control elements while autoplay is enabled.
 - `containerCls` (optional) – CSS class applied to the carousel container while autoplay is enabled.
 - `blockingItemsSelector` (optional) – selector (ESLTraversingQuery) for items that, when activated, stop carousel autoplay. Defaults to `esl-share[active], esl-note[active]`.

### Public properties / state

 - `enabled` (boolean, read/write) – manual user switch (setter suspends / resumes). Getter returns effective enabled: user not suspended AND global duration >= 0.
 - `duration` (number, readonly) – parsed global duration (ms). Negative / NaN means disabled.
 - `effectiveDuration` (number, readonly) – current slide duration (per‑slide override or global). `<= 0` pauses only the current slide.
 - `active` (boolean, readonly) – a timer is scheduled (cycle running).
 - `allowed` (boolean, readonly) – runtime allowance (enabled + in viewport + no blocking interaction when tracking).

Notes:
 - `enabled = true` and `active = false` is normal when: base duration is `0`; current slide override is `0`/non‑positive; carousel not sufficiently visible; user is hovering or focused; navigation command currently not possible.
 - Base `duration = 0` does NOT disable the plugin – it just suppresses default cycles unless a per‑slide timeout overrides it.
 - Negative / invalid duration disables the plugin until changed.

### Manual control
Any element matching the `control` selector toggles `enabled` on click. Programmatic toggle: `carousel.autoplay.enabled = false` / `true`.

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
 - `active` – timer scheduled
 - `duration` – effective duration used for (next) cycle (0 on clear state)

Use case examples: progress indicator, custom UI state, analytics.

## Progress helper custom attribute

`esl-carousel-autoplay-progress` listens for `esl:autoplay:change` and exposes:
 - `[autoplay-enabled]` boolean attribute
 - `[animate]` attribute pulsed on each cycle start
 - `--esl-autoplay-timeout` CSS variable (ms) for styling animations

Value: optional ESLTraversingQuery to target a carousel; otherwise nearest carousel inside closest `.esl-carousel-container`.

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
<esl-carousel esl-carousel-autoplay="{control: '.esl-carousel-control', duration: 0, containerCls: 'autoplay-enabled'} | @MD => 5s | @LG => 10s">
  <ul esl-carousel-slides>
    <li esl-carousel-slide>Slide 1</li>
    <li esl-carousel-slide>Slide 2</li>
  </ul>
</esl-carousel>
<button class="esl-carousel-control">Toggle Autoplay</button>
```
This keeps plugin ready (duration 0) on small screens and starts cycles only from @MD / @LG.

---

Short reference:
- Set global `duration = 0` to keep autoplay enabled but idle until overridden per slide.
- Use `none` / negative to fully disable.
- Per‑slide `0` pauses only that slide.
- `enabled` writable for manual suspend/resume; `active` shows scheduled timer.
