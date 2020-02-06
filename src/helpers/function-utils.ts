/***
 * Function that do nothing
 */
/* tslint:disable-next-line no-empty */
export function noop() {}

/***
 * Creates a debounced function that delays invoking func until after wait milliseconds have elapsed
 * since the last time the debounced function was invoked.
 * The func is invoked with the last arguments provided to the debounced function.
 * @param fn
 * @param wait
 * @param immediate indicate whether func should be invoked on the leading and/or trailing edge of the wait timeout.
 * @returns {Function}
 */
/* tslint:disable-next-line ban-types */
export function debounce<T extends Function>(fn: T, wait: number = 10, immediate: boolean = false): T {
    let timeout: ReturnType<typeof setTimeout> = null;
    return function (...args: any) {
        const context = this;
        const later = function () {
            timeout = null;
            if (!immediate) fn.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) fn.apply(context, args);
    } as any as T
}

/***
 * Creates a throttled executed function.
 * The func is invoked with the last arguments provided to the throttled function.
 * @param fn
 * @param threshold - indicates how often function could be called
 * @returns {Function}
 */
/* tslint:disable-next-line ban-types */
export function throttle <T extends Function>(fn: T, threshold: number = 250): T {
    let last: number;
    let deferTimer: ReturnType<typeof setTimeout>;
    return function (...args: any) {
        const context = this;
        const now = Date.now();
        if (last && now < last + threshold) {
            // hold on to it
            clearTimeout(deferTimer);
            deferTimer = setTimeout(function () {
                last = now;
                fn.apply(context, args);
            }, threshold);
        } else {
            last = now;
            fn.apply(context, args);
        }
    } as any as T;
}
