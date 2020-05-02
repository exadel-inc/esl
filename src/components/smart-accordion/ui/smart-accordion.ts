import SmartPopup from '../../smart-popup/ts/smart-popup';

import {attr} from '../../../helpers/decorators/attr';
import {PromiseUtils} from '../../../helpers/promise-utils';
import {afterNextRender} from '../../../helpers/function-utils';

export class SmartAccordion extends SmartPopup {
	public static is = 'smart-accordion';
	public static eventNs = 'saccordion';

	@attr() public animationDuration: number;

	constructor() {
		super();
	}

	protected onShow() {
		super.onShow();
		this.style.setProperty('max-height', `${this.scrollHeight}px`);

		PromiseUtils.fromEventWithTimeout(this.animationDuration, this, 'transitionend')
			.then((e: TransitionEvent) => {
				if (e && e.propertyName !== 'max-height') return;
				this.style.removeProperty('height');
			});
	}

	protected onHide() {
		this.style.setProperty('max-height', `${this.scrollHeight}px`);
		super.onHide();

		// make sure that browser apply initial height for animation
		afterNextRender(() => this.style.removeProperty('max-height'));
	}
}