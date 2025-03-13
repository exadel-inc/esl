# [ESL](../../../) Image Utils

Version: *1.0.0*

Authors: *Anna Barmina*, *Alexey Stsefanovich (ala'n)*

<a name="intro"></a>

Lightweight helpers for use with native `img` and `picture` elements.

## ESL Image Container Mixin

`ESLImageContainerMixin` (`esl-image-container`) is a custom attribute used to set an image container class once the image has loaded.

This mixin is intended to be added to the image container element (e.g., `div`, `picture`, etc.) but can also be added directly to the image element.

The mixin observes all images inside the host element.
A ready class is applied to the host element when all images have finished loading (either successfully or with an error).
An error class is applied to the host element if any image fails to load.

### Configuration

The mixin uses a primary attribute, `esl-image-container`, with optional configuration passed as a JSON attribute value.

Configuration options:
- `readyCls` (string) - class to apply to the target element when the image is loaded. Supports CSSClassUtils query.  
    By default, the class `img-container-loaded` is applied.
- `errorCls` (string) - class to apply to the target element if there is an image loading error. Supports CSSClassUtils query.  
    By default, no error class is applied.
- `selector` (string) - query selector to find the target image element.  
    By default, the selector is `img`.
    Note: If the mixin is applied to the image element, the image itself will be checked against the selector anyway.

### Usage

Apply the default `img-container-loaded` class to the image container once the image has loaded.
In the most common use case, the host element is the container.
```html
<div class="img-container img-container-16-9" esl-image-container>
  <img alt src="image.jpg"/>
</div>
```
or
```html
<picture class="img-container img-container-16-9" esl-image-container>
  <source srcset="image.webp" type="image/webp">
  <img alt src="image.jpg"/>
</picture>
```

Apply the custom class `loaded` to the image container element when the image loads, and the class `error` if an image loading error occurs.
```html
<div class="img-container" esl-image-container="{readyCls: 'loaded', errorCls: 'error'}">
  <img alt src="image.jpg"/>
</div>
```

Apply the custom class `loaded` directly to the image element when it loads.
```html
<img alt src="image.jpg" esl-image-container="{readyCls: 'loaded'}"/>
```

Apply the custom class `loaded` to the direct parent of the image element when the image loads successfully.
Note: The error class query is executed after the ready class query, so the error class could override the ready class.
```html
<div class="img-container" esl-image-container="{readyCls: 'loaded', errorCls: '!loaded'}">
  <img alt src="image.jpg"/>
</div>
```
or simply
```html
<div class="img-container" esl-image-container="{readyCls: '', errorCls: '!loaded'}">
  <img alt src="image.jpg"/>
</div>
```

---

## ESL Image Container (CSS Only)

A set of common CSS classes to use with native images. Seamless integration with `ESLImageContainerMixin` defaults. 

### Main container & image classes
_Source_: [esl-image-utils.container.less](./core/esl-image-utils.container.less)

- `img-container` - mandatory container class (can also be applied to `picture` elements).
- `img-container-loaded` (Automatic) - class applied to the container element when the image loads. Maintained by `ESLImageContainerMixin`.
- `img-stretch` - class to apply to the `img` element to stretch the image to cover the container area.
- `img-cover` - class to apply to the `img` element to cover the container area while maintaining aspect ratio.
- `img-contain` - class to apply to the `img` element to fit (inscribe) the container area while maintaining aspect ratio.

### Aspect Ratio Container Classes
_Source_: [esl-image-utils.ratios.less](./core/esl-image-utils.ratios.less)

  - `img-container-16-9` - aspect ratio 16:9 container class.
  - `img-container-26-9` - aspect ratio 26:9 container class.
  - `img-container-4-3` - aspect ratio 4:3 container class.
  - `img-container-1-1` - aspect ratio 1:1 container class.

### Image Fade-In Animation
_Source_: [esl-image-utils.fade.less](./core/esl-image-utils.fade.less)

- `img-fade` - class to apply a fade-in animation on image load. Works with the `img-container-loaded` class.

### Usage
```html
<picture class="img-container img-container-16-9" esl-image-container>
  <source srcset="image.webp" type="image/webp">
  <img alt src="image.jpg" class="img-fade img-cover" loading="lazy"/>
</picture>
```
