# [ESL](../../../) Line Clamp Mixin

Version: *1.0.0*

Authors: *Dmytro Shovchko*.

<a name="intro"></a>

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

