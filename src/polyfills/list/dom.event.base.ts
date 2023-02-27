/**
 * Group: DOM API shims
 * Target Browsers: `IE11`, `Edge < 18`
 * Event constructor & prevent default polyfill
 */
try {
  new window.Event('event', {bubbles: true, cancelable: true});
} catch (error) {
  const EventOriginal = window.CustomEvent || window.Event;
  const preventDefaultOriginal = EventOriginal.prototype.preventDefault;
  const Event = function (eventName: string, params: EventInit): Event {
    params = params || {};
    const event = document.createEvent('Event');
    event.initEvent(
      eventName,
      params.bubbles === void 0 ? false : params.bubbles,
      params.cancelable === void 0 ? false : params.cancelable
    );
    return event;
  };
  Event.prototype = EventOriginal.prototype;
  // defaultPrevented is broken in IE.
  // https://connect.microsoft.com/IE/feedback/details/790389/event-defaultprevented-returns-false-after-preventdefault-was-called
  Event.prototype.preventDefault = function (): void {
    if (!this.cancelable) return;
    preventDefaultOriginal.call(this);
    Object.defineProperty(this, 'defaultPrevented', {
      get() {
        return true;
      },
      configurable: true
    });
  };
  Object.defineProperty(window, 'Event', {
    value: Event,
    writable: true,
    configurable: true
  });
}
