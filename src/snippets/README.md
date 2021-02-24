# UIP Snippets

UIPSnippets - custom element, container that stores snippets (component's templates)

---

### Notes:

- Component's markup should be placed in **template** tags.
- Templates should have *uip-snippet*, *label* attributes.
- An active element could be chosen by adding class **active** to template, otherwise first template becomes active.
- Don't forget about <*ul class='snippets-list'*> at the end, list items are dynamically rendered.
---

### Example:

```html
<uip-snippets>
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
  <ul class='snippets-list'></ul>
</uip-snippets>
```
