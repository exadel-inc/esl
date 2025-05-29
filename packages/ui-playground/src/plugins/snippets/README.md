**UIPSnippets** - the primary plugin to display snippets of the UI Playground.

**UIPSnippets** uses [UIPSnippetList](src/plugins/snippets-list/README.md) to render the list of snippets and [UIPSnippetsTitle](src/plugins/snippets-title/README.md) to render the title of the list.
**UIPSnippets** can be rendered in two modes: *tabs* and *dropdown*.

The following sample will render snippets as a tab list in the header:

```html
<uip-root>
    <uip-snippets class="uip-toolbar"></uip-snippets>
    ...
</uip-root>
```

To render snippets as a dropdown list, set the `dropdown-view` attribute to `all`:

```html
<uip-root>
    <uip-snippets class="uip-toolbar" dropdown-view="all"></uip-snippets>
    ...
</uip-root>
```

The `dropdown-view` attribute can be any ESLMediaQuery value, so you can switch mode depending on the screen size.

```html
<uip-root>
    <uip-snippets class="uip-toolbar" dropdown-view="(max-width: 768px)"></uip-snippets>
    ...
</uip-root>
```

The class `uip-toolbar` is used to style the section as a toolbar-header for the UIPlayground.
The combinations of `uip-snippets` and buttons (e.g. `uip-copy`, `uip-theme-toggle` or `uip-direction-toggle`) 
are also allowed with additional div wrapper:

 ```html
 <uip-header>
    <div class="uip-toolbar">
        <uip-snippets></uip-snippets>
        <uip-theme-toggle></uip-theme-toggle>
    </div>
    ...
 </uip-header>
 ```
