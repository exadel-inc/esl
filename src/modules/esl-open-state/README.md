# [ESL](../../../) Open State Mixin

Version: *1.0.0*

Authors: *Yuliya Adamskaya, Alexey Stsefanovich (ala'n)*.

<a name="intro"></a>

**ESLOpenState** is a custom mixin that can be used in combination with `ESLToggleable` instance (or any inheritor)
to request opening/closing it by the media query condition.

Mixin attaches to the element via `esl-open-state` attribute.
The attribute's value defines media query condition to define when `ESLToggleable` element should be open.

```html
<esl-toggleable esl-open-state="@+MD"></esl-toggleable>
```
