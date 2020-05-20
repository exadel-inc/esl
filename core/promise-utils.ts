export class PromiseUtils {
	static fromTimeout<T>(timeout: number, payload: any = undefined): Promise<T> {
		return new Promise<T>((resolve) =>
			setTimeout(() => resolve(payload), timeout, {once:  true})
		);
	}

	static fromEvent(target: HTMLElement, eventName: string, options?: boolean | AddEventListenerOptions): Promise<Event> {
		return new Promise((resolve) =>
			target.addEventListener(eventName, resolve, options)
		);
	}

	static fromEventWithTimeout(timeout: number, target: HTMLElement, eventName: string): Promise<Event> {
		return new Promise((resolve) => {
			if (timeout === 0) {
				resolve(null);
				return;
			}
			target.addEventListener(eventName, resolve, {once: true});
			(timeout > 0) && setTimeout(() => resolve(null), timeout);
		});
	}
}