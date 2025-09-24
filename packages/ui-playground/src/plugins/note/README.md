**UIPNote** - custom element that is associated with a snippet. **UIPNote** is displayed if the snippet item is active.

## Example

```html
<uip-root>
  <div class="uip-toolbar">
    <uip-snippets dropdown-view="all"></uip-snippets>
  </div>
  <script type="text/html" uip-snippet-note="snippet-note1" uip-snippet>
    ...
  </script>
  <script type="text/html" uip-snippet-note="snippet-note2" uip-snippet>
    ...
  </script>
  <script id="snippet-note1" type="text/html">
    Snippet note 1
  </script>
  <script id="snippet-note2" type="text/html">
    Snippet note 2
  </script>
  <uip-note></uip-note>
  <uip-preview></uip-preview>
    ...
</uip-root>
```
