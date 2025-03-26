# ESL Carousel Wheel Attribute

<a name="intro"></a>

The `esl-carousel-wheel` is an custom attribule (mixin) for `ESLCarousel` that provides wheel navigation for the carousel.
The `esl-carousel-wheel` is a carousel plugin, so is should be added directly to the `esl-carousel` element.
Using wheel plugin you can support wheel events for the carousel navigation.

## Configuration

As the `esl-carousel-wheel` is a plugin, it utilizes the ESLCarousel's plugin configuration system.
Tht means the only source of configuration is the `esl-carousel-wheel` attribute value.
It supports ESLMedia query syntax to provide different configurations for different media conditions (and it could be declared with a tuple sintax according to media atrribute).

The configuration properties of the `esl-carousel-wheel` are the following:

### `command` (primary property, could be declared as the only value in the attribute)
Declares the command to execute on the wheel event. Could be one the following:
 - `slide` - moves the carousel by the slide
 - `group` - moves the carousel by the group

### `direction` (optional)
Restricts wheel direction.
Values:
- 'auto' - depends on the carousel orientation (default)
- 'x' - horizontal only
- 'y' - vertical only

### `ignore` (optional)
The selector string to ignore elements for the wheel event. Default is `[contenteditable]`.

### `preventDefault` (optional)
Prevent default wheel event behaviour. Default is `true`.

