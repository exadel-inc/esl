# [ESL](https://exadel-inc.github.io/esl/) Carousel

Version: *1.0.0-beta*.

Authors: *Julia Murashko*, *Alexey Stsefanovich (ala'n)*.

***Important Notice: the component is under beta version, it is tested and ready to use but be aware of its potential critical API changes.***

<a name="intro"></a>

ESLCarousel - a slideshow component for cycling through slides.

ESLCarouselSlide - a component that provides content for ESLCarousel.

The elements are interrelated and don't make sense on their own. This is because once the elements are added to the DOM, they establish the link between ESLCarousel and each ESLCarouselSlide.

### ESLCarousel Attributes | Properties:

- `config` (ESLCarouselConfig) - [MediaQuery](../esl-media-query/README.md) to define behavior of ESLCarousel.

### ESLCarouselConfig (Configuration API)

- `type` (string) - a carousel rendering renderer
  - `slide` - default, one slide is active
  - `multi` - more than one slide can be active
- `count` (number) - a total number of slides
- `loop` (boolean) - defines whether the carousel is in a loop (false by default)
- `cls` (string) - a CSS class or classes to mark the carousel element (empty by default)
  (supports ESL extended class definition syntax, [CSSClassUtil](../esl-utils/dom/class.ts))

### ESLCarouselSlide Attributes | Properties:

- `active` (boolean) - an active state marker
