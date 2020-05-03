import {CustomElement} from '../../../helpers/custom-element';
import {ESC} from '../../../helpers/keycodes';
import {attr} from '../../../helpers/decorators/attr';
import PopupManager from './smart-popup-manager';

export interface PopupActionParams {
	force?: boolean;
	silent?: boolean;
	trigger?: HTMLElement;
}

export interface ISmartPopup {
	show(params?: PopupActionParams): this;
	hide(params?: PopupActionParams): this;
	toggle(newState?: boolean): this;
}

export class SmartPopup extends CustomElement implements ISmartPopup {
	public static is = 'smart-popup';
	public static eventNs = 'spopup';

	protected static initialParams = {silent: true};

	static get observedAttributes() {
		return [
			'active',
			'close-on-esc',
			'close-on-body-click',
			'group',
			'body-class'
		];
	}

	private _ready: boolean = false;
	private _active: boolean = false;

	@attr() public group: string;
	@attr() public bodyClass: string;
	@attr() public activeClass: string;
	@attr() public closeButton: string;

	@attr({conditional: true}) public closeOnEsc: boolean;
	@attr({conditional: true}) public closeOnBodyClick: boolean;

	@attr({conditional: true}) public active: boolean;

	protected attributeChangedCallback(attrName: string, oldVal: string, newVal: string) {
		if (!this._ready || newVal === oldVal) return;
		switch (attrName) {
			case 'active':
				this.toggle(this.active);
				break;
			case 'close-on-esc':
				this.bindCloseOnEscHandler();
				break;
			case 'close-on-body-click':
				this.bindBodyClickHandler();
				break;
			case 'group':
				this.setGroup(newVal, oldVal);
				break;
		}
	}

	protected connectedCallback() {
		const popupClass = this.constructor as typeof SmartPopup;
		this.classList.add(popupClass.is);
		this.setGroup();
		this.bindEvents();
		this.bindBodyClickHandler();
		this._ready = true;
		// Force initial state
		if (popupClass.initialParams) {
			this.toggle(this.active, popupClass.initialParams);
		}
	}

	protected disconnectedCallback() {
		PopupManager.removeFromGroup(this);
		this.unbindEvents();
		PopupManager.removeCloseOnBodyClickPopup(this);
	}

	protected bindEvents() {
		this.addEventListener('click', this.onClick);
		this.bindCloseOnEscHandler();
	}

	protected unbindEvents() {
		this.removeEventListener('click', this.onClick);
	}

	protected setGroup(newGroup?: string, oldGroup?: string) {
		oldGroup && PopupManager.removeFromGroup(this, oldGroup);
		PopupManager.registerInGroup(this, newGroup);
	}

	/**
	 * Changes popup state to active
	 */
	public show(params: PopupActionParams = {}) {
		if (params.force || !this._active) this.onShow(params);
		return this;
	}

	/**
	 * Changes popup state to inactive
	 */
	public hide(params: PopupActionParams = {}) {
		if (params.force || this._active) this.onHide(params);
		return this;
	}

	/**
	 * Toggle popup state
	 */
	public toggle(state: boolean = !this.active, params?: PopupActionParams) {
		state ? this.show(params) : this.hide(params);
		return this;
	}

	protected bindBodyClickHandler() {
		PopupManager.removeCloseOnBodyClickPopup(this);
		PopupManager.registerCloseOnBodyClickPopup(this);
	}

	protected bindCloseOnEscHandler() {
		this.removeEventListener('keydown', this.onKeyboardEvent);
		if (this.closeOnEsc) {
			this.addEventListener('keydown', this.onKeyboardEvent);
		}
	}

	protected onShow(params: PopupActionParams) {
		this._active = true;

		PopupManager.hidePopupsInGroup(this);
		this.setAttribute('active', '');
		this.setAttribute('aria-hidden', 'false');
		this.activeClass && this.classList.add(this.activeClass);
		this.bodyClass && document.body.classList.add(this.bodyClass);

		if (!params.silent) {
			this.dispatchCustomEvent('show');
		}
	}

	protected onHide(params: PopupActionParams) {
		this._active = false;

		this.removeAttribute('active');
		this.setAttribute('aria-hidden', 'true');
		this.activeClass && this.classList.remove(this.activeClass);
		this.bodyClass && document.body.classList.remove(this.bodyClass);

		if (!params.silent) {
			this.dispatchCustomEvent('hide');
		}
	}

	protected onClick: EventListener = (e: Event) => {
		const target = e.target as HTMLElement;
		if (this.closeButton && target.closest(this.closeButton)) {
			this.hide();
		}
		if (this.closeOnBodyClick) {
			e.stopPropagation();
		}
	};

	protected onKeyboardEvent = (e: KeyboardEvent) => {
		if (this.closeOnEsc && e.which === ESC) {
			this.hide();
		}
	};
}

export default SmartPopup;
