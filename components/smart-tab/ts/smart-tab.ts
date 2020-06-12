import {afterNextRender} from '../../smart-utils/async/raf';
import {CollapsibleActionParams, SmartCollapsible} from "../../smart-collapsible/ts/smart-collapsible";

export interface TabActionParams extends CollapsibleActionParams {
}

export class SmartTab extends SmartCollapsible {
    public static is = 'smart-tab';
    public static eventNs = 'esl:tab';
    protected static initialParams = {silent: true, force: true, noAnimation: true};

    protected onAnimate(action: string, params: TabActionParams) {
        const previousTab = params && params.previousPopup as SmartTab;
        const previousHeight = previousTab ? previousTab.initialHeight : 0;
        const from = action === 'hide' ? this.initialHeight : previousHeight;
        let to = action === 'hide' ? 0 : this.initialHeight;

        if (previousHeight > this.initialHeight) {
            this.style.setProperty('height', `${previousHeight}px`);
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