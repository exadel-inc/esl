# ESL Carousel Keyboard Attribute

<a name="intro"></a>

The `esl-carousel-keyboard` is an custom attribule (mixin) for `ESLCarousel` that provides keyboard navigation for the carousel.
The `esl-carousel-keyboard` is a carousel plugin, so is should be added directly to the `esl-carousel` element.

## Configuration
As the `esl-carousel-keyboard` is a plugin, it utilizes the ESLCarousel's plugin configuration system.
Tht means the only source of configuration is the `esl-carousel-keyboard` attribute value.
It supports ESLMedia query syntax to provide different configurations for different media conditions (and it could be declared with a tuple sintax according to media atrribute).

The actual configuration option of the `esl-carousel-keyboard` is a command string.
The comand could be one of the following:
 - `none` - disables the keyboard navigation
 - `slide` (default) - enables the keyboard navigation with the default slide prev/next commands (left/right arrows moves scene by one slide)
 - `group` - enables the keyboard navigation with the group prev/next commands (left/right arrows moves scene by one group)

## Usage
To use the mixin, you need to register the ESLCarouselKeyboardMixin by 
```javascript
   ESLCarouselKeyboardMixin.register();
```

Then you can use the mixin on any `esl-carousel` element you want to use as a keyboard navigation control:
```html
  <esl-carousel esl-carousel-keyboard="slide">...</esl-carousel>
```
or
```html
  <esl-carousel esl-carousel-keyboard="slide | @+sm => group">...</esl-carousel>
```
