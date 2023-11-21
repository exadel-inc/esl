# [ESL](../../../) Modal

Version: *1.0.0-beta*.

Authors: *Anastasiya Lesun*, *Alexey Stsefanovich (ala'n)*.

<a name="intro"></a>

**ESLModal** - a custom element based on `ESLToggleable` instance. 

`ESLModal` opens in overlay on top of the main content when `esl:show` DOM event is dispatched on the appropriate modal item. 
By default, modal window before its opening is moved to the `document.body` (determined by `inject-to-body` attribute) and blocks all other workflows on the main page until modal is closed (supports 'background' |'none' | 'native' | 'pseudo' locks using `scroll-lock-strategy` attribute).
Modal opening can be taken up together with backdrop appearance (depends on `no-backdrop` attribute). Also is accessible 2 animation of show/hide modal: fade (by default) and zoom when start and finish point of modal is window center (`animation-class=esl-modal-zoom`).

### ESLModal Attributes | Properties:
- `no-backdrop` (boolean) - disable modal backdrop
- `inject-to-body` (boolean) - provide element movement to body before its opening
- `scroll-lock-strategy` ('background' | 'none' | 'native' | 'pseudo') - define scroll lock type 
- `animation-class` ('esl-modal-fade' | 'esl-modal-zoom') define the animation type

### Example
```html
<body>
  <main>
    ...
    <esl-trigger target="::find(#modal-1)"></esl-trigger>
    <esl-modal id="modal-1" inject-to-body></esl-modal>
    ...
  </main>
</body>
```
