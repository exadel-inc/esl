# ESL Carousel Autoplay Attribute

<a name="intro"></a>

The `esl-carousel-autoplay` is an custom attribule (mixin) for `ESLCarousel` that provides autoplay functionality for the carousel.
The `esl-carousel-autoplay` is a carousel plugin, so is should be added directly to the `esl-carousel` element.

## Configuration

As the `esl-carousel-autoplay` is a plugin, it utilizes the ESLCarousel's plugin configuration system.
Tht means the only source of configuration is the `esl-carousel-autoplay` attribute value.
It supports ESLMedia query syntax to provide different configurations for different media conditions (and it could be declared with a tuple sintax according to media atrribute).

The configuration properties of the `esl-carousel-autoplay` are the following:
 - `timeout` (primary property, could be declared as the only value in the attribute)
   Declares the autoplay timeout in milliseconds. The value is required. To disable the autoplay set the value to `0` or `none`.
 - `command` (optional)
   Declares the autoplay command. Could be any `ESLCarouselSlideTarget` nav string. Default is `slide:next`.
