import {listen} from '../listen.js';
import {ESLIntersectionTarget, ESLResizeObserverTarget, ESLSwipeGestureTarget, ESLWheelTarget} from '../../../esl-event-listener/core.js';
import {ESLMediaQuery} from '../../../esl-media-query/core.js';
import {SyntheticEventTarget} from '../../../esl-utils/dom/events/target.js';

import type {ESLMediaChangeEvent} from '../../../esl-media-query/core.js';
import type {DelegatedEvent, ESLListenerHandler} from '../../../esl-event-listener/core/types';
import type {ESLElementResizeEvent, ESLIntersectionEvent, ESLSwipeGestureEvent, ESLWheelEvent} from '../../../esl-event-listener/core.js';

// Helper type: expected shape of a @listen decorator typed to a specific event
type ExpectedListenDecorator<E extends Event> = <Handler extends ESLListenerHandler<E>>(
  target: any,
  property: string,
  descriptor: TypedPropertyDescriptor<Handler>
) => void;

// Helper type: checks strict bidirectional assignability (true only if A and B are the same type)
type IsExact<A, B> =
  (<T>() => T extends A ? 1 : 2) extends (<T>() => T extends B ? 1 : 2)
    ? ((<T>() => T extends B ? 1 : 2) extends (<T>() => T extends A ? 1 : 2) ? true : false)
    : false;

// Helper type: compile-time assertion — fails if T is not `true`
type Assert<T extends true> = T;

// Stub host types used as the `this` context in provider functions
type ProviderHost = {media: ESLMediaQuery};
type DOMProviderHost = {target: Window};
type ResizeProviderHost = {target: ESLResizeObserverTarget};
type IntersectionProviderHost = {target: ESLIntersectionTarget};
type WheelProviderHost = {target: ESLWheelTarget};
type SwipeProviderHost = {target: ESLSwipeGestureTarget};
type SyntheticProviderHost = {target: SyntheticEventTarget};

// Plain string event name — resolves to the matching DOM event type (PointerEvent)
const clickDecorator = listen('click');
type _ClickDecorator = Assert<IsExact<typeof clickDecorator, ExpectedListenDecorator<PointerEvent>>>;

// Provider function returning a string event name — same resolution as the plain-string form
const clickProviderDecorator = listen(() => 'click' as const);
type _ClickProviderDecorator = Assert<IsExact<typeof clickProviderDecorator, ExpectedListenDecorator<PointerEvent>>>;

// Space-separated event list — resolves to a union of the corresponding event types
const multiEventDecorator = listen('click mouseover');
type _MultiEventDecorator = Assert<IsExact<typeof multiEventDecorator, ExpectedListenDecorator<PointerEvent | MouseEvent>>>;

// Delegated event with CSS selector — handler receives DelegatedEvent wrapping the base type
const selectorDecorator = listen({event: 'click', selector: '.test'});
type _SelectorDecorator = Assert<IsExact<typeof selectorDecorator, ExpectedListenDecorator<DelegatedEvent<PointerEvent> | PointerEvent>>>;

// Plain DOM event without a specific target — falls back to the generic Event type
const domChangeDecorator = listen({event: 'change'});
type _DomChangeDecorator = Assert<IsExact<typeof domChangeDecorator, ExpectedListenDecorator<Event>>>;

// Static Window target — event type resolved from WindowEventMap
const windowChangeDecorator = listen({event: 'change', target: window});
type _WindowChangeDecorator = Assert<IsExact<typeof windowChangeDecorator, ExpectedListenDecorator<Event>>>;

// Provider function returning a DOM target — event type resolved from the returned target's event map
const domProviderDecorator = listen({event: 'change', target: (host: DOMProviderHost) => host.target});
type _DOMProviderDecorator = Assert<IsExact<typeof domProviderDecorator, ExpectedListenDecorator<Event>>>;

// Static ESLMediaQuery target — resolves to the ESL-specific ESLMediaChangeEvent
const mediaChangeDecorator = listen({event: 'change', target: ESLMediaQuery.for('@+MD')});
type _MediaChangeDecorator = Assert<IsExact<typeof mediaChangeDecorator, ExpectedListenDecorator<ESLMediaChangeEvent>>>;

// Provider function returning ESLMediaQuery — same event resolution as the static form
const mediaChangeProviderDecorator = listen({event: 'change', target: (host: ProviderHost) => host.media});
type _MediaChangeProviderDecorator = Assert<IsExact<typeof mediaChangeProviderDecorator, ExpectedListenDecorator<ESLMediaChangeEvent>>>;

// Static ESLResizeObserverTarget — resolves to ESLElementResizeEvent
const resizeDecorator = listen({event: 'resize', target: ESLResizeObserverTarget.for(document.body)});
type _ResizeDecorator = Assert<IsExact<typeof resizeDecorator, ExpectedListenDecorator<ESLElementResizeEvent>>>;

// Provider function returning ESLResizeObserverTarget — same resolution as the static form
const resizeProviderDecorator = listen({event: 'resize', target: (host: ResizeProviderHost) => host.target});
type _ResizeProviderDecorator = Assert<IsExact<typeof resizeProviderDecorator, ExpectedListenDecorator<ESLElementResizeEvent>>>;

// Static ESLIntersectionTarget — resolves to ESLIntersectionEvent
const intersectionDecorator = listen({event: 'intersects', target: ESLIntersectionTarget.for(document.body)});
type _IntersectionDecorator = Assert<IsExact<typeof intersectionDecorator, ExpectedListenDecorator<ESLIntersectionEvent>>>;

// Provider function returning ESLIntersectionTarget — same resolution as the static form
const intersectionProviderDecorator = listen({event: 'intersects', target: (host: IntersectionProviderHost) => host.target});
type _IntersectionProviderDecorator = Assert<IsExact<typeof intersectionProviderDecorator, ExpectedListenDecorator<ESLIntersectionEvent>>>;

// Static ESLWheelTarget — resolves to ESLWheelEvent
const wheelDecorator = listen({event: 'longwheel', target: ESLWheelTarget.for(document.body)});
type _WheelDecorator = Assert<IsExact<typeof wheelDecorator, ExpectedListenDecorator<ESLWheelEvent>>>;

// Provider function returning ESLWheelTarget — same resolution as the static form
const wheelProviderDecorator = listen({event: 'longwheel', target: (host: WheelProviderHost) => host.target});
type _WheelProviderDecorator = Assert<IsExact<typeof wheelProviderDecorator, ExpectedListenDecorator<ESLWheelEvent>>>;

// Static ESLSwipeGestureTarget — resolves to ESLSwipeGestureEvent
const swipeDecorator = listen({event: 'swipe', target: ESLSwipeGestureTarget.for(document.body)});
type _SwipeDecorator = Assert<IsExact<typeof swipeDecorator, ExpectedListenDecorator<ESLSwipeGestureEvent>>>;

// Provider function returning ESLSwipeGestureTarget — same resolution as the static form
const swipeProviderDecorator = listen({event: 'swipe', target: (host: SwipeProviderHost) => host.target});
type _SwipeProviderDecorator = Assert<IsExact<typeof swipeProviderDecorator, ExpectedListenDecorator<ESLSwipeGestureEvent>>>;

// Static SyntheticEventTarget with an unknown event name — falls back to the generic Event type
const syntheticDecorator = listen({event: 'abc', target: new SyntheticEventTarget()});
type _SyntheticDecorator = Assert<IsExact<typeof syntheticDecorator, ExpectedListenDecorator<Event>>>;

// Provider function returning SyntheticEventTarget — same fallback to generic Event
const syntheticProviderDecorator = listen({event: 'abc', target: (host: SyntheticProviderHost) => host.target});
type _SyntheticProviderDecorator = Assert<IsExact<typeof syntheticProviderDecorator, ExpectedListenDecorator<Event>>>;

// @ts-expect-error - Invalid media query event name for direct target
listen({event: 'click', target: ESLMediaQuery.for('@+MD')});

// @ts-expect-error - Invalid media query event name for provider target
listen({event: 'click', target: (host: ProviderHost) => host.media});

// @ts-expect-error - Invalid resize observer event name for direct target
listen({event: 'click', target: ESLResizeObserverTarget.for(document.body)});

// @ts-expect-error - Invalid resize observer event name for provider target
listen({event: 'click', target: (host: ResizeProviderHost) => host.target});

// @ts-expect-error - Invalid intersection event name for direct target
listen({event: 'click', target: ESLIntersectionTarget.for(document.body)});

// @ts-expect-error - Invalid intersection event name for provider target
listen({event: 'click', target: (host: IntersectionProviderHost) => host.target});

// @ts-expect-error - Invalid wheel event name for direct target
listen({event: 'click', target: ESLWheelTarget.for(document.body)});

// @ts-expect-error - Invalid wheel event name for provider target
listen({event: 'click', target: (host: WheelProviderHost) => host.target});

// @ts-expect-error - Invalid swipe event name for direct target
listen({event: 'click', target: ESLSwipeGestureTarget.for(document.body)});

// @ts-expect-error - Invalid swipe event name for provider target
listen({event: 'click', target: (host: SwipeProviderHost) => host.target});
