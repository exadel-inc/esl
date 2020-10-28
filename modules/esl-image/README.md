# ESL Image

Version: *2.3.1*

Authors: *Alexey Stsefanovich (ala'n)*, *Yuliya Adamskaya*

ESLImage - custom element, that provide flexible abilities to include images on web pages. 
Originally developed as alternative for picture component, but with more features inside.
 
--- 
 
### Supported Features:
 - different render modes: 
   - `cover` - renders by css background-image, background-size: cover by default, w/h:100% by default
   - `safe-ratio` - renders by css background-image but also set height using 'padding-top: aspectRatio%;' trick
   - `fit` - renders using inner `<img>` element
   - `origin` - renders using inner `<img>` element, set width/height attributes using image original size
   - `svg-inline` - renders svg content inside (loads using XHR request)
 - lazy loading modes
   - *none* - image start loading immediately
   - *manual* - start loading image by manually provided marker
   - *auto* - image start loading only if it is visible and in or closer to browser viewport area (Use IntersectionObserverAPI)
 - `ESLMediaQuery` special syntax that allows define different sources for different media queries, also supports shortcuts for media-queries
 - marker class. ESL Image can add specific class on specified parent element when image is ready, the ESL Image itself also has markers that indicate its state.
 - provides events on state change (also support inline syntax like `<esl-image-tag onload="">`)
 - attribute observing

### Attributes:

 - **data-src** - src paths per queries (watched value)

   *NOTE*: ESLMediaQuery support shortcuts for
   - Breakpoints like @MD, @SM (defined), @+SM (SM and larger), @-LG(LG and smaller)
   - Device point resolutions: @1x, @2x, @3x all conditions must be separated by conjunction ('and')
@example: '@+MD and @2x'

- **data-src-base** - base src path for pathes described in data-src

- **alt** - alt image text

- ~~**data-alt**~~(Deprecated) - alt image text

- **mode** - rendering mode (default 'save-ratio') (watched value)  
  - `origin` - save origin image size (use inner img tag for rendering)
  - `fit` - use inner img but not force it width
  - `cover` - didn't have self size use 100% w/h of container (use background-image for rendering)
  - `save-ratio` - fill 100% of container width and set self height according to image ratio (use background-image for rendering)

- **lazy** (optional) - enable lazy loading
  - `auto` - IntersectionObserver mode: image start loading as soon as it becomes visible in visual area)
  - `manual` - start loading when lazy-triggered marker set manually
  
- **refresh-on-update** \[boolean] (optional) - Always update original image as soon as image source changed

- **inner-image-class** (optional) - class to mark and search inner image, 'inner-image' by default

- **container-class** (optional) - class that will be added to container when image will be ready

- **container-class-onload** (optional) - marks that container-class shouldn't be added if image load ends with exception

- **container-class-target** (optional) - target parent selector to add container-class (parentNode by default).

NOTE: ESL Image supports title attribute as any html element, no additional reflection for that attribute needed it will work correctly according to HTML5.* REC

Events html connection points (see events section)
- onready (Evaluated Expression) \[function | string]
- onload (Evaluated Expression) \[function | string]
- onerror (Evaluated Expression) \[function | string]

### Readonly Attributes
- ready \[boolean] - appears once when image first time loaded
- loaded \[boolean] - appears once when image first time loaded
- error \[boolean] - appears when current src isn't load

### API
- triggerLoad - shortcut function for manually adding lazy-triggered marker
- targetRule - satisfied rule that need to be applied in current state

### Events
- ready - emits when image ready (loaded or load fail)
- load - emits every time when image loaded (including on path change)
- error - emits every time when current source loading fails.

### Examples
```html
 <esl-image-tag mode="save-ratio"
      data-src='..defaultPath [| mediaQuery => src [| ...]]'
 ></esl-image-tag>
```
```html
 <esl-image-tag mode="save-ratio"
    data-src='..defaultPath [| @+MD => src [| ...]]'
 ></esl-image-tag>
```
```html
 <esl-image-tag mode="save-ratio"
    data-src='..defaultPath [| @1x => src [| ...]]'
 ></esl-image-tag>
```
