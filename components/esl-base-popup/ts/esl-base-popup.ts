import {ESC} from '../../esl-utils/dom/keycodes';
import {defined} from '../../esl-utils/misc/compare';
import {ExportNs} from '../../esl-utils/enviroment/export-ns';
import {DeviceDetector} from '../../esl-utils/enviroment/device-detector';
import {SingleTaskManager} from '../../esl-utils/async/single-task-manager';
import {ESLBaseElement, attr, jsonAttr} from '../../esl-base-element/esl-base-element';

import {ESLBasePopupGroup} from './esl-base-popup-group';

export interface PopupActionParams {
	initiator?: string;
	delay?: number;
	showDelay?: number;
	hideDelay?: number;
	force?: boolean;
	silent?: boolean;
	trackHover?: boolean;
	trigger?: HTMLElement;
	previousPopup?: ESLBasePopup;
	nextPopup?: ESLBasePopup;
}

const $body = document.body;

@ExportNs('BasePopup')
export class ESLBasePopup extends ESLBaseElement {
	protected static defaultParams = {};
	protected static initialParams = {silent: true, force: true};

	static get observedAttributes() {
		return ['open', 'group', 'close-on-esc'];
	}

	protected _open: boolean = false;
	protected _trackHover: boolean = false;
	protected _taskManager: SingleTaskManager = new SingleTaskManager();

	@attr() public bodyClass: string;
	@attr() public activeClass: string;
	@attr() public closeButton: string;

	@attr({name: 'group'}) public groupName: string;

	@attr({conditional: true}) public closeOnEsc: boolean;
	@attr({conditional: true}) public closeOnBodyClick: boolean;

	@attr({conditional: true}) public open: boolean;

	@jsonAttr<PopupActionParams>({staticDefault: 'initialParams', default: {}}) public initialParams: PopupActionParams;
	@jsonAttr<PopupActionParams>({staticDefault: 'defaultParams', default: {}}) public defaultParams: PopupActionParams;

	public get group() {
		return ESLBasePopupGroup.find(this.groupName);
	}

	protected attributeChangedCallback(attrName: string, oldVal: string, newVal: string) {
		if (!this.connected || newVal === oldVal) return;
		switch (attrName) {
			case 'open':
				this.toggle(this.open, Object.assign({initiator: 'attribute'}, this.defaultParams));
				break;
			case 'group':
				oldVal && ESLBasePopupGroup.unregister(this, oldVal);
				newVal && ESLBasePopupGroup.register(this, newVal);
				break;
			case 'close-on-esc':
				this.bindCloseOnEscHandler();
				break;
		}
	}

	protected connectedCallback() {
		super.connectedCallback();
		this.bindEvents();
		ESLBasePopupGroup.register(this, this.groupName);
		// Force initial state
		this.toggle(this.open, Object.assign({}, this.defaultParams, this.initialParams));
	}

	protected disconnectedCallback() {
		super.disconnectedCallback();
		ESLBasePopupGroup.unregister(this);
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

		this.removeEventListener('mouseenter', this.onMouseEnter);
		this.removeEventListener('mouseleave', this.onMouseLeave);
		if (this._trackHover) {
			this.addEventListener('mouseenter', this.onMouseEnter);
			this.addEventListener('mouseleave', this.onMouseLeave);
		}
	}

	protected mergeDefaultParams(params?: PopupActionParams): PopupActionParams {
		return Object.assign({}, this.defaultParams, params || {});
	}

	/**
	 * Toggle popup state
	 */
	public toggle(state: boolean = !this.open, params?: PopupActionParams) {
		return state ? this.show(params) : this.hide(params);
	}

	/**
	 * Changes popup state to active
	 */
	public show(params?: PopupActionParams) {
		params = this.mergeDefaultParams(params);
		this.group.activate(this, params);
		this.planShowTask(params);
		this.bindHoverStateTracking(params.trackHover);
		if (this.closeOnBodyClick) {
			$body.addEventListener('click', this.onBodyClick);
		}
		return this;
	}
	private planShowTask(params: PopupActionParams) {
		this._taskManager.push(() => {
			if (!params.force && this._open) return;
			this.onShow(params);
		}, defined(params.showDelay, params.delay));
	}

	/**
	 * Changes popup state to inactive
	 */
	public hide(params?: PopupActionParams) {
		params = this.mergeDefaultParams(params);
		this.planHideTask(params);
		this.bindHoverStateTracking(params.trackHover);
		$body.removeEventListener('click', this.onBodyClick);
		return this;
	}
	private planHideTask(params: PopupActionParams) {
		this._taskManager.push(() => {
			if (!params.force && !this._open) return;
			this.onHide(params);
		}, defined(params.hideDelay, params.delay));
	}

	/**
	 * Returns element to apply a11y attributes
	 */
	protected get a11yTarget() {
		const target = this.getAttribute('a11y-target');
		if (target === 'none') return;
		return target ? this.querySelector(target) : this;
	}

	/**
	 * Called on show and on hide actions to update a11y state accordingly
	 */
	protected updateA11y() {
		const targetEl = this.a11yTarget;
		if (!targetEl) return;
		targetEl.setAttribute('aria-hidden', String(!this._open));
	}

	/**
	 * Action to show popup
	 */
	protected onShow(params: PopupActionParams) {
		this._open = true;

		this.setAttribute('open', '');
		this.activeClass && this.classList.add(this.activeClass);
		this.bodyClass && $body.classList.add(this.bodyClass);
		this.updateA11y();

		if (!params.silent) this.fireStateChange();
	}

	/**
	 * Action to hide popup
	 */
	protected onHide(params: PopupActionParams) {
		this._open = false;

		this.removeAttribute('open');
		this.activeClass && this.classList.remove(this.activeClass);
		this.bodyClass && $body.classList.remove(this.bodyClass);
		this.updateA11y();

		if (!params.silent) this.fireStateChange();
	}

	/**
	 * Fires component state change event
	 */
	protected fireStateChange() {
		this.dispatchCustomEvent('statechange', {
			detail: {open: this._open},
			bubbles: true
		});
	}

	// Handlers
	protected onClick = (e: MouseEvent) => {
		const target = e.target as HTMLElement;
		if (this.closeButton && target.closest(this.closeButton)) {
			this.hide(Object.assign({}, this.defaultParams, {initiator: 'close'}));
		}
	};
	protected onBodyClick = (e: MouseEvent) => {
		const target = e.target as HTMLElement;
		if (!this.contains(target)) {
			this.hide({initiator: 'bodyclick', trigger: target});
		}
	};
	protected onMouseEnter = (e: MouseEvent) => {
		this.show({initiator: 'mouseenter', trackHover: true});
	};
	protected onMouseLeave = (e: MouseEvent) => {
		this.hide({initiator: 'mouseleave', trackHover: true});
	};
	protected onKeyboardEvent = (e: KeyboardEvent) => {
		if (this.closeOnEsc && e.which === ESC) {
			this.hide(Object.assign({}, this.defaultParams, {initiator: 'keyboard'}));
		}
	};
}