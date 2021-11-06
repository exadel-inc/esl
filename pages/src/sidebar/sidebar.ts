import {prop} from '../../../src/modules/esl-utils/decorators/prop';
import {bind} from '../../../src/modules/esl-utils/decorators/bind';
import {attr} from '../../../src/modules/esl-base-element/decorators/attr';
import {ready} from '../../../src/modules/esl-utils/decorators/ready';
import {ESLToggleable} from '../../../src/modules/esl-toggleable/core/esl-toggleable';
import {ESLMediaQuery} from '../../../src/modules/esl-media-query/core/esl-media-query';

import type {ToggleableActionParams} from '../../../src/modules/esl-toggleable/core/esl-toggleable';

interface SidebarActionParams extends ToggleableActionParams {
  immediate: boolean;
}

export class ESLSidebar extends ESLToggleable {
  static is = 'esl-sidebar';

  @prop() public closeOnEsc: boolean = true;
  @prop() public submenus: string = '.sb-dropdown-content';

  @attr({name: 'animation'}) protected _animation: boolean;

  public get $submenus(): ESLToggleable[] {
    return Array.from(this.querySelectorAll(this.submenus));
  }

  @ready
  protected connectedCallback() {
    super.connectedCallback();
    ESLMediaQuery.for('@+MD').addListener(this.onBreakpointChange);
  }
  protected disconnectedCallback() {
    super.disconnectedCallback();
    ESLMediaQuery.for('@+MD').removeListener(this.onBreakpointChange);
  }

  protected setInitialState() {
    const shouldActivate = ESLMediaQuery.for('@+MD').matches;
    this.toggle(shouldActivate, {force: true, initiator: 'init', immediate: true});
  }

  protected onShow(params: SidebarActionParams) {
    this._animation = !params.immediate;
    super.onShow(params);
    this.expandActive(params.initiator === 'init');
  }
  protected onHide(params: SidebarActionParams) {
    this._animation = !params.immediate;
    super.onHide(params);
    this.collapseAll();
  }

  @bind
  protected onBreakpointChange() {
    const shouldActivate = ESLMediaQuery.for('@+MD').matches;
    this.toggle(shouldActivate, {initiator: 'bpchange'});
  }

  public collapseAll() {
    this.$submenus.forEach((menu) => menu.hide({activator: this}));
  }

  public expandActive(noCollapse: boolean = false) {
    this.$submenus
      .filter((menu) => !!menu.querySelector('.nav-dropdown-item-selected'))
      .forEach((menu) => menu.show({noCollapse, activator: this}));
  }

  protected updateA11y() {
    const targetEl = this.$a11yTarget;
    if (!targetEl) return;
    targetEl.setAttribute('aria-expanded', String(this.open));
  }
}
ESLSidebar.register();
