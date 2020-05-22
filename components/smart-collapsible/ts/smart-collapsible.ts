import {SmartPopup, PopupActionParams} from '../../smart-popup/ts/smart-popup';

import {attr} from '../../smart-utils/decorators/attr';
import {afterNextRender} from '../../smart-utils/function/raf';

interface CollapsibleActionParams extends PopupActionParams{
	noAnimation?: boolean;
}

export class SmartCollapsible extends SmartPopup {
	public static is = 'smart-collapsible';
	public static eventNs = 'esl:collapsible';

	@attr({defaultValue: 'open'}) public activeClass: string;
	@attr({defaultValue: 'auto'}) public fallbackDuration: number;
	@attr({defaultValue: 'vertical'}) public direction: string;

	protected bindEvents() {
		super.bindEvents();
		this.addEventListener('transitionend', this.onTransitionEnd);
	}

	protected unbindEvents() {
		super.unbindEvents();
		this.removeEventListener('transitionend', this.onTransitionEnd);
	}

	public get transitionProperty() {
		return this.direction === 'horizontal' ? 'max-width' : 'max-height';
	}
	public get contentSize() {
		return this.direction === 'horizontal' ? this.scrollWidth : this.scrollHeight;
	}

	protected onShow(params: CollapsibleActionParams) {
		super.onShow(params);
		// Skip max-height animation
		if (params.noAnimation) return;
		// set initial height
		this.style.setProperty(this.transitionProperty, '0');
		// make sure that browser apply initial height for animation
		afterNextRender(() => {
			this.style.setProperty(this.transitionProperty, `${this.contentSize}px`);
		});
		(this.fallbackDuration >= 0) && setTimeout(this.onTransitionEnd, this.fallbackDuration);
	}

	protected onHide(params: CollapsibleActionParams) {
		const height = this.contentSize;
		super.onHide(params);
		// Skip max-height animation
		if (params.noAnimation) return;
		// set initial height
		this.style.setProperty(this.transitionProperty, `${height}px`);
		// make sure that browser apply initial height for animation
		afterNextRender(() => {
			this.style.setProperty(this.transitionProperty, '0');
		});
		(this.fallbackDuration >= 0) && setTimeout(this.onTransitionEnd, this.fallbackDuration);
	}

	protected onTransitionEnd = (e?: TransitionEvent) => {
		if (!e || e.propertyName === this.transitionProperty) {
			this.style.removeProperty(e.propertyName);
			this.dispatchCustomEvent('transitionend', {
				detail: { open: this.open }
			});
		}
	};
}