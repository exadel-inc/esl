import {attr, boolAttr, ESLBaseElement} from '@exadel/esl/modules/esl-base-element/core';
import {ESLImage} from '@exadel/esl/modules/esl-image/core';

export type OptionConfig = {
    attribute: string;
    iconUrl: string;
    canActivate?: () => boolean;
};

export class UIPOption extends ESLBaseElement {
    static is = 'uip-option';
    @attr() public attribute: string;
    @boolAttr() public active: boolean;
    protected icon: ESLImage;

    static create(optionConfig: OptionConfig): UIPOption {
        const option = document.createElement('uip-option') as UIPOption;
        option.icon = document.createElement('esl-image');
        option.icon.mode = 'inner-svg';
        option.icon.dataset.src = optionConfig.iconUrl;
        option.setAttribute('attribute', optionConfig.attribute);

        return option;
    }

    protected connectedCallback(): void {
        super.connectedCallback();
        this.classList.add(`${this.attribute}-option`);
        this.render();
    }

    protected render() {
        this.icon && this.append(this.icon);
    }

    public toggleState(force?: boolean) {
        this.active = force === undefined ? !this.active : force;
        this.classList.toggle('active', this.active);
    }
}
