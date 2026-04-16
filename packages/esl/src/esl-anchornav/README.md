# [ESL](../../../) Anchornav

Version: *2.0.0-beta*.

Authors: *Dmytro Shovchko*, *Aliaksei Stsefanovich (ala'n)*.

***Important Notice: the component is under beta version, it is tested and ready to use but be aware of its potential critical API changes.***

<a name="intro"></a>

The ESL Anchornav component allows users to quickly jump to specific page content via predefined anchors. The list of anchors is collected from the page dynamically, so any page updates will be processed and the component updates the navigation list.

### How it works

The component collects anchors on the page, builds a list of anchors using the user-defined renderer function, and appends it to the inner items container element (it will be an element with `esl-anchornav-items` attribute). After that, the component observes the position of the collected anchors to detect currently active anchor and marks it with active class marker.

For example, markup may be the following:
```html
<esl-anchornav>Anchors: <nav esl-anchornav-items></nav></esl-anchornav>
```
If for some reason you do not add an element with this attribute to the component content, it will not be a mistake. A div with the `esl-anchornav-items` attribute will be created and added to the component content in this case.

You can assign anchors to any element on the page. By default, the component searches for elements with the `esl-anchor` attribute (i.e. selector `[esl-anchor]`). Another mandatory requirement for an element is that it must have `id` and `title` attributes (the `title` is the text to be displayed in the list).

### Items renderer

For all collected anchors it is used renderer function which builds the inner content of the anchors list. Here is a default renderer:
```ts
ESLAnchornav.setRenderer((data: ESLAnchorData, index: number, anchornav: ESLAnchornav) => `<a class="esl-anchornav-item" href="#${data.id}">${data.title}</a>`);
```
You can define your own renderer. You can define several renderers with different names and use them on different components.

### Hierarchical Navigation

ESL Anchornav supports hierarchical (nested) navigation structures. To enable hierarchy, use the `group-by` attribute:

```html
<esl-anchornav group-by="level"></esl-anchornav>
```

When hierarchy is enabled:
- Anchors are organized into a tree structure based on data from the `esl-anchor` attribute
- The `ESLAnchorData` interface includes `data`, `parent`, and `children` properties
- You can override `updateActiveClasses()` method to implement custom active state logic (e.g., parent item activation)

#### Example: Hierarchical Anchors

```html
<!-- Page content with hierarchical anchors -->
<h2 esl-anchor="level: 0" id="section1" title="Section 1">Section 1</h2>
<h3 esl-anchor="level: 1" id="subsection1-1" title="Subsection 1.1">Subsection 1.1</h3>
<h3 esl-anchor="level: 1" id="subsection1-2" title="Subsection 1.2">Subsection 1.2</h3>
<h2 esl-anchor="level: 0" id="section2" title="Section 2">Section 2</h2>
```

Note: The `esl-anchor` attribute uses JSON-like syntax to define data properties. For example, `esl-anchor="level: 1"` sets the `level` property in the anchor's data object.

#### Custom Hierarchical Renderer

When rendering hierarchical navigation, **you must use `nav.renderItem()` for nested items** to ensure proper registration:

```tsx
ESLAnchornav.setRenderer('hierarchical', (data: ESLAnchorData, index: number, nav: ESLAnchornav) => {
  const item = document.createElement('li');
  item.innerHTML = `<a href="#${data.id}">${data.title}</a>`;
  
  if (data.children && data.children.length > 0) {
    const sublist = document.createElement('ul');
    data.children.forEach((child, i) => {
      // IMPORTANT: Use nav.renderItem() to register nested items
      sublist.appendChild(nav.renderItem(child, i));
    });
    item.appendChild(sublist);
  }
  
  return item;
});
```

**Important:** Always use `nav.renderItem(child, index)` when rendering child items. Direct renderer calls will not register items properly and active state will not work.

#### Custom Hierarchy Logic

To implement custom hierarchy logic (e.g., using `parent` property from anchor data), you can register a custom hierarchy builder:

```typescript
import {ESLAnchornav} from '@exadel/esl/modules/esl-anchornav/core';
import type {ESLAnchorData, ESLAnchornavHierarchyBuilder} from '@exadel/esl/modules/esl-anchornav/core';

const buildByParent: ESLAnchornavHierarchyBuilder = (flatAnchors: ESLAnchorData[]) => {
  // Build hierarchy using 'parent' property from anchor data
  const map = new Map<string, ESLAnchorData>();
  
  flatAnchors.forEach(anchor => {
    anchor.children = [];
    map.set(anchor.id, anchor);
  });
  
  const roots: ESLAnchorData[] = [];
  flatAnchors.forEach(anchor => {
    const parentId = anchor.data.parent; // Access data object
    if (parentId && map.has(parentId)) {
      anchor.parent = parentId;
      map.get(parentId)!.children!.push(anchor);
    } else {
      roots.push(anchor);
    }
  });
  
  return roots;
};

// Register the builder
ESLAnchornav.setHierarchyBuilder('parent', buildByParent);
```

Then use it with the `group-by` attribute:
```html
<esl-anchornav group-by="parent"></esl-anchornav>
```

Markup example:
```html
<h2 esl-anchor id="section1" title="Section 1">Section 1</h2>
<h3 esl-anchor="parent: section1" id="subsection1-1" title="Subsection 1.1">Subsection 1.1</h3>
```

Alternatively, you can override the `buildHierarchy()` method in a subclass for component-specific logic.

### ESLAnchornav

#### Public API
- `setRenderer` - a static method to set item renderer
- `getRenderer` - a static method to get item renderer with specified name
- `setHierarchyBuilder` - a static method to set hierarchy builder
- `getHierarchyBuilder` - a static method to get hierarchy builder with specified name
- `renderItem(data, index?, renderer?)` - renders a single anchor item and registers it (use this for nested items)
- `active` (ESLAnchorData) - active anchor data
- `offset` (number) - anchornav top offset, used when detects active anchors (0 by default)
- `update` - updates component

#### Attributes | Properties:

- `renderer` - item renderer which is used to build inner markup
- `active-class` - CSS classes to set on active item (defaults to `'active'`)
- `anchor-selector` - selector (ESLTraversingQuery syntax) used to find anchors (defaults to `[esl-anchor]`)
- `group-by` - grouping mode for building hierarchy: `'level'` to group by data-level attribute, empty string for flat list (defaults to `''`)

- `empty`(readonly) - boolean attribute to mark that no anchors were found on the page

#### Events

 - `esl:anchornav:activechanged` - event to dispatch on `ESLAnchornav` when active item changed
 - `esl:anchornav:updated` - event to dispatch on `ESLAnchornav` updated state

### ESLAnchornavSticked

To implement the sticky behavior of a component, you can use the `ESLAnchornavSticked` mixin. Register the mixin and add the `esl-anchornav-sticked` attribute to the anchor element container.
