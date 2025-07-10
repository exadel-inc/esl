# ESL Carousel Relation Attribute

<a name="intro"></a>

The `esl-carousel-relate-to` is a custom attribute (mixin) for `ESLCarousel` that allows you to link multiple carousels together,
enabling them to synchronize their states. This is particularly useful for creating related carousels
that should move in unison, such as a thumbnail carousel that controls a main image carousel.
It is a carousel plugin, so it should be added directly to the `esl-carousel` element.

## Configuration

As `esl-carousel-relate-to` is a plugin, it uses the ESLCarousel plugin configuration system.
That means the only source of configuration is the `esl-carousel-relate-to` attribute value.
It supports ESLMedia query syntax to provide different configurations for different media conditions
(and it can be declared using tuple syntax, according to the `media` attribute).

The `esl-carousel-relate-to` attribute should be added to the carousel that needs to be synchronized with another carousel—
in other words, the carousel that should follow the target carousel.
The plugin does not define two-way synchronization. If two-way synchronization is needed,
you should add the `esl-carousel-relate-to` attribute to both carousels, targeting each other.

The configuration properties of `esl-carousel-relate-to` are as follows:

### `target` (primary property, can be declared as the only value in the attribute)

Specifies the target carousel to sync with. Should be a selector string (supports ESLTraversingQuery syntax).
**Note:** An empty or `'none'` value will disable the relation plugin without any warning.

### `proactive` (optional)

Enables proactive relation mode. If set to `true`, the carousel will synchronize on animation start. Default is `false`.

## Example

A navigation carousel with thumbnails that controls the main image carousel:

```html
<div class="esl-carousel-nav-container">
  <esl-carousel id="main-carousel">
    <ul esl-carousel-slides>
      <li esl-carousel-slide><img src="big-img1.jpg" alt="Image 1"></li>
      <li esl-carousel-slide><img src="big-img2.jpg" alt="Image 2"></li>
      <li esl-carousel-slide><img src="big-img3.jpg" alt="Image 3"></li>
    </ul>
  </esl-carousel>
  <esl-carousel id="thumbnail-carousel" 
                count="4" 
                esl-carousel-relate-to="#main-carousel">
    <ul esl-carousel-slides>
      <li esl-carousel-slide esl-carousel-nav="slide:1"><img src="thumb1.jpg" alt="Thumbnail 1"></li>
      <li esl-carousel-slide esl-carousel-nav="slide:2"><img src="thumb2.jpg" alt="Thumbnail 2"></li>
      <li esl-carousel-slide esl-carousel-nav="slide:3"><img src="thumb3.jpg" alt="Thumbnail 3"></li>
    </ul>
  </esl-carousel>
</div>
```

**Note:** The `esl-carousel-nav` attribute is used to declare the navigation command for each slide in the thumbnail carousel.
The `esl-carousel-nav-target` attribute is omitted, only as it automatically finds the first `esl-carousel` element within the `.esl-carousel-nav-container` parent element.
