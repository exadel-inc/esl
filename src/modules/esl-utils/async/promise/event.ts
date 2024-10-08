/** Interface to describe abstract listenable target */
export type ListenableTarget = {
  addEventListener: (
    event: string,
    callback: (payload: any) => void,
    options?: boolean | AddEventListenerOptions | undefined
  ) => void;
  removeEventListener: (
    event: string,
    callback: (payload: any) => void,
    options?: boolean | AddEventListenerOptions | undefined
  ) => void;
};

/**
 * @returns Promise that will be resolved by dispatching `event` on `target`
 * Or it will be rejected in `timeout` if it's specified
 * Optional `options` for addEventListener can be also specified
 */
export function promisifyEvent(
  target: ListenableTarget,
  event: string,
  timeout?: number | null | undefined,
  options?: boolean | AddEventListenerOptions
): Promise<Event> {
  return new Promise((resolve, reject) => {
    const signal = (options as AddEventListenerOptions)?.signal;
    if (signal?.aborted) return rejectOnSignal();

    function eventCallback(e?: Event): void {
      target.removeEventListener(event, eventCallback, options);
      e ? resolve(e) : reject(new Error('Rejected by timeout'));
      signalCallback();
    }
    function signalCallback(e?: Event): void {
      signal?.removeEventListener('abort', signalCallback);
      e && rejectOnSignal();
    }
    function rejectOnSignal(): void {
      reject(new Error('Rejected by abort signal'));
    }

    target.addEventListener(event, eventCallback, options);
    if (typeof timeout === 'number' && timeout >= 0) {
      setTimeout(eventCallback, timeout);
    }
    signal?.addEventListener('abort', signalCallback);
  });
}

/**
 * Short helper to make Promise from element state marker
 * @returns Promise that will be resolved if the target `marker` property is truthful or `event` is dispatched
 * @example
 * `const imgReady = promisifyMarker(eslImage, 'ready');`
 */
export function promisifyMarker(target: HTMLElement, marker: string, event: string = marker): Promise<HTMLElement> {
  if ((target as any)[marker]) return Promise.resolve(target);
  return promisifyEvent(target, event).then(() => target);
}
