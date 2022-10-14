# [ESL](../../../) Related Target Mixin

Version: *1.0.0*

Authors: *Anastasiya Lesun, Alexey Stsefanovich (ala'n)*.

<a name="intro"></a>

**ESLRelatedTarget** is a custom mixin that can be used with `ESLToggleable` instance to link with another ESLToggleable element and manage its state.

Mixin attaches to the element via `esl-related-target` attribute that defines selector to find corresponding element.
Activation (set open state) or deactivation of related target handles through `esl:show` and `esl:hide` custom events listening.
