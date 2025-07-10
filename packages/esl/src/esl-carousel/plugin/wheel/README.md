# ESL Carousel Wheel Attribute

<a name="intro"></a>

The `esl-carousel-wheel` is a custom attribute (mixin) for `ESLCarousel` that provides wheel based navigation for the carousel.
It is a carousel plugin, so it should be added directly to the `esl-carousel` element.
Using `esl-carousel-wheel` plugin you can handle wheel events to navigate the carousel in different ways.

## Configuration

As the `esl-carousel-wheel` is a plugin, it utilizes the ESLCarousel's plugin configuration system.
That means the only source of configuration is the `esl-carousel-wheel` attribute value.
It supports ESLMedia query syntax to provide different configurations for different media conditions (and it could be declared with a tuple syntax according to `media` attribute).

The configuration properties of the `esl-carousel-wheel` are the following:

### `type` (primary property, could be declared as the only value in the attribute)
Declares the type of navigation to execute on the wheel event. Could be one of the following:
 - `slide` - moves the carousel by a slide, based on long(inert) wheel interation (default)
 - `group` - moves the carousel by a group, based on long(inert) wheel interation
 - `move` - moves the carousel by the wheel delta amount (note: produces free state navigation)
 - `none` - disables wheel navigation

### `direction` (optional)
Restricts wheel direction.
Values:
- `auto` - depends on the carousel orientation (default)
- `x` - horizontal only
- `y` - vertical only

### `ignore` (optional)
The selector string to ignore elements for the wheel event. Default is `[contenteditable]`.

### `preventDefault` (optional)
Prevent default wheel event behavior when the event has been handled. Default is `true`.

## Usage Examples

```html
<!-- Basic wheel navigation by slide -->
<esl-carousel esl-carousel-wheel>
  <!-- carousel content -->
</esl-carousel>

<!-- Navigate by group -->
<esl-carousel esl-carousel-wheel="group">
  <!-- carousel content -->
</esl-carousel>

<!-- Move by wheel delta -->
<esl-carousel esl-carousel-wheel="move">
  <!-- carousel content -->
</esl-carousel>

<!-- Restricts wheel navigation for desktop only -->
<esl-carousel esl-carousel-wheel="slide | @desktop => none">
  <!-- carousel content -->
</esl-carousel>

<!-- Custom configuration -->
<esl-carousel esl-carousel-wheel="{type: 'slide', ignore: '[contenteditable], .no-wheel'}">
  <!-- carousel content -->
</esl-carousel>
```
