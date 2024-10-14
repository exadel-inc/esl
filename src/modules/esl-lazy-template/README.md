# [ESL](../../../) Lazy Template Mixin

Version: *1.0.0-beta*.

Authors: *Dmytro Shovchko*.

<a name="intro"></a>

**ESLLazyTemplate** is a custom mixin that can be used in combination with any HTML elements (usually `template` or `div`) to make parts of page markup not present in DOM if they are outside the viewport. It is also possible to not include these invisible parts of the markup in the page markup at once but to load it with a separate request if the user has scrolled the page and the elements marked by the mixin are now in the viewport.

This can be useful if you don't want to load all the content on the page at once, but load it only if the user scrolls to it. For example, some ads from some advertising networks.

To use **ESLLazyTemplate** you need to include the following code:
```js
  ESLLazyTemplate.register();
```

### Lazy Template Mixin Example

```html
<template esl-lazy-template="/assets/templates/lazy-markup.html"></template>
<div esl-lazy-template="/assets/templates/lazy-markup.html"></div>

<template esl-lazy-template> /* inline lazy content */ </template>
```
