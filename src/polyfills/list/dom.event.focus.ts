/**
 * Group: DOM API shims
 * Target Browsers: `IE11`, `Edge < 18`
 * FocusEvent polyfill: https://developer.mozilla.org/en-US/docs/Web/API/FocusEvent/FocusEvent
 */
try {
  new window.FocusEvent('event', {bubbles: true, cancelable: true});
} catch (error) {
  const FocusEventOriginal = window.FocusEvent || window.Event;
  const FocusEvent = function (eventName: string, params: FocusEventInit): FocusEvent {
    params = params || {};
    const event: any = document.createEvent('FocusEvent');

    // https://msdn.microsoft.com/en-us/library/ff975954(v=vs.85).aspx
    event.initFocusEvent(
      eventName,
      params.bubbles === void 0 ? false : params.bubbles,
      params.cancelable === void 0 ? false : params.cancelable,
      params.view === void 0 ? window : params.view,
      params.detail === void 0 ? {} : params.detail,
      params.relatedTarget === void 0 ? null : params.relatedTarget
    );

    return event;
  };
  FocusEvent.prototype = FocusEventOriginal.prototype;
  Object.defineProperty(window, 'FocusEvent', {
    value: FocusEvent,
    writable: true,
    configurable: true
  });
}
