
# ESLCarouselNavPlugin

ESL Carousel Dots should have the following structure:
```html
<esl-carousel-dots role="tablist">
   <button tabindex="-1"
           role="tab"
           class="esl-carousel-dot" 
           aria-label="Go to slide $index"
           aria-disabled="!$isActive"
           aria-current="$isActive"
           data-index="$index"></button>
   ...
</esl-carousel-dots>
```

Or (ideally but questionable):
```html
<esl-carousel-dots>
    <ul role="tablist">
        <li role="presentation">
            <button tabindex="-1"
                    role="tab"
                    class="esl-carousel-dot" 
                    aria-label="Go to slide $index"
                    aria-disabled="!$isActive"
                    aria-current="$isActive"
                    data-index="$index"></button>
        </li>
        ...
        </li>
    </ul>
</esl-carousel-dots>
```

## Notes

- We should be able to chose between dots as single control element, which is recommended by ARIA and dots as a group of buttons
- We should be able to add custom attributes to the dot element (analytics attributes, etc.)
- The attributes `aria-disabled`, `aria-current` and `data-index` should be managed by the ESLCarouselNavPlugin
- User may want to use custom `aria-label`, dot content based on slide index, count, etc.

### NTH Notes

- It may be useful if user can use more then just an index to define dot, ideally it should be able to use slide data...

--- 
## Problem & Questions

### 1. Make user able to define custom attributes on carousel dot

#### Solution 1: Make user able to use template

```html
<esl-carousel-dots>
   <template type="text/html">
      <button class="esl-carousel-dot" aria-label="Go to slide {index}"></button>
   </template>
</esl-carousel-dots>
```

Pros: 
 - simple & obvious
 - It is possible to use default template and override it with JS as well

Cons:
 - What if the user define system attribute ('aria-disabled', 'aria-current', 'data-index') in the template? Should we ignore them?
 - We can provide just a limited set of variables to the template (index, count, isActive, etc.)
 - We have no template engine to process conditions
 - We do not have a way replace dot builder except inheritance from ESLCarouselNavPlugin

Note:
 - It might be possible to pass custom data from slide using some data attributes

#### Solution 2: Make user able to define custom attributes in the ESLCarouselNavPlugin

```ts
  ESLCarouselNavDots.defineAttributes((index, count, slide) => ({
    'aria-label': `Go to slide ${slide.title} with index ${index}`,
    'data-analytics': `slide-${slide.id}`
  }));
```

Pros:
 - It is possible to use any data from slide
 - It is possible to use any logic to define attributes
 - It is possible to use any attributes (except system attributes)

Cons:
 - There is no way to change DOM structure and dot tag (do we need it?)
 - It is not clear how to manage inner content of the dot element

Note:
 - Probably the inner content could be manged by `textContent` or `innerHTML` passed as a part of the attributes object

#### Solution 3: Make user able to define custom builder

```ts
  ESLCarouselNavDots.setDotBuilder((index, count, slide) => {
    const dot = document.createElement('button');
    dot.classList.add('esl-carousel-dot');
    dot.setAttribute('aria-label', `Go to slide ${slide.title} with index ${index}`);
    dot.setAttribute('data-analytics', `slide-${slide.id}`);
    return dot;
  });
```

Pros:
 - It is possible to use any data from slide
 - It is possible to use any logic to define attributes
 - It is possible to use any attributes (except system attributes)
 - It is possible to change DOM structure and dot tag
 - It is possible to use JSX or any other template engine

Cons:
 - Is it overkill?

Note:
 - We can make both instance and static methods to define builder
 - We can make dots responsive to `setDotBuilder` call

 - Probably we can combine some approaches

 - to access default builder we can use `ESLCarouselNavDots.defaultDotBuilder`, eg:
```ts
    ESLCarouselNavDots.setDotBuilder((index, count, slide) => {
        const dot = ESLCarouselNavDots.defaultDotBuilder(index, count, slide);
        dot.setAttribute('data-analytics', `slide-${slide.id}`);
        return dot;
    });
```
