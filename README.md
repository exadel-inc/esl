# UIPlayground

UIPlayground is a solution for presenting your custom components.

With the help of *UIP* components we allow user to *'play'* with a component.
You can choose from the variety of component's templates ([UIP Snippets](./src/snippets/README.md)),
play with the component's settings ([UIP Settings](./src/settings/README.md))
or even change its markup ([UIP Editor](./src/editor/README.md))!.

---
### Notes:

- Every element (except the *UIP Root*) isn't required, so you can combine them the way you want.

---
### Components:
- ##### [UIP Root](./src/core/README.md)
- ##### [UIP Snippets](./src/snippets/README.md)
- ##### [UIP Preview](./src/preview/README.md)
- ##### [UIP Settings](./src/settings/README.md)
- ##### [UIP Editor](./src/editor/README.md)

---
### Example:
```html
<uip-root>
  <uip-snippets></uip-snippets>
  <uip-preview></uip-preview>
  <uip-settings></uip-settings>
  <uip-editor></uip-editor>
</uip-root>
```
