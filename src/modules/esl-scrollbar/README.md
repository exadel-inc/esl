# [ESL](https://exadel-inc.github.io/esl/) Scrollbar

Version: *1.2.0*

Authors: *Yuliya Adamskaya*

<a name="intro"></a>

___ESL Scrollbar___ (`<esl-scrollbar>`) is a reusable web component that replaces the browser's default scrollbar with 
a _custom scrollbar_ implementation.

ESL Scrollbar is entirely configurable and can be styled through CSS.

#### ESL Scrollbar supports:

- both scroll directions: `vertical` and `horizontal`.  
  Direction can be defined with the boolean `horizontal` attribute.

- independent target scrollable element definition using [TraversingQuery](https://exadel-inc.github.io/esl/utils/esl-traversing-query/)

- complete customization from CSS

- RTL for both directions and all browsers on ESL support list


### Getting Started:

1. Register ESLScrollbar component
```js
  import {ESLScrollbar} from '@exadel/esl';
  ESLScrollbar.register();
```

2. Add the `<esl-scrollbar>` custom tag, and define its target and direction:
```html
  <div class="content esl-scrollable-content">
    <p>Content...</p>
    <esl-scrollbar target="::parent"></esl-scrollbar>
  </div>
  <!-- or  -->
  <div class="esl-scrollable-content">
    <p>Content...</p>
  </div>
  <esl-scrollbar target="::prev" horizontal></esl-scrollbar>
```

Note: use `esl-scrollable-content` OOTB class to hide browser native scrollbar. 
Use the full module path to import it 
```css
  @import '@exadel/esl/modules/esl-scrollbar/core.css';
```

### Attributes:

- `horizontal` \[boolean] - horizontal scroll direction marker

- `target` - [TraversingQuery](https://exadel-inc.github.io/esl/utils/esl-traversing-query/) to find the container of scrollable content

- `thumb-class` (default `scrollbar-thumb`) - class(es) that will be added to the scroll thumb

- `track-class` (default `scrollbar-track`) - class(es) that will be added to the scroll track


### Readonly Attributes

- `inactive` \[boolean] - appears when the scrollable content fits the container, or there is nothing to scroll
  
- `dragging` \[boolean] - indicates that the scrollbar thumb is currently being dragged

### Public API methods

- `refresh()` - shortcut function to refresh the scrollbar state and position
