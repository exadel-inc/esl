---
layout: content
name: ESL Event Listeners (ESL 4.0.0)
title: ESL Event Listeners (ESL 4.0.0)
tags: [blogs, draft]
date: 2021-07-01
---

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
