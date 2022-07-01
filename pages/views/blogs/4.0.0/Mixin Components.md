---
layout: content
name: ESL Mixin Components (ESL 4.0.0)
title: ESL Mixin Components (ESL 4.0.0)
tags: [blogs, draft]
date: 2021-07-01
---

До сего момента мы могли связывать кастомные элементы ESL только с кастомным тегом.
А что если я скажу что теперь кастомный ESL элемент может быть связан с атрибутом?
В 4 версии стали доступны Mixin Components - еще одна огромная фитча 4го релиза.

Теперь доступен новый вид базового компонента с максимально близким API, но цепляющийся к атрибуту
```typescript
class MyMixin extends ESLMixinComponent {
   static is = 'my-attr';
   
   @attr public otherAttr: string;
   
   connectedCallback() { ... }
   disconnectedCallback() { ... }
   
   @listen('click')
   onClick() { ... }
}
MyMixin.register();
```

Теперь
```html 
<div my-attr></div>
<my-custom-el my-attr> Может и сосуществовать с другими элементами и миксинами </my-custom-el>
```
будут автоматически, как и нативные кастомные теги, контролировать свой жизненный цикл и связывать его
с зареганной MyMixin имплементацией
