import {ExportNs} from '../../esl-utils/enviroment/export-ns';
import {attr} from '../../esl-base-element/esl-base-element';
import {afterNextRender} from '../../esl-utils/async/raf';
import {CSSUtil} from '../../esl-utils/dom/styles';
import {ESLMediaQuery} from '../../esl-utils/conditions/esl-media-query';
import {CollapsibleActionParams, ESLCollapsible} from '../../esl-collapsible/ts/esl-collapsible';

export type TabActionParams = CollapsibleActionParams;

@ExportNs('TabPanel')
export class ESLTabPanel extends ESLCollapsible {
    public static is = 'esl-tab-panel';
    public static eventNs = 'esl:tab-panel';

    protected static initialParams: TabActionParams =
        Object.assign({noAnimation: true}, ESLCollapsible.initialParams);

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

    protected getPrevHeight(params: TabActionParams) {
        const previousTab = params && params.previousPopup as ESLTabPanel;
        return previousTab ? previousTab.initialHeight : 0;
    }

    protected onAnimate(action: string, params: TabActionParams) {
        const to = action === 'hide' ? 0 : this.initialHeight;
        const from = action === 'hide' ? this.initialHeight : (this.isAccordion ? 0 : this.getPrevHeight(params));


        // To animate max-height when the previous tab's height is smaller than the selected one
        if (from > to) {
            this.style.setProperty('height', `${from}px`);
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

    protected onTransformationChange = () => CSSUtil.toggleClassesTo(this, this.accordionClass, this.isAccordion);
}

export default ESLTabPanel;