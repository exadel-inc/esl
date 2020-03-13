/**
 * Function that do nothing
 */
// eslint-disable-next-line
export function noop() {}

/**
 * Creates a debounced function that delays invoking func until after wait milliseconds have elapsed
 * since the last time the debounced function was invoked.
 * The func is invoked with the last arguments provided to the debounced function.
 * @param fn
 * @param wait
 * @param immediate indicate whether func should be invoked on the leading and/or trailing edge of the wait timeout.
 * @returns {Function}
 */
export function debounce<T extends Function>(fn: T, wait = 10, immediate = false): T {
    let timeout: ReturnType<typeof setTimeout> = null;
    return function (...args: any) {
        const later = () => {
            timeout = null;
            if (!immediate) fn.apply(this, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) fn.apply(this, args);
    } as any as T
}

/**
 * Creates a throttled executed function.
 * The func is invoked with the last arguments provided to the throttled function.
 * @param fn
 * @param threshold - indicates how often function could be called
 * @returns {Function}
 */
export function throttle <T extends Function>(fn: T, threshold = 250): T {
    let last: number;
    let deferTimer: ReturnType<typeof setTimeout>;
    return function (...args: any) {
        const now = Date.now();
        if (last && now < last + threshold) {
            // hold on to it
            clearTimeout(deferTimer);
            deferTimer = setTimeout(() => {
                last = now;
                fn.apply(this, args);
            }, threshold);
        } else {
            last = now;
            fn.apply(this, args);
        }
    } as any as T;
}

/**
 * Postpone action after next render
 * @param {function} callback
 */
export const afterNextRender = (callback: () => void) => requestAnimationFrame(() => requestAnimationFrame(callback));

/**
 * Decorate function to schedule execution after next render
 * @param {function} fn
 * @returns {function} - decorated function
 */
export const rafDecorator = (fn: Function) => {
    let rafScheduled = false;
    return function (...args: any) {
        if (!rafScheduled) {
            requestAnimationFrame(() => {
                fn.call(this, ...args);
                rafScheduled = false;
            });
        }
        rafScheduled = true;
    };
};