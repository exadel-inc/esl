# ESLCarouselNavDots

`ESLCarouselNavDots` is an auxiliary custom tag for ESLCarousel that provides dot navigation control for the carousel. 

`ESLCarouselNavDots` relays on slide groups, so one dot is created for each slide group.
Slide group is a set of slides that are displayed together in the carousel (you can control it by `count` attribute of carousel).

Example:
```html
    <esl-carousel-slide esl-carousel-container>
      <esl-carousel count="1">
        <div esl-carousel-slides>
          <esl-carousel-slide>Slide 1</esl-carousel-slide>
          <esl-carousel-slide>Slide 2</esl-carousel-slide>
          <esl-carousel-slide>Slide 3</esl-carousel-slide>
          <esl-carousel-slide>Slide 4</esl-carousel-slide>
        </div>
      </esl-carousel>

      <esl-carousel-nav-dots></esl-carousel-nav-dots>
    </div>
```

Please note, the plugin does not render if the carousel not found or expected amount of dots is less than 2.

The `esl-carousel-dots` element does not allow any children except `esl-carousel-dot` elements, 
so you can use CSS `:empty` selector to style as inactive state indicator.

For example, you might want to perceive space that dots nav take, so you can use the following CSS to do that:
```css
    .esl-carousel-dots:empty {
      display: block; /* Override default display: none */
      visibility: hidden; /* Hide empty dots nav */
      height: 1em; /* Set height to keep space */
    }
```

## Dots Plugin API

### Attributes

- `target` (`ESLCarouselNavDots.prototype.carousel`) - `ESLTraversingQuery` to specify the carousel instance to control. 
  Finds the carousel in the closest `esl-carousel-container` by default.  

- `dot-label-format` (`ESLCarouselNavDots.prototype.dotLabelFormat`) - format string for dot label. 
  The string can contain `{index}` and `{count}` placeholders. 
  Default is `Go to slide {index}` or `Go to slide group {index}` (based on carousel visible slides `count`).

  
### Static API

- `ESLCarouselNavDots.dotBuilder` - define global [dot builder](#dot-builder--updater) function.
- `ESLCarouselNavDots.defaultDotBuilder` - default [dot builder](#dot-builder--updater) function.
- `ESLCarouselNavDots.dotUpdater` - define global [dot updater](#dot-builder--updater) function.
- `ESLCarouselNavDots.defaultDotUpdater` - default [dot updater](#dot-builder--updater) function.

### Instance API

- `dotBuilder` - define [dot builder](#dot-builder--updater) function for instance. Default is `ESLCarouselNavDots.dotBuilder`.
- `dotUpdater` - define [dot updater](#dot-builder--updater) function for instance. Default is `ESLCarouselNavDots.dotUpdater`.

- `update` - updates dots based on current carousel state. Redraws dots if needed. 
  Uses `dotBuilder` (to create dot) and `dotUpdater` (to update dot state) functions.



## Dot Builder & Updater

`ESLCarouselNavDots` uses `dotBuilder` and `dotUpdater` functions to create and update dots.
Both functions are can be changed globally for all instances of `ESLCarouselNavDots` or for a specific instance.
However, the `ESLCarouselNavDots` provides qute flexible default implementation, so you may not need to change it.

The `dotBuilder` function is called for each dot to create a new dot element. 
But note that the dot element is not added to the DOM and does not know it's state at this stage.

NOTE: `ESLCarouselNavDots` attaches `esl-carousel-dot` attribute to the dot elements automatically. 
Do not remove it, it is required for proper plugin work.

The builder signature is `(index: number, $plugin: ESLCarouselNavDots) => HTMLElement`.

The `dotUpdater` function is called for each dot to update it's state based on the current carousel state.
In the updater function you can set it as active, disabled, etc.

The updater signature is `(dot: HTMLElement, index: number, $plugin: ESLCarouselNavDots) => void`.
Note: to define if the dot is active, you can use `index === $plugin.activeIndex` expression. 
Access to `activeIndex` and `count` does not cost additional performance as they are cached during the dots update. 

### Default Dot Builder
The default dot builder is stored under `ESLCarouselNavDots.defaultDotBuilder`.
It creates a button element as a dot item with the following attributes:
  - `role="tab"` (the `esl-carousel-dots` element has `role="tablist"`)
  - `aria-label` based on `dot-label-format` attribute (default is `Go to slide {index}` or `Go to slide group {index}` for multiple slides per view)
  - `class="esl-carousel-dot"` - default CSS class for dot element is `esl-carousel-dot`
  - `tabindex="-1"` or `tabindex="0"` based on `tabindex` attribute of the `esl-carousel-dots` element. 
  
#### Focus Management  
If non-negative `tabindex` is set for the `esl-carousel-dots` element, inner dots will have `tabindex="-1"` to prevent focus on them. So the dots control acts as a single focusable element. 
If `tabindex` is unset or negative, the dot will have `tabindex="0"` so each dot can be focused separately.

### Default Dot Updater
The default dot updater is stored under `ESLCarouselNavDots.defaultDotUpdater`.
It updates the dot element based on the current carousel state with the following logic:
  - `active` if the current dot is active
  - `aria-current="true"` if the dot is active

### Customizing Use Cases
  
#### Dots with custom content
If you need to customize the dot content, you can define a custom dot builder function.
The following example shows how to create a dot with a dot index as content:

```ts
ESLCarouselNavDots.dotBuilder = (index, count, $plugin) => {
  const dot = ESLCarouselNavDots.defaultDotBuilder(index, count, $plugin);
  dot.textContent = `${index + 1}`;
  return dot;
};
```

#### Dots with static custom attributes (e.g. analytics)
If you need to add static custom attributes to the dot, you can define a custom dot builder function as well.
The following example shows how to add a custom `data-analytics` attribute to the dot:

```ts
ESLCarouselNavDots.dotBuilder = (index, count, $plugin) => {
  const dot = ESLCarouselNavDots.defaultDotBuilder(index, count, $plugin);
  dot.setAttribute('data-analytics', `carousel-dot-${index}`);
  return dot;
};
```

#### Dots with dynamic custom attributes (e.g. activeness title)
To change dynamic behavior of the dot, you should consider defining a custom dot updater function.

The following example shows how to change the dot label if the dot is active:

```ts
ESLCarouselNavDots.dotUpdater = (dot, index, $plugin) => {
  ESLCarouselNavDots.defaultDotUpdater(dot, index, $plugin);
  dot.textContent = active ? `Active slide ${index + 1}` : `Slide ${index + 1}`;
};
```
