# ESL Carousel Touch Attribute

<a name="intro"></a>

The `esl-carousel-touch` is an custom attribule (mixin) for `ESLCarousel` that provides touch navigation for the carousel.
The `esl-carousel-touch` is a carousel plugin, so is should be added directly to the `esl-carousel` element.
Using touch plugin you can support swipe gestures or smoth touch moves for the carousel navigation.

## Configuration
As the `esl-carousel-touch` is a plugin, it utilizes the ESLCarousel's plugin configuration system.
Tht means the only source of configuration is the `esl-carousel-touch` attribute value.
It supports ESLMedia query syntax to provide different configurations for different media conditions (and it could be declared with a tuple sintax according to media atrribute).

The configuration properties of the `esl-carousel-touch` are the following:

### `type` (primary property, could be declared as the only value in the attribute)
Declares the type of touch navigation. Could be one of the following:
 - `none` - disables the touch navigation
 - `swipe` - enables the swipe gestures navigation
 - `drag` (default) - enables the drag navigation (the carousel moves with the touch move)

### `tolerance` (optional)
Declares the amount of pixels the touch move should be to start the navigation. Default is `10`.

### Swipe properties
 - `swipeType` - declares the swipe type. Could be one of the following:
   - `group` (default) - moves the carousel by the group
   - `slide` - moves the carousel by the slide
 - `swipeDistance` - declares the swipe threshold in pixels to register swipe gesture. Default is `20`.
 - `swipeTime` - declares the swipe threshold in milliseconds to register swipe gesture. Default is `400`.

## Usage
To use the mixin, you need to register the ESLCarouselTouchMixin by 
```javascript
   ESLCarouselTouchMixin.register();
```

Then you can use the mixin on any `esl-carousel` element you want to use as a touch navigation control:
```html
  <esl-carousel esl-carousel-touch="swipe">...</esl-carousel>
```
or
```html
  <esl-carousel esl-carousel-touch="swipe | @+md => drag">...</esl-carousel>
```

To declare extended config use the ESLMedia query object syntax:

```html
  <esl-carousel esl-carousel-touch="{type: 'swipe', swipeDistance: 100 }">...</esl-carousel>
```
or
```html
  <!-- Uses swipe behaviur with 50px swipe distance on small screens and 100px swipe distance on small screens; disabled for larger screens --> 
  <esl-carousel esl-carousel-touch="{type: 'swipe', swipeDistance: 50 } | @sm => {swipeDistance: 100} | @+md => none">...</esl-carousel>
```
