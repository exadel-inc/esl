# [ESL](../../../) Related Target Mixin

Version: *1.1.0*

Authors: *Anastasiya Lesun, Natalia Smirnova, Alexey Stsefanovich (ala'n)*.

<a name="intro"></a>

**ESLRelatedTarget** is a custom mixin that can be used in combination with `ESLToggleable` instance (or any inheritor)
to link it with one or more other `ESLToggleable` to sync their states.

Mixin attaches to the element via the `esl-related-target` attribute. 
The attribute's value defines a selector to find the corresponding element.
Activation (set open state) or deactivation of the related target happens when the corresponding `esl:show` or 
`esl:hide` DOM events are dispatched on the current host element.

Mixin supports `esl-related-target-action` attribute to define required for synchronization actions:
 - `all` (default) - to synchronize both: show and hide events of the observed toggleable
 - `hide` - to synchronize only hide events of the observed toggleable
 - `show` - to synchronize only show events of the observed toggleable

To make cross-reference (bidirectional binding) of toggleables you need to cross-reference both of the toggleables:
```html
<esl-toggleable class="first" esl-related-target=".second"></esl-toggleable>
<esl-toggleable class="second" esl-related-target=".first"></esl-toggleable>
```
