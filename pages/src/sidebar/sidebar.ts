import {ready} from '../../../src/modules/esl-utils/decorators/ready';
import {ESLToggleable} from '../../../src/modules/esl-toggleable/core/esl-toggleable';
import type {ToggleableActionParams} from '../../../src/modules/esl-toggleable/core/esl-toggleable';
import {prop} from '../../../src/modules/esl-utils/decorators/prop';


export class ESLSidebar extends ESLToggleable {
  static is = 'esl-sidebar';

  @prop() public submenus: string = '.sb-dropdown-content';

  public get $submenus(): ESLToggleable[] {
    return Array.from(this.querySelectorAll(this.submenus));
  }

  @ready
  protected connectedCallback() {
    super.connectedCallback();
  }

  protected onShow(params: ToggleableActionParams) {
    super.onShow(params);
    this.expandActive();
  }
  protected onHide(params: ToggleableActionParams) {
    super.onHide(params);
    this.collapseAll();
  }

  public collapseAll() {
    this.$submenus.forEach((menu) => menu.hide());
  }
  public expandActive() {
    this.$submenus
      .filter((menu) => !!menu.querySelector('.nav-item-selected'))
      .forEach((menu) => menu.show());
  }

  protected updateA11y() {
    const targetEl = this.$a11yTarget;
    if (!targetEl) return;
    targetEl.setAttribute('aria-expanded', String(this.open));
  }
}
ESLSidebar.register();
