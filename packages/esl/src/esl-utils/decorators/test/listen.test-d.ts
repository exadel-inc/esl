import {listen} from '../listen.js';
import {ESLIntersectionTarget, ESLResizeObserverTarget, ESLSwipeGestureTarget, ESLWheelTarget} from '../../../esl-event-listener/core.js';

import type {DelegatedEvent} from '../../../esl-event-listener/core/types';
import type {ESLElementResizeEvent, ESLIntersectionEvent, ESLSwipeGestureEvent, ESLWheelEvent} from '../../../esl-event-listener/core.js';

class TestClass {
  // The listen definition works properly with a basic single DOM event ('click') name and exact event type ('MouseEvent') argument
  @listen('click')
  onClick(e: MouseEvent) {}

  // @ts-expect-error - A basic single DOM event listener must reject an incompatible event argument type
  @listen('click')
  onClickIncompatibleArgError(e: KeyboardEvent) {}

  // A basic single DOM event listener allows a generic Event argument type
  @listen('click')
  onClickGeneric(e: Event) {}

  // If the listener definition uses a selector, it allows a direct event argument matching the DOM event
  @listen({event: 'click', selector: '.test'})
  onClickSelector(e: MouseEvent) {}

  // If the listener definition uses a selector, it allows a DelegatedEvent wrapper of a compatible event type
  @listen({event: 'click', selector: '.test'})
  onClickSelectorDelegated(e: DelegatedEvent<MouseEvent>) {}

  // @ts-expect-error - Selector usage must reject a DelegatedEvent with an incompatible underlying event subtype
  @listen({event: 'click', selector: '.test'})
  onClickSelectorWrongDelegatedSubtypeError(e: DelegatedEvent<KeyboardEvent>) {}

  // Multiple space-separated DOM event names resolve to a union and accept a shared compatible MouseEvent argument
  @listen('click mouseover')
  onClickMouseover(e: MouseEvent) {}

  // @ts-expect-error - Multiple DOM event names reject an argument type incompatible with all resolved event types
  @listen('click mouseover')
  onClickMouseoverIncompatibleArgError(e: KeyboardEvent) {}

  // Correct object config with multiple events (same semantics as string form)
  @listen({event: 'click mouseover'})
  onClickMouseoverObjectConfig(e: MouseEvent) {}

  // Untrimmed event name string is normalized and accepted with a compatible MouseEvent argument
  @listen(' click ')
  onClickUntrimmed(e: MouseEvent) {}

  // @ts-expect-error - Untrimmed event name after normalization still rejects an incompatible argument type
  @listen(' click ')
  onClickUntrimmedIncompatibleArgError(e: KeyboardEvent) {}

  // Extra internal whitespace between events should be normalized
  @listen('  click   mouseover  ')
  onClickMouseoverExtraSpaces(e: MouseEvent) {}

  // @ts-expect-error - Extra internal whitespace between events should be normalized (error case)
  @listen('  click   mouseover  ')
  onClickMouseoverExtraSpacesError(e: TouchEvent) {}

  // Intersection observer target specific event name maps correctly to ESLIntersectionEvent argument
  @listen({event: 'intersects', target: ESLIntersectionTarget.for})
  onIntersects(e: ESLIntersectionEvent) {}

  // Multiple intersection-specific event names share the same ESLIntersectionEvent argument type
  @listen({event: 'intersects:in intersects:out', target: ESLIntersectionTarget.for})
  onIntersectsMulti(e: ESLIntersectionEvent) {}

  // @ts-expect-error - Intersection target event rejects an unrelated DOM event argument type
  @listen({event: 'intersects', target: ESLIntersectionTarget.for})
  onIntersectsIncompatibleArgError(e: MouseEvent) {}

  // @ts-expect-error - Non-intersection event name is invalid when used with intersection target
  @listen({event: 'click', target: ESLIntersectionTarget.for})
  onIntersectsWrongEventNameError(e: Event) {}

  // Resize observer target event name maps to the specific ESLElementResizeEvent argument type
  @listen({event: 'resize', target: ESLResizeObserverTarget.for})
  onResize(e: ESLElementResizeEvent) {}

  // Resize observer target event accepts a more generic UIEvent argument type
  @listen({event: 'resize', target: ESLResizeObserverTarget.for})
  onResizeGeneric(e: UIEvent) {}

  // @ts-expect-error - Resize observer event rejects an unrelated custom event type
  @listen({event: 'resize', target: ESLResizeObserverTarget.for})
  onResizeIncompatibleArgError(e: ESLIntersectionEvent) {}

  // @ts-expect-error - Wrong event name for resize observer target is rejected
  @listen({event: 'click', target: ESLResizeObserverTarget.for})
  onResizeWrongEventNameError(e: Event) {}

  // Wheel target custom event name maps correctly to ESLWheelEvent argument
  @listen({event: 'longwheel', target: ESLWheelTarget.for})
  onLongwheel(e: ESLWheelEvent) {}

  // @ts-expect-error - Wrong DOM event name used with wheel target custom event expectation is rejected
  @listen({event: 'click', target: ESLWheelTarget.for})
  onLongwheelWrongEventNameError(e: MouseEvent) {}

  // Swipe gesture target custom event maps correctly to ESLSwipeGestureEvent argument
  @listen({event: 'swipe', target: ESLSwipeGestureTarget.for})
  onSwipe(e: ESLSwipeGestureEvent) {}

  // @ts-expect-error - Wrong DOM event name used with swipe gesture target is rejected
  @listen({event: 'click', target: ESLSwipeGestureTarget.for})
  onSwipeWrongEventNameError(e: MouseEvent) {}

  // @ts-expect-error - Invalid event name for resize observer target (event split case)
  @listen({event: 'resize:other', target: ESLResizeObserverTarget.for})
  onResizeWrongSimilarEventNameError(e: ESLElementResizeEvent) {}

  // @ts-expect-error - Invalid event name for wheel target (event split case)
  @listen({event: 'mouseover mouseout', target: ESLSwipeGestureTarget.for})
  onMultiEvent(e: Event) {}
}
