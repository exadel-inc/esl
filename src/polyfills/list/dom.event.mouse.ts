/**
 * Group: DOM API shims
 * Target Browsers: `IE11`, `Edge < 18`
 * MouseEvent polyfill: https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/MouseEvent
 */
try {
  new window.MouseEvent('event', {bubbles: true, cancelable: true});
} catch (error) {
  const MouseEventOriginal = window.MouseEvent || window.Event;
  // TODO change after migration  eslint-disable-next-line sonarjs/cognitive-complexity
  const MouseEvent = function (eventName: string, params: MouseEventInit): MouseEvent {
    params = params || {};
    const event: any = document.createEvent('MouseEvent');

    // https://msdn.microsoft.com/en-us/library/ff975292(v=vs.85).aspx
    event.initMouseEvent(
      eventName,
      (params.bubbles === void 0) ? false : params.bubbles,
      (params.cancelable === void 0) ? false : params.cancelable,
      (params.view === void 0) ? window : params.view!,
      (params.detail === void 0) ? 0 : params.detail,
      (params.screenX === void 0) ? 0 : params.screenX,
      (params.screenY === void 0) ? 0 : params.screenY,
      (params.clientX === void 0) ? 0 : params.clientX,
      (params.clientY === void 0) ? 0 : params.clientY,
      (params.ctrlKey === void 0) ? false : params.ctrlKey,
      (params.altKey === void 0) ? false : params.altKey,
      (params.shiftKey === void 0) ? false : params.shiftKey,
      (params.metaKey === void 0) ? false : params.metaKey,
      (params.button === void 0) ? 0 : params.button,
      (params.relatedTarget === void 0) ? null : params.relatedTarget
    );

    event.buttons = (params.buttons === void 0) ? 0 : params.buttons;
    event.region  = ((params as any).region === void 0) ? null : (params as any).region;

    return event;
  };
  MouseEvent.prototype = MouseEventOriginal.prototype;
  Object.defineProperty(window, 'MouseEvent', {
    value: MouseEvent,
    writable: true,
    configurable: true
  });
}
