# [ESL](../../../) Line Clamp Mixin

Version: *1.0.0*

Authors: *Dmytro Shovchko*, *Feoktyst Shovchko*

<a name="intro"></a>

<a name="line-clamp"></a>

A lightweight helper mixin for limiting the number of lines of text with automatic addition of ellipsis (...) at the end.

## ESL Line Clamp

`ESLLineClamp` (`esl-line-clamp`) is a custom attribute (mixin) used to add the functionality of text lines clamping. Additionally, it also handles focus management and scroll behavior to ensure a smooth user experience.

It leverages native browser features to limit the content of a block to the specified number of lines, known as `line-clamp`. Despite this feature still being in draft status, it is well supported by modern browsers (NOTE: currently, you should use it with the `-webkit` prefix). Check [browser support](https://caniuse.com/?search=line-clamp) and see the [reference on MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/line-clamp).

This mixin does not interfere with the built-in text limiting feature in any way. It only adds additional useful features, namely:
 - flexible options for setting the number of lines to be clamped (numeric value or `ESLMediaQuery`)
 - determination of the state of the block (clamped or not)
 - focus control - if there are accessible elements (e.g., links) in the clamped text lines, they will be accessible for focusing. When an element receives focus among the clamped content, the block lines are scrolled so that the focus element is visible. When the block with clamped content loses focus, the mixin returns the lines to their initial position
 - handles the `esl:show:request` event - that is, if an element located among the clamped text requests to be displayed, it will be moved to the viewport area.


#### Attributes / Properties

 - `clamped` - state marker when text is clamped

### Configuration

The mixin uses a primary attribute, `esl-line-clamp`, with an optional number of lines to clamp or a string with `ESLMediaQuery` to set up lines depending on the environment or breakpoints.

The value of the attribute can be omitted. In that case number of lines is defined by the CSS variable `--esl-line-clamp`.

The last option of applying clamping is preferable because it doesn't require initialization of the mixin to start working. The browser just needs to parse HTML and CSS to be ready to work on clamping.

### Usage

Apply line clamping to the paragraph and limit text to 5 lines.
```html
<p esl-line-clamp="5">
  <!-- text -->
</p>
```

Apply line clamping to the paragraph and limit text by line count, depending on the media query (3 lines on XS breakpoint, 5 lines on SM and MD breakpoints, disable clamping on LG and upper breakpoints).
```html
<p esl-line-clamp="3 | @+SM=>5 | @+LG=>none">
  <!-- text -->
</p>
```

Apply line clamping to the paragraph without defining a limit. The number of lines should be defined through styles by a CSS variable `--esl-line-clamp`.
```html
<p esl-line-clamp>
  <!-- text -->
</p>
```

### Auto mode

The mixin also supports automatic mode. This is when you don't know the exact number of lines to display, and you can't explicitly specify them using CSS variables or pass them as an attribute. In this case, you can use the mixin in automatic mode.
```html
<p esl-line-clamp="auto">
  <!-- text -->
</p>
```

Or using media query
```html
<p esl-line-clamp="4 | @+MD=>auto">
  <!-- text -->
</p>
```

For it to work, the element to which the mixin is applied must have a `max-height` specified. In this case, the mixin will be able to calculate the number of lines for clamping. If the automatically calculated number of lines is infinity or a non-numeric value or less than 1, then the mixin does not set a limit.


### ESLMediaQuery tuple values

Mixin supports ESL Media Query syntax for values — a tuple string of values that uses '|' as a separator. A mask must be specified for this. Mask - `ESLMediaQuery` media conditions tuple string (uses '|' as separator), to be used in case of tuple syntax.
Note: line-clamp mixin will produce an error in case global mask empty or incompatible with the tuple clamp value.

```html
<p esl-line-clamp="1|2|3">
  <!-- text -->
</p>
```

The mask can be defined globally as the default before registering the mixin
```ts
ESLLineClamp.DEFAULT_MASK = '@XS|@SM|@MD';
```

Or specify a mask at the point of use of the mixin
```html
<p esl-line-clamp="1|2|3|4|5" esl-line-clamp-mask="@XS|@SM|@MD|@LG|@XL">
  <!-- text -->
</p>
```
<br/>

### Alternative clamp values

`ESLLineClamp` provides support for scenarios where clamping needs an alternative variant, (collapsed/expanded for example). This behavior can be achieved by providing `--esl-line-clamp-alt` CSS variable. And the `alt-active` attribute is used to switch between default and alternative values

A custom mixin element [`ESLLineClampAlt`](#line-clamp-alt) can be also used to ease alternative value provision.

<a name="line-clamp-alt"></a>

## ESLLineClampAlt mixin

`ESLLineClampAlt` (`esl-line-clamp-alt`) is a mixin element designed to work complementary to [`ESLLineClamp`](#line-clamp). Its purpose is to provide alternative line clamp values that can be toggled on/off, allowing to switch between the regular clamp configuration and an alternative one.

### Attributes / Properties

- `esl-line-clamp-alt` - primary attribute that defines the number of lines to clamp
- `alt-active` - readonly boolean attribute that can be used to toggle alternative value

### Configuration

The `esl-line-clamp-alt` attribute accepts:
- empty value - All lines included (e.g., `"0"`, `""`)
- numeric values - Direct line count (e.g., `"3"`, `"5"`)
- media query syntax - Responsive configuration (e.g., `"3 | @+MD=>5 | @+LG=>auto"`)

### Usage

#### Basic Usage with Regular Clamp
```html
<!-- Element with both regular clamp (3 lines) and alt clamp (6 lines) -->
<div esl-line-clamp="3" esl-line-clamp-alt="6">
  <!-- Long text content - shows 3 lines by default, 6 lines when alt is active -->
</div>
```
Or with media query:

```html
<div esl-line-clamp="2 | @+MD=>3" esl-line-clamp-alt="4 | @+MD=>6">
  <!-- 2 lines mobile, 3 lines desktop -->
</div>
```
Alternative value will be enabled by providing `alt-active` attribute:

```html
<div esl-line-clamp="2 | @+MD=>3" esl-line-clamp-alt="4 | @+MD=>6" alt-active>
  <!-- 4 lines mobile, 6 lines desktop -->
</div>
```

<br/>

<a name="line-clamp-toggler"></a>

## ESLLineClampToggler mixin

`ESLLineClampToggler` (`esl-line-clamp-toggler`) is another additional mixin element. Its purpose is to provide toggle controls for switching between regular [`ESLLineClamp`](#line-clamp) values and [`ESLLineClampAlt`](#line-clamp-alt) values.

### Attributes / Properties

- `esl-line-clamp-toggler` - primary attribute with a provided query to find target element
- `a11y-label` - optional attribute to provide aria-label for active state
- `toggler-active` - readonly boolean attribute indicating if the toggler is in active state
- `esl:clamp:toggle` - an event that will be dispatched on target clamp element when toggled

### Configuration

`esl-line-clamp-toggler` will locate the `ESLLineClamp` target element using ([ESLTraversingQuery](../esl-traversing-query/README.md) selector):
- If the toggler contains `toggler-active`, the taget clamp element will be toggled to use `--esl-line-clamp-alt` CSS variable value and will dispatch `esl:clamp:toggle` custom event.
- If the target clamp contains the alt-active attribute (e.g., if it is already using an alternative value), the toggler will update its state accordingly.

### Usage

```html
<div esl-line-clamp="2" esl-line-clamp-alt="5">
  <!-- Long text content -->
</div>
<!-- An element with toggler mixin -->
<button esl-line-clamp-toggler="::prev">
  Toggle Lines
</button>
```
