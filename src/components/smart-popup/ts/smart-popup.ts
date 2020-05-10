import {CustomElement} from '../../../helpers/custom-element';
import {ESC} from '../../../helpers/keycodes';
import {attr} from '../../../helpers/decorators/attr';
import PopupManager from './smart-popup-manager';
import {jsonAttr} from '../../../helpers/decorators/json-attr';

export interface PopupActionParams {
	force?: boolean;
	silent?: boolean;
	trigger?: HTMLElement;
}

export class SmartPopup extends CustomElement {
	public static is = 'smart-popup';
	public static eventNs = 'esl:popup';

	protected static defaultParams = {};
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
	private _open: boolean = false;

	@attr() public group: string;
	@attr() public bodyClass: string;
	@attr() public activeClass: string;
	@attr() public closeButton: string;

	@attr({conditional: true}) public closeOnEsc: boolean;
	@attr({conditional: true}) public closeOnBodyClick: boolean;

	@attr({conditional: true}) public open: boolean;

	@jsonAttr({staticDefault: 'defaultParams', default: {}}) public defaultParams: PopupActionParams;
	@jsonAttr({staticDefault: 'initialParams', default: {}}) public initialParams: PopupActionParams;

	protected attributeChangedCallback(attrName: string, oldVal: string, newVal: string) {
		if (!this._ready || newVal === oldVal) return;
		switch (attrName) {
			case 'open':
				this.toggle(this.open);
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
		super.connectedCallback();
		this.setGroup();
		this.bindEvents();
		this.bindBodyClickHandler();
		this._ready = true;
		// Force initial state
		this.toggle(this.open, Object.assign({}, this.defaultParams, this.initialParams));
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
	public show(params: PopupActionParams = this.defaultParams) {
		if (params.force || !this._open) this.onShow(params);
		return this;
	}

	/**
	 * Changes popup state to inactive
	 */
	public hide(params: PopupActionParams = this.defaultParams) {
		if (params.force || this._open) this.onHide(params);
		return this;
	}

	/**
	 * Toggle popup state
	 */
	public toggle(state: boolean = !this.open, params: PopupActionParams = this.defaultParams) {
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
		this._open = true;

		PopupManager.hidePopupsInGroup(this);
		this.setAttribute('open', '');
		this.setAttribute('aria-hidden', 'false');
		this.activeClass && this.classList.add(this.activeClass);
		this.bodyClass && document.body.classList.add(this.bodyClass);

		if (!params.silent) this.fireStateChange();
	}

	protected onHide(params: PopupActionParams) {
		this._open = false;

		this.removeAttribute('open');
		this.setAttribute('aria-hidden', 'true');
		this.activeClass && this.classList.remove(this.activeClass);
		this.bodyClass && document.body.classList.remove(this.bodyClass);

		if (!params.silent) this.fireStateChange();
	}

	protected fireStateChange() {
		this.dispatchCustomEvent('statechange', {
			detail: { open: this._open }
		});
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
