# UIP Snippets

**UIPSnippets** - custom element which contain snippets (component's templates).
Extends [UIPPlugin](src/core/base/README.md#uip-plugin).

## Description:

- Component's markup should be placed in **template** tags.
- Templates should have *uip-snippet*, *label* attributes.
- An active element can be chosen by adding class **active** to template, otherwise first template becomes active.

**UIPSnippets** component produces [UIPStateModel](src/core/base/README.md#uip-state-model) changes, but it doesn't observe them.

## Example:

```html
<uip-snippets label="Snippets">
  <template uip-snippet label='Image Mode: save-ratio'>
    <esl-image mode="save-ratio"
               data-alt="Alt Text Test"
               data-src="img-3-carousel-9-6.jpg"
               data-src-base="/images/"></esl-image>
  </template>
  <template uip-snippet label='Image Mode: cover (additional classes: vertical alignment)'>
    <div class="img-container m-auto" style="width: 400px; height: 200px; border: 1px solid gray;">
      <esl-image mode="cover"
                 data-alt="Alt Text"
                 data-src="img-1-carousel-9-6.jpg | @2x => img-1-carousel-9-6.jpg"
                 data-src-base="/images/"></esl-image>
    </div>
  </template>
</uip-snippets>
```
