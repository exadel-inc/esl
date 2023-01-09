# [ESL](../../../) Related Target Mixin

Version: *1.0.0*

Authors: *Anastasiya Lesun, Alexey Stsefanovich (ala'n)*.

<a name="intro"></a>

**ESLRelatedTarget** is a custom mixin that can be used in combination with `ESLToggleable` (or based on it) instance to link it with one or more another `ESLToggleable` to sync their states.

Mixin attaches to the element via the `esl-related-target` attribute. The attribute's value defines a selector to find the corresponding element.
Activation (set open state) or deactivation of the related target happens when the corresponding `esl:show` and `esl:hide` DOM events are dispatched on the current host element.

Mixin has also `esl-related-target-action` to synchronize between toggleables with the following types `'all'(default) | 'show' | 'hide'`. That allows to show or hide related elements by appropriate action.
