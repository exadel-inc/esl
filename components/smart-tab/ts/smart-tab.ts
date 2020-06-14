import {afterNextRender} from '../../smart-utils/async/raf';
import {CollapsibleActionParams, SmartCollapsible} from "../../smart-collapsible/ts/smart-collapsible";
import {SmartMediaQuery} from "../../smart-utils/conditions/smart-media-query";

export interface TabActionParams extends CollapsibleActionParams {
}

export class SmartTab extends SmartCollapsible {
    public static is = 'smart-tab';
    public static eventNs = 'esl:tab';
    protected static initialParams = {silent: true, force: true, noAnimation: true};

    private _transformationQuery: SmartMediaQuery;

    get transformationQuery() {
        if (!this._transformationQuery && this._transformationQuery !== null) {
            const query = this.getAttribute('accordion-transformation');
            this._transformationQuery = query ? new SmartMediaQuery(query) : null;
        }
        return this._transformationQuery;
    }

    public isAccordion() {
        if (this.transformationQuery) return this.transformationQuery.matches;
        return false;
    }

    protected onAnimate(action: string, params: TabActionParams) {
        let from;
        let to = action === 'hide' ? 0 : this.initialHeight;

        if (!this.isAccordion()) {
            const previousTab = params && params.previousPopup as SmartTab;
            const previousHeight = previousTab ? previousTab.initialHeight : 0;
            from = action === 'hide' ? this.initialHeight : previousHeight;
            this.classList.remove('accordion-transformation');
            if (previousHeight > this.initialHeight) {
                this.style.setProperty('height', `${previousHeight}px`);
            }
        } else {
            from = action === 'hide' ? this.initialHeight : 0;
            this.classList.add('accordion-transformation');
        }

        // set initial height
        this.style.setProperty('max-height', `${from}px`);
        // make sure that browser apply initial height for animation
        afterNextRender(() => {
            // class
            this.style.setProperty('max-height', `${to}px`);
        });
    }

    protected afterAnimate() {
        this.style.removeProperty('height');
        super.afterAnimate();
    }
}