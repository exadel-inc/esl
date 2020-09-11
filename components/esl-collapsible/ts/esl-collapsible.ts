import {ExportNs} from '../../esl-utils/enviroment/export-ns';

import {attr} from '../../esl-base-element/esl-base-element';
import {afterNextRender} from '../../esl-utils/async/raf';
import {CSSUtil} from '../../esl-utils/dom/styles';
import {ESLBasePopup, PopupActionParams} from '../../esl-base-popup/ts/esl-base-popup';

export interface CollapsibleActionParams extends PopupActionParams {
	noAnimation?: boolean;
}

@ExportNs('Collapsible')
export class ESLCollapsible extends ESLBasePopup {
	public static is = 'esl-collapsible';
	public static eventNs = 'esl:collapsible';

	@attr({defaultValue: 'open'}) public activeClass: string;
    @attr({defaultValue: 'animate'}) public animateClass: string;
    @attr({defaultValue: 'fade-animate'}) public postAnimateClass: string;
    @attr({defaultValue: 'auto'}) public fallbackDuration: number;

	protected initialHeight: number;

	protected bindEvents() {
		super.bindEvents();
		this.addEventListener('transitionend', this.onTransitionEnd);
    }
	protected unbindEvents() {
		super.unbindEvents();
		this.removeEventListener('transitionend', this.onTransitionEnd);
	}

	protected onShow(params: CollapsibleActionParams) {
        super.onShow(params);
        this.initialHeight = this.scrollHeight;
        // Skip max-height animation
		if (params.noAnimation) return;
        this.beforeAnimate(params);
        this.onAnimate('show', params);
		if (this.fallbackDuration >= 0) {
			setTimeout(this.onTransitionEnd, this.fallbackDuration);
		}
    }

	protected onHide(params: CollapsibleActionParams) {
		this.initialHeight = this.scrollHeight;
		super.onHide(params);
        // Skip max-height animation
        if (params.noAnimation) return;
        this.beforeAnimate(params);
		this.onAnimate('hide', params);
		if (this.fallbackDuration >= 0) {
			setTimeout(this.onTransitionEnd, this.fallbackDuration);
		}
	}

	protected onTransitionEnd = (e?: TransitionEvent) => {
		if (!e || e.propertyName === 'max-height') {
			this.style.removeProperty('max-height');
            this.afterAnimate();
		}
	};

    protected beforeAnimate(params: CollapsibleActionParams) {
	    CSSUtil.addCls(this, this.animateClass);
        this.postAnimateClass && afterNextRender(() => CSSUtil.addCls(this, this.postAnimateClass));
    }

    protected onAnimate(action: string, params: CollapsibleActionParams) {
        // set initial height
        this.style.setProperty('max-height', `${action === 'hide' ? this.initialHeight : 0}px`);
        // make sure that browser apply initial height for animation
        afterNextRender(() => {
            this.style.setProperty('max-height', `${action === 'hide' ? 0 : this.initialHeight}px`);
        });
    }

    protected afterAnimate() {
    	CSSUtil.removeCls(this, this.animateClass);
	    CSSUtil.removeCls(this, this.postAnimateClass);
        this.$$fireNs('transitionend', {
            detail: { open: this.open }
        });
    }
}

export default ESLCollapsible;
