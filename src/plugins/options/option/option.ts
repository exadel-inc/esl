import {attr, boolAttr, ESLBaseElement} from '@exadel/esl/modules/esl-base-element/core';
import {bind} from '@exadel/esl/modules/esl-utils/decorators/bind';
import {ESLImage} from '@exadel/esl/modules/esl-image/core';

export type OptionConfig = {
    attribute: string;
    iconConfig: OptionIconConfig;
    canActivate?: () => boolean;
};

export type OptionIconConfig = {
    iconUrl: string;
    activeIconUrl?: string;
};

export class UIPOption extends ESLBaseElement {
    static is = 'uip-option';
    @attr() public attribute: string;
    @boolAttr() public active: boolean;
    protected icon: ESLImage;
    protected iconConfig: OptionIconConfig;

    static create(optionConfig: OptionConfig): UIPOption {
        const option = document.createElement('uip-option') as UIPOption;
        option.iconConfig = optionConfig.iconConfig;
        option.icon = document.createElement('esl-image');
        option.icon.mode = 'inner-svg';
        option.icon.dataset.src = option.iconConfig.iconUrl;
        option.setAttribute('attribute', optionConfig.attribute);

        return option;
    }

    protected connectedCallback(): void {
        super.connectedCallback();
        this.render();
    }

    protected render() {
        this.icon && this.append(this.icon);
    }

    public toggleState(force?: boolean) {
        this.active = force === undefined ? !this.active : force;
        if (this.iconConfig.activeIconUrl) {
            this.icon.dataset.src = this.active ? this.iconConfig.activeIconUrl : this.iconConfig.iconUrl;
        }
    }
}
