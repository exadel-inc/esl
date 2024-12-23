# ESL Carousel Nav Attribute

<a name="intro"></a>

The `esl-carousel-nav` is an custom attribule (mixin) for `ESLCarousel` that provides navigation controls for the carousel.
You can add it to any element that you want to use as a navigation control inside or outside of the carousel.

## Configuration

There is only two attributes to configure the navigation mixin behaviour:

- `esl-carousel-nav` (`command`) - the priary atribute. Declares the command to pass to the carousel `goTo` method.
  See awailable commands in documentation section below.
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

## Commands

Available comands declated with a `ESLCarouselSlideTarget` type:

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
