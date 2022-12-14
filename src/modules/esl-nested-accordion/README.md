# [ESL](../../../) Nested Accordion Mixin

Version: *1.0.0*

Authors: *Anastasia Lesun, Natalia Smirnova*.

<a name="intro"></a>

**ESLNestedAccordion** is a custom mixin for `ESLPanel` instance to hide its `ESLPanel` children.

Mixin attaches to the element via the `esl-nested-accordion` attribute.
Nested `ESLPanel` instances are closing when `esl:hide` DOM event is dispatched on the current host element.
