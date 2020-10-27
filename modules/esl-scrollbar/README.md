# ESL Scrollbar

Version: *1.2.0*

Authors: *Yuliya Adamskaya*

ESLScrollbar - custom element, that replaces the browser's default scrollbar without losing performances.
 
--- 
 
### Supported Features:
- directions : `vertical` and `horisontal` mode

### Attributes:

- **horizontal** - horizontal scroll orientation marker

- **target** - class scrollable content

- **dragging** \[boolean] - always will be changed when track thumb drag is started or finished

- **thumb-class** (default 'scrollbar-thumb') - class that will be added to scrollbar container

- **track-class** (default 'scrollbar-track') - class that will be added to scrollbar container

### Readonly Attributes
- inactive \[boolean] - appears when scroll state and position are refreshed

### API
- refresh - shortcut function for refreshing scroll state and position

### Events
- scroll - emits every time when current source loading fails
- click - emits every time when track clicks
- body click - emits every time when track clicks to prevent clicks event on thumb drag
- mousedown - emits every time when track thumb drag is started
- mousemove - emits every time when thumb drag is moved
- mouseup - emits every time when thumb drag is ended
- resize - emits every time when document is resized

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
