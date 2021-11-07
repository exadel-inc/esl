import {prop} from '../../../../src/modules/esl-utils/decorators/prop';
import {bind} from '../../../../src/modules/esl-utils/decorators/bind';
import {ready} from '../../../../src/modules/esl-utils/decorators/ready';
import {attr} from '../../../../src/modules/esl-base-element/decorators/attr';
import {ESLToggleable} from '../../../../src/modules/esl-toggleable/core/esl-toggleable';
import {ESLMediaQuery} from '../../../../src/modules/esl-media-query/core/esl-media-query';

import type {ToggleableActionParams} from '../../../../src/modules/esl-toggleable/core/esl-toggleable';

interface SidebarActionParams extends ToggleableActionParams {
  /** Change state without animation */
  immediate: boolean;
}

export class ESLDemoSidebar extends ESLToggleable {
  static is = 'esl-d-sidebar';

  @prop() public closeOnEsc = true;
  @prop() public closeOnOutsideAction = true;

  @prop() public submenus: string = '.sidebar-nav-secondary';
  @prop() public activeLinkSel: string = '.sidebar-nav-secondary-item.active';

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

  public collapseAll() {
    this.$submenus.forEach((menu) => menu.hide({activator: this}));
  }

  public expandActive(noCollapse: boolean = false) {
    this.$submenus
      .filter((menu) => !!menu.querySelector(this.activeLinkSel))
      .forEach((menu) => menu.show({noCollapse, activator: this}));
  }

  protected updateA11y() {
    const targetEl = this.$a11yTarget;
    if (!targetEl) return;
    targetEl.setAttribute('aria-expanded', String(this.open));
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
    this.toggle(shouldActivate, {initiator: 'bpchange', immediate: !shouldActivate});
  }

  @bind
  protected _onOutsideAction(e: MouseEvent) {
    if (ESLMediaQuery.for('@+MD').matches) return;
    super._onOutsideAction(e);
  }
}
