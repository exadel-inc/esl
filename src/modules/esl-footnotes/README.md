# [ESL](../../../) Footnotes

Version: *1.0.0-beta*.

Authors: *Dmytro Shovchko*.

***Important Notice: the component is under beta version, it is tested and ready to use but be aware of its potential critical API changes.***

<a name="intro"></a>

**ESLFootnotes** is a custom element that is used to collect all `ESLNote` elements in bounds of the scope and output sorted and grouped list of collected notes.

**ESLNote** is a custom element that is used to show notification by the tooltip GUI element.

The elements are interrelated and don't make sense on their own. This is because once the elements are added to the DOM, they establish the link between ESLFootnotes and each ESLNote.

ESLNote is a badge with a number or symbol. When it's hovered or clicked (user-defined behavior), it shows a tooltip with text information. Depending on the state of the ESLNote, it may display:
 - `0` - if the note is not associated with the footnotes
 - `*` - if the note is linked to the footnotes but in a standalone mode
 - `1...` (positive number) - ordinal index from the associated footnotes, if linked in a normal (default) mode

### ESLFootnotes Attributes | Properties:

- `scopeTarget` (string) - target element ([ESLTraversingQuery](../esl-traversing-query/README.md) selector) to define scope of footnotes (`::parent` by default)

- `grouping` (string) - grouping note instances with identical content. Available options:
  -  `enable` - default, notes with identical content will be grouped
  -  `disable` - without grouping

- `back-to-note-label` (string) - a text label to show in the title on the return-to-note button (`Back to note` by default)


### ESLNote Attributes | Properties:

- `linked` - read-only marker that appears on the note linked with the footnotes

- `standalone` - read-only marker which indicates that the note remains independent of the notes even if it is linked with them (ignore mode, for example) and doesn't receive its ordinal index from the footnotes (the default * or a user-defined value is displayed)

- `tooltip-shown` - read-only marker which appears when note's tooltip is shown

- `container` - defines container element ([ESLTraversingQuery](../esl-traversing-query/README.md) selector) to determinate bounds of tooltip visibility (window by default)

- `ignore` - [MediaQuery](../esl-media-query/README.md) to specify device media conditions when footnotes must ignore current note (`not all` by default)

- `html` - content of note tooltip. If not present, it fills with innerHTML of ESLNote

- `standalone-label` - note's label in the standalone mode (detached from footnotes), in the connected mode it is a numeric index that is calculated automatically. (`*` by default)

- `track-click` - [MediaQuery](../esl-media-query/README.md) to define allowed to track click event media. (`all` by default)
  
- `track-hover` - [MediaQuery](../esl-media-query/README.md) to define allowed to track hover event media. (`all` by default)
