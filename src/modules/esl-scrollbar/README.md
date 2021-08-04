# [ESL](../../../) Scrollbar

Version: *1.1.0*

Authors: *Yuliya Adamskaya*

<a name="intro"></a>

ESLScrollbar - custom element, that replaces the browser's default scrollbar without loss in performance.
 
--- 
 
### Supported Features:
- directions : `vertical` and `horisontal` mode
- independent target element definition using [TraversingQuery](./../esl-traversing-query/README.md)
- completely customizable from CSS

### Attributes:

- **horizontal** - horizontal scroll orientation marker

- **target** - [TraversingQuery](./../esl-traversing-query/README.md) to find scrollable content

- **thumb-class** (default 'scrollbar-thumb') - class that will be added to scroll thumb

- **track-class** (default 'scrollbar-track') - class that will be added to scroll track

### Readonly Attributes
- inactive \[boolean] - appears when scroll state and position are refreshed
  
- dragging \[boolean] - indicates that thumb is currently being dragged

### API
- refresh - shortcut function for refreshing scroll state and position

### Examples
```html
<div class="content esl-scrollable-content">
    <div>
        <p>Content...</p>
    </div>
    <esl-scrollbar target="::parent"></esl-scrollbar>
</div>
```
```html
<div class="esl-scrollable-content">
    <p>Content...</p>
</div>
<esl-scrollbar target="::prev" vertical></esl-scrollbar>
```
