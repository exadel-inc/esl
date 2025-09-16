import {ESLEventUtils, ESLIntersectionTarget, ESLResizeObserverTarget, ESLSwipeGestureTarget, ESLWheelTarget} from '../core.js';
import type {DelegatedEvent, ESLIntersectionEvent, ESLElementResizeEvent, ESLSwipeGestureEvent, ESLWheelEvent} from '../core.js';

// Host object placeholder for subscription context
const host: object = {};

// ======= Event compatibility =========

// Basic single DOM event subscription accepts exact MouseEvent
ESLEventUtils.subscribe(host, 'click', (e: MouseEvent) => {});

// @ts-expect-error - Basic single DOM event subscription rejects incompatible handler argument type
ESLEventUtils.subscribe(host, 'click', (e: KeyboardEvent) => {});

// Basic single DOM event subscription accepts generic Event
ESLEventUtils.subscribe(host, 'click', (e: Event) => {});

// Multiple DOM events (space separated) accept shared MouseEvent argument
ESLEventUtils.subscribe(host, 'click mouseover', (e: MouseEvent) => {});

// @ts-expect-error - Multiple DOM events reject incompatible handler argument type
ESLEventUtils.subscribe(host, 'click mouseover', (e: KeyboardEvent) => {});

// Multiple DOM events accept generic Event
ESLEventUtils.subscribe(host, 'click mouseover', (e: Event) => {});

// Untrimmed single event accepted after normalization
ESLEventUtils.subscribe(host, ' click ', (e: MouseEvent) => {});

// @ts-expect-error - Untrimmed single event still rejects incompatible handler argument type
ESLEventUtils.subscribe(host, ' click ', (e: KeyboardEvent) => {});

// Descriptor form with single DOM event
ESLEventUtils.subscribe(host, {event: 'click'}, (e: MouseEvent) => {});

// @ts-expect-error - Descriptor single DOM event rejects incompatible handler argument type
ESLEventUtils.subscribe(host, {event: 'click'}, (e: KeyboardEvent) => {});

// Descriptor form with multiple events
ESLEventUtils.subscribe(host, {event: 'click mouseover'}, (e: MouseEvent) => {});

// @ts-expect-error - Descriptor multiple events rejects incompatible handler argument type
ESLEventUtils.subscribe(host, {event: 'click mouseover'}, (e: KeyboardEvent) => {});

// Selector descriptor allows direct MouseEvent argument
ESLEventUtils.subscribe(host, {event: 'click', selector: '.test'}, (e: MouseEvent) => {});

// Selector descriptor allows DelegatedEvent wrapper
ESLEventUtils.subscribe(host, {event: 'click', selector: '.test'}, (e: DelegatedEvent<MouseEvent>) => {});

// @ts-expect-error - Selector descriptor rejects DelegatedEvent with incompatible subtype
ESLEventUtils.subscribe(host, {event: 'click', selector: '.test'}, (e: DelegatedEvent<KeyboardEvent>) => {});

// Intersection target event subscription
ESLEventUtils.subscribe(host, {event: 'intersects', target: ESLIntersectionTarget.for}, (e: ESLIntersectionEvent) => {});

// Intersection target multiple events
ESLEventUtils.subscribe(host, {event: 'intersects:in intersects:out', target: ESLIntersectionTarget.for}, (e: ESLIntersectionEvent) => {});

// @ts-expect-error - Intersection target event rejects unrelated handler argument type
ESLEventUtils.subscribe(host, {event: 'intersects', target: ESLIntersectionTarget.for}, (e: MouseEvent) => {});

// @ts-expect-error - Wrong event name for intersection target is rejected
ESLEventUtils.subscribe(host, {event: 'click', target: ESLIntersectionTarget.for}, (e: Event) => {});

// Resize observer target event (specific type)
ESLEventUtils.subscribe(host, {event: 'resize', target: ESLResizeObserverTarget.for}, (e: ESLElementResizeEvent) => {});

// Resize observer target event accepts generic UIEvent
ESLEventUtils.subscribe(host, {event: 'resize', target: ESLResizeObserverTarget.for}, (e: UIEvent) => {});

// @ts-expect-error - Resize observer event rejects unrelated handler argument type
ESLEventUtils.subscribe(host, {event: 'resize', target: ESLResizeObserverTarget.for}, (e: ESLIntersectionEvent) => {});

// @ts-expect-error - Wrong event name for resize observer target is rejected
ESLEventUtils.subscribe(host, {event: 'click', target: ESLResizeObserverTarget.for}, (e: Event) => {});

// Wheel target custom event
ESLEventUtils.subscribe(host, {event: 'longwheel', target: ESLWheelTarget.for}, (e: ESLWheelEvent) => {});

// @ts-expect-error - Wrong event name for wheel target custom event is rejected
ESLEventUtils.subscribe(host, {event: 'click', target: ESLWheelTarget.for}, (e: MouseEvent) => {});

// Swipe gesture target custom event
ESLEventUtils.subscribe(host, {event: 'swipe', target: ESLSwipeGestureTarget.for}, (e: ESLSwipeGestureEvent) => {});

// @ts-expect-error - Wrong event name for swipe gesture target is rejected
ESLEventUtils.subscribe(host, {event: 'click', target: ESLSwipeGestureTarget.for}, (e: MouseEvent) => {});

// Generic Event param accepted for intersection target
ESLEventUtils.subscribe(host, {event: 'intersects', target: ESLIntersectionTarget.for}, (e: Event) => {});

// Generic Event param accepted for wheel custom event
ESLEventUtils.subscribe(host, {event: 'longwheel', target: ESLWheelTarget.for}, (e: Event) => {});

// @ts-expect-error - Invalid extended resize event name rejected
ESLEventUtils.subscribe(host, {event: 'resize:other', target: ESLResizeObserverTarget.for}, (e: ESLElementResizeEvent) => {});

// ======== Criteria filtering ==========
const host2 = {
  onEvent() {},
};

// Criteria accepts string - subscribe all click event handlers from host
ESLEventUtils.subscribe(host, 'click');

// Criteria accepts full Descriptor - subscribe all click event handlers from host
ESLEventUtils.subscribe(host, {event: 'click'});

// Criteria accepts partial Descriptor - subscribe all handlers with 'some' group from host
ESLEventUtils.subscribe(host, {group: 'some'});

// Criteria accepts handler function (expected to be decorated as ESLListenerDescriptorFn) - subscribe specific handler from host2
ESLEventUtils.subscribe(host, host2.onEvent);
