# UIP Snippets

**UIPSnippets** - custom element which contains snippets (markup's templates). It allows users to see different predefined component's variations. Extends [UIPPlugin](src/core/README.md#uip-plugin).

## Description

- Snippets should be placed in *template*/*script* tags, which should be placed inside [UIPRoot](src/core/README.md#uip-root).
- Script/template tags should have *uip-snippet* attribute and *label* attribute with a snippet's name.
- The first snippet is displayed by default.

**UIPSnippets** component produces [UIPStateModel](src/core/README.md#uip-state-model) changes, but it doesn't observe them.

## Example

```html
<uip-root>
  <uip-header>
    <uip-snippets></uip-snippets>
  </uip-header>
</uip-root>
<script uip-snippet label='Image Mode: save-ratio'>
  <esl-image mode="save-ratio"
              data-alt="Alt Text Test"
              data-src="img-3-carousel-9-6.jpg"
              data-src-base="/images/"></esl-image>
</script>
<script uip-snippet label='Image Mode: cover (additional classes: vertical alignment)'>
  <div class="img-container m-auto" style="width: 400px; height: 200px; border: 1px solid gray;">
    <esl-image mode="cover"
                data-alt="Alt Text"
                data-src="img-1-carousel-9-6.jpg | @2x => img-1-carousel-9-6.jpg"
                data-src-base="/images/"></esl-image>
  </div>
</script>
```
