# [ESL](https://exadel-inc.github.io/esl/) Carousel

Version: *2.0.0-beta*.

Authors: *Alexey Stsefanovich (ala'n)*, *Julia Murashko*, *Anna Barmina*, *Anastasia Lesun*.

<a name="intro"></a>

ESLCarousel - a slideshow component for cycling through slides. 
It supports various types of renderers to choose technical implementation of the carousel. 
The main part of ESLCarousel is a custom element ESLCarousel (`esl-carousel`) and custom attribute ESLCarouselSlide (`esl-carousel-slide`).
As well as various renderers, ESLCarousel supports set of mixins-plugins to extend carousel functionality.
Almost every carousel parameter is customizable and can be configured using ESLMediaRuleList syntax.

### ESLCarousel Structure
As was mentioned above, ESLCarousel consists of `esl-carousel` custom element and `esl-carousel-slide` custom attribute.
The `esl-carousel` element does not support any extra content inside (at least the one that is in CSS flow), as it most likely break the carousel layout.
The only child of esl-carousel should be `esl-carousel-slides` container. 
You can define it manually or skip it, so the `esl-carousel` will create it during rendering automatically.

The slide elements should be marked with `esl-carousel-slide` custom attribute (mixin). 
All slides will maintain their position inside the `esl-carousel-slides` container.
The ESLCarousel does not allow `esl-carousel-slide` to be placed outside of `esl-carousel-slides` container.

The folowing example shows the basic structure of ESLCarousel:
```html
<esl-carousel>
  <ul esl-carousel-slides>
    <li esl-carousel-slide>Slide 1</div>
    <li esl-carousel-slide>Slide 2</div>
    <li esl-carousel-slide>Slide 3</div>
  </ul>
</esl-carousel>
```
As was already mentioned, `esl-carousel` is restrictive to the structure but the tag names can be customized chosen by the user.
Note tht `esl-carousel` uses divs by default and provides accessibility trough ARIA attributes.

So default ESLCarousel structure will look like this:
```html
<esl-carousel>
  <div esl-carousel-slides>
    <div esl-carousel-slide>Slide 1</div>
    <div esl-carousel-slide>Slide 2</div>
    <div esl-carousel-slide>Slide 3</div>
  </div>
</esl-carousel>
```

Note ⚠️: we recomend to define `esl-carousel-slides` tag explicitly in case your contend is not dynamic it will help to avoid Cummutative Layout Shift (CLS) issues and 
allows content to be properly displayed before ESLCarousel (JS) initialization.

### ESLCarousel Root Element API

Carousel configuration usually goes through the ESLCarousel root element attributes/properties.
Note that almast all of the basic ESLCarousel attributes/properties are available with ESLMediaRuleList syntax (where it makes sence).
Both of the `ESLMediaRuleList` syntaxes are supported:
- value can be defined trough query (arrow syntax) string. e.g. `@xs => 1 | @md => 3`
- or trough the tuple syntax, then the `media` attribute should be declared to define the media conditions list e.g. `@xs|@sm|@md`
  For example, the following syntax will define diferent visible count of slides for different media breakpoints:
  ```html
  <esl-carousel media="@SM|@MD|@LG" count="1|2|3">...</esl-carousel>
  ```
  
Note: a single value attributes will be considered as all-rule so they spreads across all media conditions.

#### Attributes/Properties
 
 - `media` - defines the media conditions for parmetrs declared with a tuple syntax.
 - `count` - defines the number of slides to show at once (supports `ESLMediaRuleList`). Default: `1`.
 - `loop` - defines if the carousel should loop through the slides (supports `ESLMediaRuleList`). Default: `false`.
 - `type` - defines the type of the carousel renderer (supports `ESLMediaRuleList`). Default: `default`.
 - `vertical` - defines if the carousel should be vertical (supports `ESLMediaRuleList`). Default: `false`.
 - `step-duration` - defines the duration of the slide transition in milliseconds (supports `ESLMediaRuleList`). Default: `300`.

 - `container` - defines the container element for the carousel. Default: '' (self). Used to declare state classes of the carousel.
 - `container-empty-class` - defines the class to be added to the container when the carousel is empty. Default is empty.
 - `container-incomplete-class` - defines the class to be added to the container when the carousel is incomplete (the count of actual slides is less then count of displayed slides according to config). Default is empty.

 - `no-inert` - 'fine-tunning' attribute to disable inert attribute on invisible slides. Default: `false`.

#### State Attributes (read-only)
 
 - `empty` - defines if the carousel is empty.
 - `incomplete` - defines if the carousel is incomplete.
 - `single-slide` - defines if the carousel has only one slide.
 - `animating` - defines if the carousel is in the process of slide transition.

#### State Properties (read-only)

 - `state` - the state object of the carousel (contains all the state props like activeIndex, count of active slides, all of the config props).
 - `config` -  the current configuration of the carousel (contains all the config props like count, loop, type, etc).

 - `size` - the number of slides in the carousel.
 - `activeIndex` - the index of the first active slide.
 - `activeIndexes` - the array of indexes of the active slides.

 - `$slides` - the array of all slide elements.
 - `$activeSlide` - the first active slide element.
 - `$activeSlides` - the array of active slide elements.

 - `$slidesArea` - the stage element that contains the slides.
 - `$container` - the container element of the carousel.

#### Methods

 - `goTo(target: HTMLElement | ESLCarouselSlideTarget, params?: Partial<ESLCarouselActionParams>)` - navigate to the target slide.
   As a target you can use the slide element or a special navigation string (See ESLCarouselSlideTarget).
 - `move(offset: number, from?: number, params?: Partial<ESLCarouselActionParams>)` - shifts stage with the passed offset.
 - `public commit(offset: number, from?: number, params?: Partial<ESLCarouselActionParams>)` - reset the carousel to the stable (unshifted) state.

 - `slideAt(index: number)` - returns the slide element at the given index.
 - `indexOf(slide: HTMLElement)` - returns the index of the given slide element.

 - `isActive(slide: HTMLElement)` - returns if the slide is active.
 - `isPreActive(slide: HTMLElement)` - returns if the slide is pre-active (available during animation).
 - `isNext(slide: HTMLElement)` - returns if the slide is next.
 - `isPrev(slide: HTMLElement)` - returns if the slide is prev.
 - `canNavigate(target: ESLCarouselSlideTarget)` - returns if the carousel can navigate to the target nav string.

---

### ESLCarousel Events

ESLCarousel dispatches several custom events to notify about state changes and actions. 
You can listen to these events on the `<esl-carousel>` element to react to slide changes, configuration updates, and more.

#### Slide Change Events

All slide change events use the `ESLCarouselSlideEvent` class and provide the following useful properties:
- `indexesBefore`: Indexes of slides active before the change
- `indexesAfter`: Indexes of slides that will be active after the change
- `direction`: Direction of the slide animation (`'next'` or `'prev'`)
- `activator`: The object that initiated the change (if any)
- `final`: `true` if the change is final (the carousel guarantees that the change will be applied)
- `$slidesBefore`, `$slidesAfter`: Arrays of slide elements before/after

**Event types:**

- **`esl:before:slide-change`**
  - Dispatched *before* the active slide(s) change. Cancelable. 
  - Does not dispatch by move operation (touch plugin, etc.).

- **`esl:slide-change`**
  - Dispatched *when* the active slide(s) is going to change. 
  - Does not gather the result change, in case `final` is `false` (for example for `move` operation, as it could be rejected on the commit).

- **`esl:after:slide-change`**
  - Dispatched *after* the slide change animation completes.
  - Always dispatched after the `esl:slide-change` event, even if the change was canceled (rejected). A canceled event will have same indexes for `indexesBefore` and `indexesAfter`.

#### Carousel Configuration Change Event

The configuration change event uses the `ESLCarouselChangeEvent` class and provides the following useful properties:
- `initial`: `true` if this is the initial event on carousel creation
- `config`: Current carousel configuration
- `oldConfig`: Previous configuration (if available)
- `added`: Array of slide elements added
- `removed`: Array of slide elements removed

**Event types:**
- **`esl:carousel:change`**
  - Dispatched when the carousel configuration or slides change (e.g., on creation, resize, or slide add/remove).

For more details, see the event classes in `core/esl-carousel.events.ts`.

---

#### `ESLCarouselSlideTarget` type
The ESLCarouselSlideTarget is a string that defines the target slide for the carousel navigation.

The following nav strings (commands) are available:
- `prev` or `slide: prev` - go to the previous slide.
- `next` or `slide: next` - go to the next slide.
- `group: prev` - go to the previous slide group.
- `group: next` - go to the next slide group.
- `1`, `2`, `3`, ... - go to the slide by direct index.
- `slide: 1`, `slide: 2`, `slide: 3`, ... - go to the slide by direct index.
- `group: 1`, `group: 2`, `group: 3`, ... - go to the slide group by direct index.
- `+1`, `slide: +1`, `slide: +2`, ... - increment the current slide index.
- `-1`, `slide: -1`, `slide: -2`, ... - decrement the current slide index.
- `group: +1`, `group: +2`, ... - increment the current slide group index.
- `group: -1`, `group: -2`, ... - decrement the current slide group index.


### ESL Carousel Slide API

As was mentioned previously the ESLCarousel slides should be marked with `esl-carousel-slide` custom attribute.
The mixin behind the `esl-carousel-slide` attribute also provides some markers to define the slide state.

#### Attributes (read-only)
 
 - `active` - defines if the slide(s) is active (visible according to carousel).
 - `pre-active` - defines if the slide(s) will be visible when the current transition is finished. Present only during the transition. 
 - `next` - defines if the slide(s) is the next one to be shown.
 - `prev` - defines if the slide(s) is the previous one to be shown.

#### Accessibility behavior

The `esl-carousel-slide` mixin provides the accessibility behavior.
The accessibility behavior is based on the following attributes:

- `inert` - will be set to `true` for all slides that are not active. Carousel uses `inert` attribute to disable the focusable elements inside the slides.
To disable this behavior you can use `no-inert` attribute on the ESLCarousel element.

- `aria-hidden` - will be set to `true` for all slides that are not active.
- `aria-label` - will be set to the slide index description (e.g. "Slide #") if the slide does not have a label.
- `role` - will be set to `listitem` for all slides.
- `aria-roledescription` - will be set to 'slide' for all slides.

### ESLCarousel Renderers
You can choose the renderer for the ESLCarousel component trough the `type` attribute.
Diferent type of renderers can be associated with different media condition (see `ESLMediaRuleList` syntax support).
The following renderers are available out of the box:

- #### Default (type: `default`) Renderer
The default renderer for ESL Carousel. Uses the flexbox layout to display slides. 
Moves the slides with CSS transitions of the scene `transform` property.
If the `loop` attribute is set to `true`, the renderer will reorder the slides with a flexbox order property to create the loop effect.
By default try to move half of remaining slides to the opposite side of the carousel if loop is enabled.
However, you can forbid this behavior by setting `lazy-reorder` attribute (which supports `ESLMediaQuery` syntax), so the renderer will move slide only during the animation.
Does not do any DOM manipulations with the slides.
Supports the posibility to show multiple slides at once as well as siblings visibility effect (the next and previous slides are partially visible).
Supoorst all ESLCarousel attributes and properties including `vertical` and `step-duration`.

To fine-tune the layout you can use the following recipes:
  1. Slide size:
    The carousel renderer defines the `--esl-slide-size` (readonly) CSS variable with the size of the slide according to the carousel calculations.
    However, we do not recomend to rely on it to render first slide. It is recommended to define `width` or `height` for the slide elements explicitly.
    You can define `width` or `height` in px (absolute value), any media related unit or relativly in %. 
    Default layout makes it possible to use % based sizes for the slides, based on the carousel size (but not the scene size).
    For examole `width: 100%` will make the slide to fill the carousel width.
  2. Slide spacing:
    To define the space between the slides you can just use native flexbox `gap` property.
    The renderer is aware of the gap and will adjust the slide size and calculations accordingly.
  3. Transitions:
     The renderer uses the JavaScript Animation API to animate slides. The only way to customize the transition is by setting the duration via the CSS variable `--esl-carousel-step-duration`. 
     The carousel renderer reads the computed value of this CSS variable to determine the transition duration.
     In addition to using the CSS variable directly, you can also specify the `step-duration` attribute on the `<esl-carousel>` element. This attribute supports `ESLMediaRuleList` syntax, including definitions based on `media` attribute. 
     Technically, the `step-duration` attribute sets the transition duration CSS variable on the carousel root element during the animation step.
  4. Siblings visibility and overflow:
    The CSS overflow property is set to `clip`(or `hidden` for legacy browsers) on the `esl-carousel` element to hide out of view slides.
    However, the start position and calculations are based on `esl-carousel-slides` container element.
    You can utilize this to create siblings visibility effect by setting margin to the `esl-carousel-slides` container.
    Note that out of the box ESL Carousel already utilizes that trick to set visibility tolerance, you can adjust the out of the box behavior with `--esl-carousel-side-space` CSS variable as well.
  5. Limit reordering in loop mode (Could be useful to limit CLS issues, when content of the slide is heavy):
    By default, the renderer will reorder/move a half of the remaining slides to the opposite side of the carousel if loop is enabled.
    You can forbid this behavior by setting `lazy-reorder` attribute. It is an `ESLMediaQuery`, so you can define it for specific media conditions.
    Note that if you use siblings visibility effect, you will not see the last slide before the first one in the loop mode unless backward animation is playing.
    However, this option could be useful to limit CLS issues, when content of the slide is heavy (e.g. `esl-media` with the fill option).

- #### Centered (type: `centered`) Renderer
An extension of the default renderer that centers the active slide in the carousel.
Does not have any critical configurational or functional differences from the default renderer except the process of offset calculation.

- #### Grid (type: `grid`) Renderer <i class="badge badge-sup badge-warning">beta</i>
The grid renderer for ESL Carousel is based on the Default renderer but uses the CSS Grid layout to display slides.
Unlike the Default renderer, the Grid renderer displays multiple rows (horizontal case) or columns (vertical case) of slides.

Note that the Grid renderer is more restrictive in terms of the slide size definition. Unlike the Default renderer, the Grid renderer does not support relative sizes for the slides (grid layout liitations).

#### Default CSS Renderer (type: `css`) <i class="badge badge-sup badge-success">new</i>
Uses the `ESLCSSCarouselRenderer` implementation.
This renderer does not apply any JavaScript-based animation logic. It relies entirely on CSS-defined transitions and animations.

> **Note:** This renderer does not listen for specific transition or animation events. Therefore, the animation duration must be explicitly defined using the `--esl-carousel-step-duration` CSS variable.
It is also good practice to use the `--esl-carousel-step-duration` CSS variable within your animation. This enables duration customization via the `step-duration` attribute as well.

Animations can make use of global markers such as `active`, `pre-active`, `next`, and `prev` attributes, as well as the `animating` state attribute on the carousel element.

Additionally, the renderer provides the CSS classes `forward`, and `backward` on `[esl-carousels-slides]` to help define animation direction.

The renderer supports the move operation, but you must rely on one of the following CSS variables and markers:
* `shifted` – A root element attribute added to the carousel element when the move operation is not committed.
* `--esl-carousel-offset` – A CSS variable representing the move offset in pixels.
* `--esl-carousel-offset-ratio` – A CSS variable representing the offset relative to the carousel size and move tolerance.

By default, this renderer does not include any specific animation. However, several built-in animation implementations are provided (detailed below).

It is important to note that the CSS renderer uses a grid layout for the slides container to ensure consistent slide sizes (auto-height).
You need to override the layout intentionally if you want to use a different method to normalize the slide/carousel sizes.

#### CSS Fade Renderer (type: `css-fade`)
An extension of the default CSS renderer that provides fade animation styles for slide transitions.
Supports move operations relative to the carousel size and move tolerance.

#### CSS Slide Renderer (type: `css-slide`)
An extension of the default CSS renderer that provides sliding animation styles for slide transitions.
Supports move operations based on absolute pixel offset.

- #### None (type: `none`) Renderer
The none renderer for ESL Carousel is a dummy renderer that does not change the slides layout and assumes that all the slides are visible at once.
It is useful when you want to 'mute' the carousel behavior for some media conditions. 
For example, you need the carousel on mobile but want to show all the slides at once on desktop.

### ESLCarousel Plugins
The ESLCarousel supports a set of plugins to extend the carousel functionality.
The most of plugins are mixins that can be applied to the ESLCarousel element (except navigation related plugins).

Here is a list of available plugins:

- #### Navigation Controls
  - 🔗[`esl-carousel-nav`](./plugin/nav/README.md) - custom attribute mixin to add to navigation elements of the carousel
  - 🔗[`esl-carousel-dots`](./plugin/dots/README.md) - custom element to add dots navigation to the carousel
- #### Navigation Plugins
  - 🔗[`esl-carousel-touch`](./plugin/touch/README.md) - custom attribute-plugin to add touch/swipe navigation support to the carousel
  - 🔗[`esl-carousel-keyboard`](./plugin/keyboard/README.md) - custom attribute-plugin to add keyboard navigation support to the carousel
  - 🔗[`esl-carousel-wheel`](./plugin/wheel/README.md) - custom attribute-plugin to add mouse wheel navigation support to the carousel
- #### Misc Plugin
  - 🔗[`esl-carousel-autoplay`](./plugin/autoplay/README.md) - custom attribute-plugin to add autoplay functionality to the carousel
  - 🔗[`esl-carousel-relate-to`](./plugin/relation/README.md) - custom attribute-plugin to relate the carousel to another carousel
