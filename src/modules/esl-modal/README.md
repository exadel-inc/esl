# [ESL](../../../) Modal

Version: *1.0.0-beta*.

Authors: *Anastasiya Lesun*, *Alexey Stsefanovich (ala'n)*.

<a name="intro"></a>

**ESLModal** - a custom element based on `ESLToggleable` instance. 

`ESLModal` is a special window with additional content that opens in overlay on top of the main content when `esl:show` DOM event is dispatched on the appropriate modal item. 
By default, modal window before its opening is moved to the `document.body` (determined by `inject-to-body` attribute) and leaves an `ESLPopupPlaceholder` element in its place. 
The process is followed by blocking all other workflows on the main page until `esl:hide` DOM event will be dispatched and modal will be closed 
(supports 'background' |'none' | 'native' | 'pseudo' locks using `scroll-lock-strategy` attribute, background option is preferable).
Modal opening is taken up by default by backdrop appearance and this functionality can be disabled with usage of `no-backdrop` attribute. 
The component provides 2 possible types of smooth animation (defined by `animation-class`): fade with `esl-modal-fade` class (used by default) and zoom with `esl-modal-zoom`.
Duration of animation can be changed by rewriting of `--esl-modal-animation-time` variable.

`ESLModal` also supports nested modals, parent-child relationship between these modals (managed by `ESLModalStack`) and handles accessibility issues, close and return operations.
 Closing a child modal should return the user to the parent modal, and closing the parent modal should return the user to the main content or close the entire modal stack.


### ESLModal Attributes | Properties:
- `no-backdrop` (boolean) - disable modal backdrop
- `inject-to-body` (boolean) - provide element movement to body before its opening
- `scroll-lock-strategy` ('background' | 'none' | 'native' | 'pseudo') - define scroll lock type 
- `animation-class` ('esl-modal-fade' | 'esl-modal-zoom') define the animation type
- `data-modal-close` - marker for inner element to close modal

### Events
- `stack:update` - thrown when stack of modal just changed (modal was opened or closed)

### Example
```html
<body>
  <main>
    <esl-trigger target="::find(#modal-1)"></esl-trigger>
    <esl-modal id="modal-1" inject-to-body animation-class="esl-modal-fade">
        ...Modal Content...
        <button data-modal-close><button/>
    </esl-modal>
  </main>
</body>
```
