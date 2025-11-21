# ESLCarouselInfo

`ESLCarouselInfo` is a small plugin that renders dynamic textual information about an `ESLCarousel` instance.

## Usage

- Place the `<esl-carousel-info>` element in your markup and optionally set `target` to point to a carousel.
- Use the `format` attribute to provide a template string. Supported placeholders: `{name}`, `{{name}}`, `{%name%}`.

## Attributes

- `format` (string) — Template string used to render the info text. Default: `"{current} of {total}"`.
- `target` (ESLTraversingQuery) — Traversing query to find the carousel. Default: `::parent(.esl-carousel-nav-container)::find(esl-carousel)`.

## State object

The element exposes the following state properties available in the format template:

- `current` — 1-based index of the active group
- `total` — total number of groups
- `currentSlide` — 1-based index of the active slide
- `totalSlides` — total number of slides
- `title` — title of the active slide (read from `data-title`, `title`)
- `percent` — progress percentage across groups (e.g., `75`)

## Notes on template engines

The formatter supports `{name}`, `{{name}}`, and `{%name%}` placeholders without spaces. Some template engines (e.g., Nunjucks/Liquid) may interpret `{{..}}` and `{%..%}`. If you use such engines in your HTML pipeline, prefer `{name}` placeholders or wrap the content in a raw block provided by your template engine.

## Examples

```html
  <esl-carousel-info format="Slide {current} of {total}"></esl-carousel-info>
  <esl-carousel-info format="{title} of {totalSlides}"></esl-carousel-info>
  <esl-carousel-info format="Progress: {percent}%"></esl-carousel-info>
  <esl-carousel-info target="#promo-carousel"></esl-carousel-info>
```
