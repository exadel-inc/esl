/**
 * @returns Promise that will be resolved or rejected in `timeout` with an optional `payload`
 * If `isReject` is `true` the result promise will be rejected, otherwise (by default) the result promise will be resolved
 */
export function promisifyTimeout<T>(timeout: number, payload?: T, isReject?: boolean): Promise<T> {
  return new Promise<T>((resolve, reject) =>
    setTimeout((isReject ? reject : resolve).bind(null, payload), timeout)
  );
}
