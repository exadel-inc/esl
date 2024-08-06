# UIP Snippets List

**UIPSnippetsList** - custom element to display a list of available snippets.

**UIPSnippetsList** observes UIPModel snippets changes and updates the list of available snippets.
Component supports active snippet item marker and snippet selection by click.
More details can be found in [UIP Snippets](src/plugins/snippets/README.md) section.

## Example

```html
<uip-snippets-list root="::next"></uip-snippets-list>
<uip-root>
    <uip-preview></uip-preview>
    ...
</uip-root>
```
