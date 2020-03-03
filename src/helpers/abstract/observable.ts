export class Observable {
	private _listeners: Set<(() => void)> = new Set<(() => void)>();

	public addListener(listener: (...args: any) => void) {
	    if (!this._listeners.has(listener)) this._listeners.add(listener);
	}

	public removeListener(listener: (...args: any) => void) {
        if (this._listeners.has(listener)) this._listeners.delete(listener);
	}

	protected fire(...args: any) {
		this._listeners.forEach((listener) => {
			try {
				listener.apply(this, args);
			} catch (e) {
				console.log(e);
			}
		});
	}
}
