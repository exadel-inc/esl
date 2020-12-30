# [ESL](../../../README.md) Scrollbar

Version: *1.0.0-alpha*

Authors: *Yuliya Adamskaya*

ESLScrollbar - custom element, that replaces the browser's default scrollbar without losing performances.
 
--- 
 
### Supported Features:
- directions : `vertical` and `horisontal` mode

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
