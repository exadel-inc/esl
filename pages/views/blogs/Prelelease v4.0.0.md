---
layout: content
name: Pre 4.0.0 Highlights (Part 1)
title: Pre 4.0.0 Highlights (Part 1)
tags: [blogs, draft]
date: 2016-01-02
---

Привет ребят!
Как вы могли заметить уже начинают подключаться бета релизы ESL 4й версии.
Многие из фитч еще обкатываются и не все еще доступны.
Кроме того по итогу обязательно будут еще подробные релизноуты
(именно в формате статьи с юзкейсами и подробным описанием) прямо на [esl-ui.com](https://esl-ui.com/).
Но тем не менее хотелось бы уже сейчас кратко осветить то что уже стало доступно,
что можно пользовать, и какие еще аспекты библиотеки сейчас можно обновить
(сейчас с мажорным майлстоуном, как раз даже радикальные апдейты могут вполне оказаться одобрены и появиться в стабильной версии).

## 1. EventUtils: listeners
Да да, с этого релиза ESL обзавелась собственным механизмом для обработки событий.

### ⚡ 1.0 Low Level API

Теперь помимо `EventUtils.dispatch` доступны `EventUtils.subscribe` и `EventUtils.unsubscribe`

Механизм их работы следующий:
при помощи `EventUtils.subscribe` можно подписаться на событие
- `EventUtils.subscribe($host, 'click', handlerFn);` или
- `EventUtils.subscribe($host, {event: 'click', select: 'button'}, handlerFn);` или
- `EventUtils.subscribe($host, {event: 'scroll', target: window}, handlerFn);`
  а также множество других способов.

Подробное тех описание пока доступно в [исходниках](https://github.com/exadel-inc/esl/blob/main-beta/src/modules/esl-utils/dom/events/listener.ts)

Одно из основных преимуществ поверх нативного addEventListener - это расширенный контроль всех подписок.
Все ESL листенеры сохраняются и связываются с хост элементом,
после чего вы в любой момент можете отцепить слушателя самыми разными способами.
Притом для этого вам не обязательно иметь оригинал колбека хендлера.
- `EventUtils.unsubscribe($host);` отпишет все что привязано к $host
- `EventUtils.unsubscribe($host, handlerFn);` отпишет все что привязано к $host и обрабатывается handlerFn
- `EventUtils.unsubscribe($host, 'click');` отпишет все что привязано к $host и обрабатывает 'click'
- `EventUtils.unsubscribe($host, 'click', handlerFn);` отпишет все что привязано к $host, обрабатывает 'click' и обрабатывается handlerFn
- Критериев может быть любое количество.

Ну a теперь самое важное и приятное связанное с этой фитчей, все что я описал выше это только Low Level API.
Поверх заделано очень много сахара ...

### ⚡ 1.1 Extended ESLBaseElement
У всех наследников ESLBaseElement теперь есть методы `$$on` и `$$off`,
которые имеют все те же возможности но сами выставляют хостом текущий элемент.

```typescript
this.$$on('click', this.onClick);
this.$$off('click'); // или this.$$off(this.onClick)
```

### ⚡ 1.2 Auto-unbind
Все наследники ESLBaseElement отписываются от ивентов зааттаченных через ESL автоматически на disconnectedCallback.

Возможность быстрого отключения такого поведения обсуждается (feel free to share your thoughts with the ESL Team ;) ).

### ⚡ 1.3 Decorator `@listen`
В TS теперь доступен новый декоратор `@listen` который позволяет еще больше упростить работу с событиями

- Следующий листенер автоматически подпишется и отпишется при connected/desconnected колбеке
 ```typescript
 @listen('click')
 onClick(e) { ... }
 ```
- Доп опции также доступны
 ```typescript
 @listen({event: 'click', target: 'body', capture: true})
 onBodyClick(e) { ... }
 ```
- Вы можете управлять подпиской вручную, при этом связать всю или часть мета информации с самим хендлером
 ```typescript
 @listen({event: 'click', auto: false}) // не будет подписан автоматически
 onClick(e) { ... }

 myMethod() {
    this.$$on(this.onClick); // Ручная подписка
    this.$$on({target: 'body'}, this.onClick); // Ручная подписка c параметрами (мержатся)
    this.$$off(this.onClick); // как и в примерах выше

    EventUtils.subscribe($host, this.onClick); // Поддержка на уровне низкоуровневого API
 }
 ```

## Mixin Components

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


## 3. `esl-utils` breaking changes

Наведение красоты в `esl-utils` в процессе (и c этим связано большинство breaking changes).
Общая стратегия ESL команды - сделать немалый объем утилит максимально tree-shakeable.
Соответственно утилиты переписываются в функциональный вариант:   
`PromiseUtils.fromTimeout`(deprecated) -> `promisifyTimeout`
За редкими исключениями связанных механизмов, в особенности core (e.g. `EventUtils.dispatch/subscribe/unsubscribe`)

По итогу велика вероятность того что все что из ESL можно будет потребить
будет без последствий для сборки вплоть до такого варианта `import {someUtil} from '@exadel/esl';`

Однако последнее пожалуй пока не рекомендовано,
поскольку стратегия команды ESL такова что 5 версия уже будет дистрибьютаться отдельными npm пакетами:
```typescript
// Comming in the ESL 5.0.0
import {ESLBaseElement, someUtil} from '@esl/core';
import {ESLTogleable} from '@esl/togleables';
```

## 4 Наши планы

- bugfixing, bugfixing ну и обязательно другие мелкие дополнения по пунктам 1, 2;
- дополнения по ESLMediaQuery
  Мы решительно настроены сделать так чтоб 'core/helpers/breakpoints' ( привет HPE team ;) ) стал далее бесполезным
- 3 пункт (`esl-utils`)  - будут еще ретароменты и обновления API
- клятвенно не обещаем но велика вероятность esl-carousel компонента

## Пару слов в конце

Не стесняйтесь писать предложения дополнения, а самое главное тестировать и использовать новые фитчи.
Все они сейчас в режиме оперативной поддержки, поэтому любой найденный баг будет убран в максимально короткий срок
*Возможно даже свой проектный компонент дописать не успеете ;) , только не стесняйтесь делится фидбеком о том что заработало а что нет*

Всем спасибо и всегда велкам, [Core ESL Team](https://github.com/orgs/exadel-inc/teams/esl-core-team) ;)

