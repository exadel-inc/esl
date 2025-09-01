import {listen} from '../listen.js';
import type {DelegatedEvent} from '../../../esl-event-listener/core/types';

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
}
