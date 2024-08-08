# [ESL](../../../) Image Utils

Version: *1.0.0*

Authors: *Anna Barmina*, *Alexey Stsefanovich (ala'n)*

<a name="intro"></a>

Lightweight helpers to use with native img and picture elements.

## ESLImgStateClassMixin

ESLImgStateClassMixin (`esl-img-state-cls`) is a custom attribute to set image container class as soon as image is loaded.
The custom attribute could be placed on img tag itself or on its container (picture, div, etc).

### Attributes

- `esl-img-state-cls` (primary, mixin) - class to set on the target element upon image load. Supports CSSClassUtils query.  
  If attribute value is blank, uses 'img-container-loaded' as default class.

- `esl-img-state-cls-error` - optional, class to set on the target element in case of image loading error. Supports CSSClassUtils query.

- `esl-img-state-cls-target` - optional, behaves depending on mixin host element:
  - if mixin host is img element, defines a query(selector) to find the target element to set class on. Supports ESLTraversingQuery syntax.
  - if mixin host is not img element, defines a query(selector) to find the img element. The class target is the host element itself. Supports ESLTraversingQuery syntax.  
  
  By default, the target is the host element itself for both cases.

### Usage

Set default `img-container-loaded` class on image container upon image load.
The most common use case, host element is the container.
```html
<div class="img-container img-container-16-9" esl-img-state-cls>
  <img alt src="image.jpg"/>
</div>
```
or
```html
<picture class="img-container img-container-16-9" esl-img-state-cls>
  <source srcset="image.webp" type="image/webp">
  <img alt src="image.jpg"/>
</picture>
```

Set `img-container-loaded` class on the direct parent of the image element upon image load.
Mixin hosted on the img element.
```html
<div class="img-container">
  <img alt src="image.jpg" esl-img-state-cls esl-img-state-cls-target="::parent"/>
</div>
```

Set custom class `loaded` on the direct parent of the image element upon image load and class `error` in case of image loading error.
```html
<div class="img-container" esl-img-state-cls="loaded" esl-img-state-cls-error="error">
  <img alt src="image.jpg"/>
</div>
```

Set custom class `loaded` on the direct parent of the image element upon image successful load.
Note: the error class query executed after the plain class query. So error class query could override the plain class query.
```html
<div class="img-container" esl-img-state-cls="loaded" esl-img-state-cls-error="!loaded">
  <img alt src="image.jpg"/>
</div>
```

---

## ESL Image Container (CSS Only)
A set of common CSS classes to use with native images. Seamless integration with ESLImageContainerMixin defaults. 

### Main container & image classes
_Source_: [esl-image-utils.container.less](./core/esl-image-utils.container.less)

- `img-container` - mandatory container class. (Can be set on `picture` element as well)
- `img-container-loaded` (Automatic) - class to set on the container element upon image load. ESLImageContainerMixin maintains this class.

- `img-stretch` - class to set on `img` element to stretch the image to cover the container area.'
- `img-cover` - class to set on `img` element to cover the container area maintaining aspect ratio.
- `img-contain` - class to set on `img` element to fit (inscribe) the container area maintaining aspect ratio.

### Aspect Ratio Container Classes
_Source_: [esl-image-utils.ratios.less](./core/esl-image-utils.ratios.less)

  - `img-container-16-9` - aspect ratio 16:9 container class.
  - `img-container-26-9` - aspect ratio 26:9 container class.
  - `img-container-4-3` - aspect ratio 4:3 container class.
  - `img-container-1-1` - aspect ratio 3:2 container class.

### Image Fade In Animation
_Source_: [esl-image-utils.fade.less](./core/esl-image-utils.fade.less)

- `img-fade` - class to apply fade-in animation on image load. Works with `img-container-loaded` class.

### Usage
```html
<picture class="img-container img-container-16-9" esl-img-state-cls>
  <source srcset="image.webp" type="image/webp">
  <img alt src="image.jpg" class="img-fade img-cover" loading="lazy"/>
</picture>
```
