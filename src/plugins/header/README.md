# UIP Header

**UIPHeader** - custom element, a container for [UIPSnippets](src/header/snippets/README.md) and [UIPOptions](src/header/options/README.md).

# Description
By default *UIPHeader* initializes *UIPSnippets*, *UIPOptions* and a copy icon inside of it, so you need to add an empty *uip-header* tag only. But you can also manually set what stuff do you want it to render. The following example shows how you can display [UIPSnippets](src/header/snippets/README.md) only:

```html
<uip-header>
    <uip-snippets></uip-snippets>
</uip-editor>
```
 
 An empty *uip-header* is an equivalent to the next snippet:

 ```html
 <uip-header>
    <uip-snippets></uip-snippets>
    <uip-options></uip-options>
    <button class="copy-icon" title="copy markup"></button>
 </uip-header>
 ```
