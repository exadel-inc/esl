# [ESL](../../../) Image (Legacy)

Version: *1.3.0*

Authors: *Alexey Stsefanovich (ala'n)*, *Yuliya Adamskaya*

<a name="deprecation"></a>

_⚠️ This module is considered legacy. 
If you does not support IE11, consider using native `<img>` element with `loading="lazy"` attribute or `<picture>` element with `loading="lazy"` attribute on sources 
in combination with lightweight [ESLImageUtils](../esl-image-utils/README.md) module. ⚠️_

<a name="intro"></a>

**ESLImage** - a custom element, that provides flexible ways to include images on web pages. 
Was originally developed as an alternative to `<picture>` element, but with more features inside.

--- 
 
### Supported Features:
 - Different rendering modes: 
   - `cover` - renders the image via `background-image` CSS property, `background-size` is `cover` by default, `width` and `height` are `100%` by default;
   - `safe-ratio` - renders the image via `background-image` CSS property, but also sets height using `padding-top: {aspectRatio}%;` trick;
   - `fit` - renders the image using inner `<img>` element;
   - `origin` - renders the image using inner `<img>` element, sets width/height attributes using image's original size;
   - `inner-svg` - renders svg content inside (the content is loaded via XHR request).
 - Lazy loading modes:
   - *none* - image starts loading immediately;
   - *manual* - starts loading image when a marker is provided manually;
   - *auto* - image starts loading only if it's visible and is inside or close to browser viewport area (determined using Intersection Observer API).
 - `ESLMediaQuery` - special syntax that allows defining different sources for different media queries. Supports media-query shortcuts.
 - Marker class. ESL Image can add a specific class on the specified parent element when the image is ready. ESL Image itself also has markers that indicate its state.
 - Provides events on state change (also supports inline syntax, e.g. `<esl-image-tag onload="">`).
 - Attributes observing.
 - A11y.

### Accessibility behavior
ESL Image uses 'img' role if the role is not explicitly provided.
If the role is 'img' then `alt` attribute is used as the `aria-label` for the image.
In case `alt` is not provided then an empty value is used as a fallback.
`data-alt` is considered a legacy attribute and is used only when the image was connected to DOM without `alt` or `aria-label` attribute.

### Attributes:

- **data-src** - src paths with query conditions. See [ESLMediaQuery](../esl-media-query/README.md) (watched value)

- **data-src-base** - base src path for paths described in data-src (watched value)

- **alt** - alt image text (watched value)

- ~~**data-alt**~~ (Deprecated) - alt image text, not observable

- **mode** - rendering mode. Default - `save-ratio` (watched value):
  - `origin` - save origin image size (use inner `img` tag for rendering);
  - `fit` - use inner `img`, but do not force its width;
  - `cover` - do not set self width/height; use 100% w/h of the container (use `background-image` for rendering);
  - `save-ratio` - fill 100% of container width and set the self height according to image ratio (use `background-image` for rendering);
  - `inner-svg` - load an SVG content via XHR request and render it inside.

- **lazy** (optional) - enable lazy loading:
  - `auto` - IntersectionObserver mode: image starts loading as soon as it becomes visible in visual area
  - `manual` - start loading when `lazy-triggered` marker is set manually
  
- **refresh-on-update** \[boolean] (optional) - Always update the original image as soon as image source is changed

- **inner-image-class** (optional) - class to mark and search the inner image, 'inner-image' by default

- **container-class** (optional) - class that will be added to the container when the image is ready

- **container-class-state** (optional) - image state in which the container will be marked with `container-class` (can be 'ready', 'loaded' or 'error')

- **container-class-target** (optional) - [ESLTraversingQuery](../esl-traversing-query/README.md) to find the target to add `container-class` to ('::parent' by default).

NOTE: ESL Image supports `title` attribute like any HTML element, no additional reflection for that attribute is needed - it will work correctly according to HTML5.* REC

### Readonly Attributes
- ready \[boolean] - appears when the image is ready (either loaded or failed to load)
- loaded \[boolean] - appears when the image is loaded for the first time
- error \[boolean] - appears when current image failed to load

### API
- triggerLoad - shortcut function for manual adding `lazy-triggered` marker
- currentSrc - image URL that is currently in use

### Events
- ready - emits when the image is ready (either loaded or failed to load)
- load - emits when the image is loaded (also when the path is changed)
- error - emits when the current source failed to load.
