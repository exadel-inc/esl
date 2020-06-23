import type {AnyToVoidFnSignature} from '../misc/functions';

export class SingleTaskManager {
	private _payload: AnyToVoidFnSignature;
	private _timeout: number;

	private execute = () => {
		this._timeout = null;
		this._payload && this._payload();
	};

	public push(task: AnyToVoidFnSignature, delay: number | boolean = false) {
		if (typeof task !== 'function') return false;
		this.clear();
		if (typeof delay === 'number' && delay >= 0) {
			this._payload = task;
			this._timeout = window.setTimeout(this.execute, delay);
		} else {
			task();
		}
		return true;
	}
	public clear() {
		this._payload = null;
		(this._timeout) && clearTimeout(this._timeout);
		this._timeout = null;
	}
}