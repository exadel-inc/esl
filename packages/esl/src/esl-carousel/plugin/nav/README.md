# ESL Carousel Nav Attribute

<a name="intro"></a>

The `esl-carousel-nav` is an custom attribule (mixin) for `ESLCarousel` that provides navigation controls for the carousel.
You can add it to any element that you want to use as a navigation control inside or outside of the carousel.

## Configuration

There is only two attributes to configure the navigation mixin behaviour:

- `esl-carousel-nav` (`command`) - the priary atribute. Declares the nav command to pass to the carousel `goTo` method.
  See awailable commands in the ESLCarousel's ESLCarouselSlideTarget section.
- `esl-carousel-nav-target` (`target`) - the secondary optional attribute. Specifies the target carousel instance to control.
  By default, the mixin will try to find the carousel in the closest `.esl-carousel-nav-container` element. 
  Uses `ESLTraversingQuery` to find the carousel.

## Usage
To use the mixin, you need to register the ESLCarouselNavMixin by 
```javascript
   ESLCarouselNavMixin.register();
```

Then you can use the mixin on any element you want to use as a navigation control:
```html
<div class="esl-carousel-nav-container">
    <button esl-carousel-nav="prev">Previous</button>
    
    <esl-carousel>...</esl-carousel>
    
    <button esl-carousel-nav="next">Next</button>
</div>
```
or
```html
<button esl-carousel-nav="prev" esl-carousel-nav-target="::next">Previous</button>
<esl-carousel>...</esl-carousel>    
<button esl-carousel-nav="next" esl-carousel-nav-target="::prev">Next</button>
```

## Runtime State Attributes

When attached to an element the mixin manages the following read-only attributes on the host:

- `active`   – set when the associated carousel is found and initialized (not incomplete).
- `disabled` – set when the declared navigation command cannot be executed at the moment (see `canNavigate`).
- `current`  – set when the declared navigation command points to a slide (or group) that is currently active (only absolute targets are considered).
