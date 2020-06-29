import {attr} from '../../esl-base-element/esl-base-element';
import {afterNextRender} from '../../esl-utils/async/raf';
import {CollapsibleActionParams, SmartCollapsible} from '../../smart-collapsible/ts/smart-collapsible';
import {ESLMediaQuery} from '../../esl-utils/conditions/esl-media-query';

export type TabActionParams = CollapsibleActionParams;

export class SmartTabPanel extends SmartCollapsible {
    public static is = 'smart-tab-panel';
    public static eventNs = 'esl:tabs';
    protected static initialParams = {silent: true, force: true, noAnimation: true};

    @attr({defaultValue: 'accordion'}) public accordionClass: string;
    @attr() public accordionTransformation: string;

    private _accordionTransformationQuery: ESLMediaQuery;

    protected connectedCallback() {
        super.connectedCallback();
        this.onTransformationChange();
    }

    get transformationQuery() {
        if (!this._accordionTransformationQuery) {
            const query = this.accordionTransformation || ESLMediaQuery.NOT_ALL;
            this.transformationQuery = new ESLMediaQuery(query);
        }
        return this._accordionTransformationQuery;
    }

    set transformationQuery(query) {
        if (this._accordionTransformationQuery) {
           this._accordionTransformationQuery.removeListener(this.onTransformationChange);
        }
        this._accordionTransformationQuery = query;
        this._accordionTransformationQuery.addListener(this.onTransformationChange);
    }

    get isAccordion() {
        return this.transformationQuery.matches;
    }

    protected onAnimate(action: string, params: TabActionParams) {
        let from;
        const to = action === 'hide' ? 0 : this.initialHeight;

        if (this.isAccordion) {
            from = action === 'hide' ? this.initialHeight : 0;
        } else {
            const previousTab = params && params.previousPopup as SmartTabPanel;
            const previousHeight = previousTab ? previousTab.initialHeight : 0;
            from = action === 'hide' ? this.initialHeight : previousHeight;

            // To animate max-height when the previous tab's height is smaller than the selected one
            if (previousHeight > this.initialHeight) {
                this.style.setProperty('height', `${previousHeight}px`);
            }
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

    protected onTransformationChange = () => this.classList.toggle(this.accordionClass, this.isAccordion);
}
