export class Observable {
	private _listeners: Array<() => void> = [];

	public addListener(listener: (...args: any) => void) {
		const index = this._listeners.indexOf(listener);
		if (index === -1) {
			this._listeners.push(listener);
		}
	}

	public removeListener(listener: (...args: any) => void) {
		const index = this._listeners.indexOf(listener);
		if (index !== -1) {
			this._listeners.splice(index);
		}
	}

	protected fire(...args: any) {
		this._listeners.forEach((listener) => {
			try {
				listener.apply(this, args);
			} catch (e) {
				// Don't care
			}
		});
	}
}
