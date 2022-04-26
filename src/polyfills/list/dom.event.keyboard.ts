/**
 * Group: DOM API shims
 * Target Browsers: `IE11`, `Edge < 18`
 * KeyboardEvent polyfill: https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/KeyboardEvent
 */
try {
  new window.KeyboardEvent('event', {bubbles: true, cancelable: true});
} catch (error) {
  const KeyboardEventOriginal = window.KeyboardEvent || window.Event;
  // eslint-disable-next-line sonarjs/cognitive-complexity
  const KeyboardEvent = function (eventName: string, params: KeyboardEventInit): KeyboardEvent {
    params = params || {};
    const event: any = document.createEvent('KeyboardEvent');

    // https://msdn.microsoft.com/en-us/library/ff975297(v=vs.85).aspx
    event.initKeyboardEvent(
      eventName,
      (params.bubbles === void 0) ? false : params.bubbles,
      (params.cancelable === void 0) ? false : params.cancelable,
      (params.view === void 0) ? window : params.view,
      (params.key === void 0) ? '' : params.key,
      (params.location === void 0) ? 0 : params.location,
      params.ctrlKey === true,
      params.altKey === true,
      params.shiftKey === true,
      params.metaKey === true
    );

    event.keyCode   = (params.keyCode === void 0) ? 0 : params.keyCode;
    event.code      = (params.code === void 0) ? '' : params.code;
    event.charCode  = (params.charCode === void 0) ? 0 : params.charCode;
    event.char      = (params.charCode === void 0) ? '' : params.charCode;
    event.which     = (params.which === void 0) ? 0 : params.which;

    return event;
  };
  KeyboardEvent.prototype = KeyboardEventOriginal.prototype;
  Object.defineProperty(window, 'KeyboardEvent', {
    value: KeyboardEvent,
    writable: true,
    configurable: true
  });
}
