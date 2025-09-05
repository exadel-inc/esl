import {ESLMixinElement} from '../ui/esl-mixin-element';
import {ESLIntersectionTarget} from '../../esl-event-listener/core/targets/intersection.target';

import type {DelegatedEvent} from '../../esl-event-listener/core/types';
import type {ESLIntersectionEvent} from '../../esl-event-listener/core/targets/intersection.event';

class ElementListenerTestD extends ESLMixinElement {
  onEvent() {}
  onMouseEvent(e: MouseEvent) {}
  onKeyboardEvent(e: KeyboardEvent) {}
  onIntersectionEvent(e: ESLIntersectionEvent) {}
  onGenericEvent(e: Event) {}
  onDelegatedMouseEvent(e: DelegatedEvent<MouseEvent>) {}
  onDelegatedKeyboardEvent(e: DelegatedEvent<KeyboardEvent>) {}

  test() {
    // Allows subscribing to events via method reference
    this.$$on(this.onEvent);
    // Allows descriptor shorthand
    this.$$on('click', this.onMouseEvent);
    this.$$on('keydown', this.onKeyboardEvent);

    // Allows subscribing by criteria object
    this.$$on('click');
    this.$$on({event: 'click'});
    this.$$on({group: 'test-group'});

    // Allows subscribing to events via descriptor + method reference
    this.$$on({event: 'click'}, this.onMouseEvent);
    this.$$on({event: 'keydown'}, this.onKeyboardEvent);
    this.$$on({event: 'scroll'}, this.onGenericEvent);
    this.$$on({event: 'click', selector: '.btn'}, this.onDelegatedMouseEvent);

    // @ts-expect-error - disallow incomplete descriptor
    this.$$on({event: 'keyup'}, this.onMouseEvent);
    // @ts-expect-error - disallow incompatible event type
    this.$$on({event: 'click'}, this.onKeyboardEvent);
    // @ts-expect-error - disallow incompatible delegated event type
    this.$$on({event: 'click', selector: '.btn'}, this.onDelegatedKeyboardEvent);

    // Limited target types
    this.$$on({event: 'intersects', target: ESLIntersectionTarget.for}, this.onIntersectionEvent);

    // @ts-expect-error - disallow incompatible target type
    this.$$on({event: 'intersection', target: ESLIntersectionTarget.for}, this.onIntersectionEvent);

    // @ts-expect-error - disallow incompatible event type
    this.$$on({event: 'intersects', target: ESLIntersectionTarget.for}, this.onMouseEvent);

    // Allow multiple event types
    this.$$on('click mouseover', this.onMouseEvent);

    // @ts-expect-error - disallow incompatible event type in multiple types
    this.$$on({event: 'click mouseover', target: ESLIntersectionTarget.for}, this.onEvent);

    // Allow correct multi-event type for the target
    this.$$on({event: 'intersects:in intersects:out', target: ESLIntersectionTarget.for}, this.onEvent);
  }
}
