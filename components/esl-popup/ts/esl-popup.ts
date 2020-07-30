import {ExportNs} from '../../esl-utils/enviroment/export-ns';
import {ESLBaseElement, attr, jsonAttr} from '../../esl-base-element/esl-base-element';
import {ESC} from '../../esl-utils/dom/keycodes';
import PopupManager from './esl-popup-manager';
import {SingleTaskManager} from '../../esl-utils/async/single-task-manager';
import {DeviceDetector} from '../../esl-utils/enviroment/device-detector';
import {defined} from '../../esl-utils/misc/compare';

export interface PopupActionParams {
	initiator?: string;
	delay?: number;
	showDelay?: number;
	hideDelay?: number;
	force?: boolean;
	silent?: boolean;
	trackHover?: boolean;
	trigger?: HTMLElement;
	previousPopup?: ESLPopup;
    nextPopup?: ESLPopup;
}

const $body = document.body;

@ExportNs('Popup')
export class ESLPopup extends ESLBaseElement {
	public static is = 'esl-popup';
	public static eventNs = 'esl:popup';

	protected static defaultParams = {};
	protected static initialParams = {silent: true, force: true};

	static get observedAttributes() {
		return ['open', 'group', 'close-on-esc'];
	}

	private _open: boolean = false;
	private _trackHover: boolean = false;
	private _taskManager: SingleTaskManager = new SingleTaskManager();

	@attr() public group: string;
	@attr() public bodyClass: string;
	@attr() public activeClass: string;
	@attr() public closeButton: string;

	@attr({conditional: true}) public disableA11y: boolean;
	@attr({conditional: true}) public closeOnEsc: boolean;
	@attr({conditional: true}) public closeOnBodyClick: boolean;

	@attr({conditional: true}) public open: boolean;

	@jsonAttr<PopupActionParams>({staticDefault: 'defaultParams', default: {}}) public defaultParams: PopupActionParams;
	@jsonAttr<PopupActionParams>({staticDefault: 'initialParams', default: {}}) public initialParams: PopupActionParams;

	protected attributeChangedCallback(attrName: string, oldVal: string, newVal: string) {
		if (!this.connected || newVal === oldVal) return;
		switch (attrName) {
			case 'open':
				this.toggle(this.open, Object.assign({ initiator: 'attribute' }, this.defaultParams));
				break;
			case 'group':
				oldVal && PopupManager.removeFromGroup(this, oldVal);
				newVal && PopupManager.registerInGroup(this, newVal);
				break;
			case 'close-on-esc':
				this.bindCloseOnEscHandler();
				break;
		}
	}

	protected connectedCallback() {
		super.connectedCallback();
		this.bindEvents();
		PopupManager.registerInGroup(this, this.group);

		// Force initial state
		this.toggle(this.open, Object.assign({}, this.defaultParams, this.initialParams));
	}
	protected disconnectedCallback() {
		super.disconnectedCallback();
		PopupManager.removeFromGroup(this);
		this.unbindEvents();
	}

	protected bindEvents() {
		if (this.closeButton) {
			this.addEventListener('click', this.onClick);
		}
		this.bindCloseOnEscHandler();
	}
	protected unbindEvents() {
		this.removeEventListener('click', this.onClick);
		this.removeEventListener('keydown', this.onKeyboardEvent);
		$body.removeEventListener('click', this.onBodyClick);
	}

	protected bindCloseOnEscHandler() {
		this.removeEventListener('keydown', this.onKeyboardEvent);
		if (this.closeOnEsc) {
			this.addEventListener('keydown', this.onKeyboardEvent);
		}
	}

	protected bindHoverStateTracking(track: boolean) {
		if (DeviceDetector.isTouchDevice) return;
		if (this._trackHover === track) return;
		this._trackHover = track;
		if (this._trackHover) {
			this.addEventListener('mouseenter', this.onMouseEnter);
			this.addEventListener('mouseleave', this.onMouseLeave);
		} else {
			this.removeEventListener('mouseenter', this.onMouseEnter);
			this.removeEventListener('mouseleave', this.onMouseLeave);
		}
	}

	/**
	 * Toggle popup state
	 */
	public toggle(state: boolean = !this.open, params?: PopupActionParams) {
		state ? this.show(params) : this.hide(params);
		return this;
	}

	/**
	 * Changes popup state to active
	 */
	public show(params?: PopupActionParams) {
        params = Object.assign({}, this.defaultParams, params || {});
        PopupManager.hidePopupsInGroup(this, params);
        this._taskManager.push(() => {
			if (!params.force && this._open) return;
			this.onShow(params);
		}, defined(params.showDelay, params.delay));
		this.bindHoverStateTracking(params.trackHover);
		if (this.closeOnBodyClick) {
			$body.addEventListener('click', this.onBodyClick);
		}
		return this;
	}

	/**
	 * Changes popup state to inactive
	 */
	public hide(params?: PopupActionParams) {
        params = Object.assign({}, this.defaultParams, params || {});
        this._taskManager.push(() => {
			if (!params.force && !this._open) return;
			this.onHide(params);
		}, defined(params.hideDelay, params.delay));
		this.bindHoverStateTracking(params.trackHover);
		$body.removeEventListener('click', this.onBodyClick);
		return this;
	}

	protected onShow(params: PopupActionParams) {
		this._open = true;

		this.setAttribute('open', '');
		(!this.disableA11y) && this.setAttribute('aria-hidden', 'false');
        this.activeClass && this.classList.add(this.activeClass);
        this.bodyClass && $body.classList.add(this.bodyClass);

		if (!params.silent) this.fireStateChange();
	}

	protected onHide(params: PopupActionParams) {
		this._open = false;

		this.removeAttribute('open');
		(!this.disableA11y) && this.setAttribute('aria-hidden', 'true');
        this.activeClass && this.classList.remove(this.activeClass);
        this.bodyClass && $body.classList.remove(this.bodyClass);

		if (!params.silent) this.fireStateChange();
	}

	protected fireStateChange() {
		this.dispatchCustomEvent('statechange', {
			detail: { open: this._open },
      bubbles: true
		});
	}

	protected onClick = (e: MouseEvent) => {
		const target = e.target as HTMLElement;
		if (this.closeButton && target.closest(this.closeButton)) {
			this.hide(Object.assign({}, this.defaultParams, { initiator: 'close' }));
		}
	};
	protected onBodyClick = (e: MouseEvent) => {
		const target = e.target as HTMLElement;
		if (!this.contains(target)) {
			this.hide({ initiator: 'bodyclick', trigger: target });
		}
	};
	protected onMouseEnter = (e: MouseEvent) => {
		this.show(Object.assign({}, this.defaultParams, { initiator: 'mouseenter', trackHover: true }));
	};
	protected onMouseLeave = (e: MouseEvent) => {
		this.hide(Object.assign({}, this.defaultParams, { initiator: 'mouseleave' }));
	};
	protected onKeyboardEvent = (e: KeyboardEvent) => {
		if (this.closeOnEsc && e.which === ESC) {
			this.hide(Object.assign({}, this.defaultParams, { initiator: 'keyboard' }));
		}
	};
}

export default ESLPopup;
