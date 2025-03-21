# ESL Carousel Relation Attribute

<a name="intro"></a>

The `esl-carousel-relation` is an custom attribule (mixin) for `ESLCarousel` that provides relation functionality for the carousel.
The `esl-carousel-relation` is a carousel plugin, so is should be added directly to the `esl-carousel` element.
Using relation plugin you can support relation between carousels or other elements.

## Configuration

As the `esl-carousel-relation` is a plugin, it utilizes the ESLCarousel's plugin configuration system.
Tht means the only source of configuration is the `esl-carousel-relation` attribute value.
It supports ESLMedia query syntax to provide different configurations for different media conditions (and it could be declared with a tuple sintax according to media atrribute).

The configuration properties of the `esl-carousel-relation` are the following:

### `target` (primary property, could be declared as the only value in the attribute)
Declares the target carousel to sync with. Should be a selector string (suports ESLTraversingQuery syntax).

### `proactive` (optional)
Declares the proactive relation mode. If set to `true` the carousel will try to sync with the animation start. Default is `false`.
