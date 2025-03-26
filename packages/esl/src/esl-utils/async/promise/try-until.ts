/**
 * Call `callback` limited by `tryCount` amount of times with interval in `timeout` ms
 * @returns Promise that will be resolved as soon as callback returns truthy value, or reject it by limit.
 */
export function tryUntil<T>(callback: () => T, tryCount = 2, timeout = 100): Promise<T> {
  return new Promise((resolve, reject) => {
    (function check(): void {
      let result: T | undefined;
      try {
        result = callback();
      } catch {
        result = undefined;
      }

      if (result || (tryCount--) < 0) {
        result ? resolve(result) : reject(new Error('Rejected by limit of tries'));
      } else {
        setTimeout(check, timeout);
      }
    })();
  });
}

/** Alias for {@link tryUntil} */
export const promisifiedTry = tryUntil;
