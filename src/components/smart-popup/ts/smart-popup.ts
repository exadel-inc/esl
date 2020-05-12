import {CustomElement} from '../../../helpers/custom-element';
import {ESC} from '../../../helpers/keycodes';
import {attr} from '../../../helpers/decorators/attr';
import PopupManager from './smart-popup-manager';
import {jsonAttr} from '../../../helpers/decorators/json-attr';
import {SingleTaskPlanner} from '../../../helpers/common/single-task-planner';
import {DeviceDetector} from '../../../helpers/device-utils';

export interface PopupActionParams {
	initiator?: string;
	delay?: number | false;
	showDelay?: number | false;
	hideDelay?: number | false;
	force?: boolean;
	silent?: boolean;
	trigger?: HTMLElement;
	requestTrackHover?: boolean;
}

export class SmartPopup extends CustomElement {
	public static is = 'smart-popup';
	public static eventNs = 'esl:popup';

	protected static defaultParams = {};
	protected static initialParams = {silent: true};

	static get observedAttributes() {
		return ['active', 'group', 'close-on-esc', 'close-on-body-click'];
	}

	private _ready: boolean = false;
	private _open: boolean = false;
	private _task: SingleTaskPlanner = new SingleTaskPlanner();
	private _trackHover: boolean = false;

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
				this.toggle(this.open, Object.assign({ initiator: 'attribute' }, this.defaultParams));
				break;
			case 'group':
				oldVal && PopupManager.removeFromGroup(this, oldVal);
				newVal && PopupManager.registerInGroup(this, newVal);
				break;
			case 'close-on-esc':
				this.bindCloseOnEscHandler();
				break;
			case 'close-on-body-click':
				this.bindBodyClickHandler();
				break;
		}
	}

	protected connectedCallback() {
		super.connectedCallback();
		this.bindEvents();
		this.bindBodyClickHandler();
		PopupManager.registerInGroup(this, this.group);
		this._ready = true;
		// Force initial state
		this.toggle(this.open, Object.assign({}, this.defaultParams, this.initialParams));
	}

	protected disconnectedCallback() {
		this._ready = false;
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
		this.removeEventListener('keydown', this.onKeyboardEvent);
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

	protected bindHoverStateTrack(track: boolean) {
		if (DeviceDetector.isTouchDevice) return;
		if (this._trackHover === track) return;
		this._trackHover = track
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
	public toggle(state: boolean = !this.open, params: PopupActionParams = this.defaultParams) {
		state ? this.show(params) : this.hide(params);
		return this;
	}

	/**
	 * Changes popup state to active
	 */
	public show(params: PopupActionParams = this.defaultParams) {
		this._task.push(() => {
			if (!params.force && this._open) return;
			this.onShow(params)
		}, params.showDelay || params.delay);
		this.bindHoverStateTrack(params.requestTrackHover);
		return this;
	}

	/**
	 * Changes popup state to inactive
	 */
	public hide(params: PopupActionParams = this.defaultParams) {
		this._task.push(() => {
			if (!params.force && !this._open) return
			this.onHide(params)
		}, params.hideDelay || params.delay);
		this.bindHoverStateTrack(params.requestTrackHover);
		return this;
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
			this.hide(Object.assign({}, this.defaultParams, { initiator: 'close' }));
		}
		if (this.closeOnBodyClick) {
			e.stopPropagation();
		}
	};

	protected onMouseEnter = (e: MouseEvent) => {
		this.show(Object.assign({}, this.defaultParams, { initiator: 'mouseenter', requestTrackHover: true }));
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

export default SmartPopup;
