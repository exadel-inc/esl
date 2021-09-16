# [ESL](https://exadel-inc.github.io/esl/) Footnotes

Version: *1.0.0-beta*.

Authors: *Dmytro Shovchko*.

***Important Notice: the component is under beta version, it is tested and ready to use but be aware of its potential critical API changes.***

<a name="intro"></a>

ESLFootnotes is a custom element that is used to collect all ESLNote elements in bounds of the scope and output sorted and grouped list of collected notes.

ESLNote is a custom element that is used to show notification by the tooltip GUI element.

The elements are interrelated and don't make sense on their own. This is because once the elements are added to the DOM, they establish the link between ESLFootnotes and each ESLNote.

### ESLFootnotes Attributes | Properties:

- `scopeTarget` (string) - target element (TraversingQuery selector) to define scope of footnotes ('::parent' by default)

- `grouping` (string) - grouping note instances with identical content. Available options:
  -  `enable` - default, notes with identical content will be grouped
  -  `disable` - without grouping


### ESLNote Attributes | Properties:

- `linked` - readonly marker of linked with footnotes

- `tooltip-shown` - readonly marker which exists when note tooltip is shown

- `html` - content of note tooltip. If not present, it fills with innerHTML of ESLNote

- `track-click` - `ESLMediaQuery` to define allowed to track click event media. (`all` by default)
  
- `track-hover` - `ESLMediaQuery` to define allowed to track hover event media. (`all` by default)
