import {SmartPopup, PopupActionParams} from '../../smart-popup/ts/smart-popup';

import {attr} from '../../../helpers/decorators/attr';
import {afterNextRender} from '../../../helpers/function-utils';

type AccordionActionParams = PopupActionParams;

export class SmartAccordion extends SmartPopup {
	public static is = 'smart-accordion';
	public static eventNs = 'saccordion';

	@attr({defaultValue: 'open'}) public activeClass: string;
	@attr({defaultValue: 'auto'}) public fallbackDuration: number;

	protected bindEvents() {
		super.bindEvents();
		this.addEventListener('transitionend', this.onTransitionEnd);
	}

	protected unbindEvents() {
		super.unbindEvents();
		this.removeEventListener('transitionend', this.onTransitionEnd);
	}

	protected onShow(params: AccordionActionParams) {
		super.onShow(params);
		// set initial height
		this.style.setProperty('max-height', '0');
		// make sure that browser apply initial height for animation
		afterNextRender(() => {
			this.style.setProperty('max-height', `${this.scrollHeight}px`);
		});
		(this.fallbackDuration >= 0) && setTimeout(this.onTransitionEnd, this.fallbackDuration);
	}

	protected onHide(params: AccordionActionParams) {
		const height = this.scrollHeight;
		super.onHide(params);
		// set initial height
		this.style.setProperty('max-height', `${height}px`);
		// make sure that browser apply initial height for animation
		afterNextRender(() => {
			this.style.setProperty('max-height', '0');
		});
		(this.fallbackDuration >= 0) && setTimeout(this.onTransitionEnd, this.fallbackDuration);
	}

	protected onTransitionEnd = (e?: TransitionEvent) => {
		if (!e || e.propertyName === 'max-height') {
			this.style.removeProperty('max-height');
			// TODO: animationEndEvent
		}
	};
}