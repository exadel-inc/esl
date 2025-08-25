/* eslint-disable @typescript-eslint/explicit-function-return-type */
import {listen} from '../listen.js';
import {ESLIntersectionTarget, ESLResizeObserverTarget, ESLSwipeGestureTarget, ESLWheelTarget} from '../../../esl-event-listener/core.js';

import type {DelegatedEvent} from '../../../esl-event-listener/core/types';
import type {ESLElementResizeEvent, ESLIntersectionEvent, ESLSwipeGestureEvent, ESLWheelEvent} from '../../../esl-event-listener/core.js';

class TestClass {
  // The definitions are compatible with the event name
  @listen('click')
  onEvent(e: MouseEvent) {}

  // @ts-expect-error - event argument should be compatible with the event name
  @listen('click')
  onEvent2(e: KeyboardEvent) {}

  // The declarations should allow more generic event argument
  @listen('click')
  onEvent3(e: Event) {}

  // If the listener definition uses selector, definition allows simple event
  @listen({event: 'click', selector: '.test'})
  onEvent4(e: MouseEvent) {}

  // If the listener definition uses selector, definition allows delegated event
  @listen({event: 'click', selector: '.test'})
  onEvent5(e: DelegatedEvent<MouseEvent>) {}

  // @ts-expect-error - If the listener definition uses selector, definition should not allow incompatible event subtype
  @listen({event: 'click', selector: '.test'})
  onEvent6(e: DelegatedEvent<KeyboardEvent>) {}

  // Event name definition supports multiple events
  @listen('click mouseover')
  onEvent7(e: MouseEvent) {}

  // @ts-expect-error - event argument should be compatible with the event name
  @listen('click mouseover')
  onEvent8(e: KeyboardEvent) {}

  // Event definition can be un-trimmed
  @listen(' click ')
  onEvent9(e: MouseEvent) {}

  // @ts-expect-error - un-trimmed event definition should not allow incompatible event subtype
  @listen(' click ')
  onEvent10(e: KeyboardEvent) {}

  // Event name definition is correct for the intersection target
  @listen({event: 'intersects', target: ESLIntersectionTarget.for})
  onIntersectionEvent1(e: ESLIntersectionEvent) {}

  // Event name definition with multiple events is accepted for the intersection target
  @listen({event: 'intersects:in intersects:out', target: ESLIntersectionTarget.for})
  onIntersectionEvent2(e: Event) {}

  // @ts-expect-error - event argument should be compatible with the intersection event name
  @listen({event: 'intersects', target: ESLIntersectionTarget.for})
  onIntersectionEvent3(e: MouseEvent) {}

  // @ts-expect-error - event name definition should be compatible with the intersection target
  @listen({event: 'click', target: ESLIntersectionTarget.for})
  onIntersectionEvent4(e: Event) {}

  // Event name definition is correct for the resize target
  @listen({event: 'resize', target: ESLResizeObserverTarget.for})
  onResizeEvent1(e: ESLElementResizeEvent) {}

  // Event name definition is correct for the resize target
  @listen({event: 'resize', target: ESLResizeObserverTarget.for})
  onResizeEvent2(e: UIEvent) {}

  // @ts-expect-error - event argument should be compatible with the resize event name
  @listen({event: 'resize', target: ESLResizeObserverTarget.for})
  onResizeEvent3(e: ESLIntersectionEvent) {}

  // @ts-expect-error - event name definition should be compatible with the resize target
  @listen({event: 'click', target: ESLResizeObserverTarget.for})
  onResizeEvent4(e: Event) {}

  // Event name definition is correct for the longwheel target
  @listen({event: 'longwheel', target: ESLWheelTarget.for})
  onWheelEvent1(e: ESLWheelEvent) {}

  // @ts-expect-error - event argument should be compatible with the longwheel event name
  @listen({event: 'click', target: ESLWheelTarget.for})
  onWheelEvent2(e: MouseEvent) {}

  // Event name definition is correct for the swipe target
  @listen({event: 'swipe', target: ESLSwipeGestureTarget.for})
  onSwipeEvent1(e: ESLSwipeGestureEvent) {}

  // @ts-expect-error - event argument should be compatible with the swipe event name
  @listen({event: 'click', target: ESLSwipeGestureTarget.for})
  onSwipeEvent2(e: MouseEvent) {}
}
