# [ESL](../../../) Anchornav

Version: *1.0.0-beta*.

Authors: *Dmytro Shovchko*.

***Important Notice: the component is under beta version, it is tested and ready to use but be aware of its potential critical API changes.***

<a name="intro"></a>

The ESL Anchornav component allows users to quickly jump to specific page content via predefined anchors. The list of anchors is collected from the page dynamically, so any page updates will be processed and the component updates the navigation list.

### How it works

The component collects anchors on the page, builds a list of anchors using the user-defined renderer function, and appends it to the inner items container element (it will be an element with `esl-anchors-items` attribute). After that, the component observes the position of the collected anchors to detect currently active anchor and marks it with active class marker.

For example, markup may be the following:
```html
<esl-anchornav>Anchors: <nav esl-anchors-items></nav></esl-anchornav>
```
If for some reason you do not add an element with this attribute to the component content, it will not be a mistake. A div with the `esl-anchors-items` attribute will be created and added to the component content in this case.

You can assign anchors to any element on the page. To do this, you must give this element the `esl-anchor` attribute. Another mandatory requirement for an element is that it must contain two attributes `id` and `title` (this is the text to be displayed in the list).

### Items renderer

For all collected anchors it is used renderer function which builds the inner content of the anchors list. Here is a default renderer:
```ts
ESLAnchornav.setRenderer((data: ESLAnchorData, index: number, anchornav: ESLAnchornav) => `<a class="esl-anchornav-item" href="#${data.id}">${data.title}</a>`);
```
You can define your own renderer. You can define several renderers with different names and use them on different components.

### ESLAnchornav

#### Public API
- `setRenderer` - a static method to set item renderer
- `getRenderer` - a static method to get item renderer with specified name
- `active` (ESLAnchorData) - active anchor data
- `offset` (number) - anchornav top offset, used when detects active anchors (0 by default)
- `update` - updates component

#### Attributes | Properties:

- `position` - popup position relative to the trigger (currently supported: 'top', 'bottom', 'left', 'right' ) ('top' by default)
- `renderer` - item renderer which is used to build inner markup
- `active-class` - CSS classes to set on active item (and remove when item inactive)

#### Events

 - `esl:anchornav:activechanged` - event to dispatch on `ESLAnchornav` when active item changed
 - `esl:anchornav:updated` - event to dispatch on `ESLAnchornav` updated state

### ESLAnchornavSticked

To implement the sticky behavior of a component, you can use the `ESLAnchornavSticked` mixin. Register the mixin and add the `esl-anchornav-sticked` attribute to the anchor element container.
