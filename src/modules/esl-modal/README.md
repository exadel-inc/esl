# [ESL](../../../) Modal

Version: *1.0.0-beta*.

Authors: *Anastasiya Lesun*.

<a name="intro"></a>

**ESLModal** - a custom element based on `ESLToggleable` instance. 

`ESLModal` opens in overlay on top of the main content when `esl:show` DOM event is dispatched on the appropriate modal item. 
By default, modal window before its opening is moved to the `document.body` (determined by `body-inject` attribute) and blocks all other workflows on the main page until modal is closed (supports 'none' | 'native' | 'pseudo' locks using `scroll-lock-strategy` attribute).
Modal opening can be taken up together with backdrop appearance (depends on `no-backdrop` attribute).

### ESLModal Attributes | Properties:
- `no-backdrop` (boolean) - disable modal backdrop
- `body-inject` (boolean) - provide element movement to body before its opening
- `scroll-lock-strategy` ('none' | 'native' | 'pseudo') - define scroll lock type 

### Example
```html
<body>
  <main>
    ...
    <esl-trigger target="::find(#modal-1)"></esl-trigger>
    <esl-modal id="modal-1" body-inject></esl-modal>
    ...
  </main>
</body>
```
