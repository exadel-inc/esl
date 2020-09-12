export class PromiseUtils {
	static fromTimeout<T>(timeout: number, payload: any = undefined, rejectOnTimeout = false): Promise<T> {
		return new Promise<T>((resolve, reject) =>
			setTimeout(() => rejectOnTimeout ? reject(payload) : resolve(payload), timeout, {once:  true})
		);
	}

	static fromEvent(target: HTMLElement, eventName: string, options?: boolean | AddEventListenerOptions): Promise<Event> {
		return new Promise((resolve) =>
			target.addEventListener(eventName, resolve, options)
		);
	}

	static fromEventWithTimeout(timeout: number, target: HTMLElement, eventName: string, rejectOnTimeout = false): Promise<Event | null> {
		return new Promise((resolve, reject) => {
			if (timeout === 0) {
				resolve(null);
				return;
			}
			target.addEventListener(eventName, resolve, {once: true});
			(timeout > 0) && setTimeout(() => rejectOnTimeout ? reject('timeout') : resolve(null), timeout);
		});
	}
}