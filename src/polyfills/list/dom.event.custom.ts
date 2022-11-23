/**
 * Group: DOM API shims
 * Target Browsers: `IE11`, `Edge < 18`
 * CustomEvent polyfill
 */
try {
  new window.CustomEvent('event', {bubbles: true, cancelable: true});
} catch (error) {
  const CustomEventOriginal = window.CustomEvent || window.Event;
  const CustomEvent = function (eventName: string, params: CustomEventInit): CustomEvent {
    params = params || {};
    const event = document.createEvent('CustomEvent');
    event.initCustomEvent(
      eventName,
      (params.bubbles === void 0) ? false : params.bubbles,
      (params.cancelable === void 0) ? false : params.cancelable,
      (params.detail === void 0) ? {} : params.detail
    );
    return event;
  };
  CustomEvent.prototype = CustomEventOriginal.prototype;
  Object.defineProperty(window, 'CustomEvent', {
    value: CustomEvent,
    writable: true,
    configurable: true
  });
}
