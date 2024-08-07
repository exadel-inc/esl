# [ESL](../../../) Image Utils

Version: *1.0.0*

Authors: *Anna Barmina*, *Alexey Stsefanovich (ala'n)*

<a name="intro"></a>

Lightweight helpers to use with native img and picture elements.

## ESL Image Container

ESLImageContainerMixin (`esl-img-container`) is a custom attribute to set image container class as soon as image is loaded.
The custom attribute should be placed on the img tag. 

### Attributes

- `esl-img-container` (primary) - mixin attribute, provides ESLTraversingQuery to find the container element. Default `::parent` (direct parent).
- `esl-img-container-cls` - optional, class to set on the container element. Supports CSSClassUtils query. Default `img-container-loaded`.
- `esl-img-container-error-cls` - optional, class to set on the container element in case of image loading error. Supports CSSClassUtils query. Default `img-container-error`.

### Usage

Set `img-container-loaded` class on the direct parent of the image element upon image load.
```html
<div class="img-container">
  <img alt src="image.jpg" esl-img-container/>
</div>
```

Set class `img-container-loaded` on closest parent with class `img-container` upon image load.
```html
<div class="img-container">
  <picture>
    <source srcset="image.webp" type="image/webp">
    <img alt src="image.jpg" esl-img-container="::closest(.img-container)"/>
  </picture>
</div>
```
Note: it is not necessary to use `::closest` query in current case. `::parent` query with selector `img-container` will work as well.

Set custom class `loaded` on the direct parent of the image element upon image load.
```html
<div class="img-container">
  <img alt src="image.jpg" esl-img-container esl-img-container-cls="loaded"/>
</div>
```

Set custom class `loaded` on the direct parent of the image element upon image load and class `error` in case of image loading error.
```html
<div class="img-container">
  <img alt src="image.jpg" esl-img-container esl-img-container-cls="loaded" esl-img-container-error-cls="error"/>
</div>
```

Set custom class `loaded` on the direct parent of the image element upon image successful load.
Note: the error class query executed after the plain class query. So error class query could override the plain class query.
```html
<div class="img-container">
  <img alt src="image.jpg" esl-img-container esl-img-container-cls="loaded" esl-img-container-error-cls="!loaded"/>
</div>
```

---

## ESL Image Container (CSS Only)
A set of common CSS classes to use with native images. Seamless integration with ESLImageContainerMixin defaults. 

### Main container classes
- `img-container` - mandatory container class. (Can be set on `picture` element as well)
- `img-container-loaded` (Automatic) - class to set on the container element upon image load. ESLImageContainerMixin maintains this class.

### Aspect Ratio Container Classes
  - `img-container-16-9` - aspect ratio 16:9 container class.
  - `img-container-4-3` - aspect ratio 4:3 container class.
  - `img-container-1-1` - aspect ratio 3:2 container class.

### Image Classes
By default images inside `img-container` will be stretched to cover the container area.
  - `img-cover` - class to set on `img` element to cover the container area maintaining aspect ratio.
  - `img-contain` - class to set on `img` element to fit (inscribe) the container area maintaining aspect ratio.

### Usage
```html
<picture class="img-container img-container-16-9">
  <source srcset="image.webp" type="image/webp">
  <img alt src="image.jpg" class="img-cover" esl-img-container/>
</picture>
```
