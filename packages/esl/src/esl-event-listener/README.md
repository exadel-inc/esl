# ESL Event Listener module

Version: _2.1.0_.

Authors: _Alexey Stsefanovich (ala'n)_.

<a name="intro"></a>

Starting from the 4th release ESL has a built-in mechanism to work with DOM events.
ESL event listeners have more control and advanced features than native DOM API.
Besides, the [`ESLBaseElement`](../esl-base-element/README.md) and the [`ESLMixinElement`](../esl-mixin-element/README.md)
have even more pre-built syntax sugar to make the consumer's code briefer.

One of the main advantages of ESL listeners is the extended control of subscriptions.
All ESL listeners and their declarations are saved and associated with the host element.
It means that ESL listeners can be subscribed or unsubscribed at any time in various ways.
And most importantly, you do not need the original callback handler to do this.

---

Navigation:
1. [Overview](./docs/1-overview.md)
2. [Public API, `ESLEventUtils`](./docs/2-public-api.md)
3. [Extended `EventTarget`s and standard optimizations](./docs/3-extended-targets.md)
4. [Embedded behavior of `ESLBaseElement` / `ESLMixinElement`](./docs/4-core-support.md)
