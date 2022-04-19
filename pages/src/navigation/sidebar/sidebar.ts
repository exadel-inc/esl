import {attr} from '../../../../src/modules/esl-utils/decorators/attr';
import {prop} from '../../../../src/modules/esl-utils/decorators/prop';
import {bind} from '../../../../src/modules/esl-utils/decorators/bind';
import {ready} from '../../../../src/modules/esl-utils/decorators/ready';
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
  @prop() public activeMenuAttr: string = 'data-open';

  @attr({name: 'animation'}) protected _animation: boolean;

  public get $submenus(): ESLToggleable[] {
    return Array.from(this.querySelectorAll(this.submenus));
  }

  @ready
  protected connectedCallback(): void {
    super.connectedCallback();
    ESLMediaQuery.for('@+MD').addListener(this.onBreakpointChange);
  }
  protected disconnectedCallback(): void {
    super.disconnectedCallback();
    ESLMediaQuery.for('@+MD').removeListener(this.onBreakpointChange);
  }

  protected storeState(): void {
    this.open ? localStorage.removeItem('sidebar-collapsed') : localStorage.setItem('sidebar-collapsed', 'true');
  }

  protected setInitialState(): void {
    const isDesktop = ESLMediaQuery.for('@+MD').matches;
    const isStoredOpen = !localStorage.getItem('sidebar-collapsed');
    this.toggle(isDesktop && isStoredOpen, {force: true, initiator: 'init', immediate: true});
  }

  public collapseAll(): void {
    this.$submenus.forEach((menu) => menu.hide({activator: this}));
  }

  public expandActive(noAnimate: boolean = false): void {
    this.$submenus
      .filter((menu) => menu.hasAttribute('data-open'))
      .forEach((menu) => menu.show({noAnimate, activator: this}));
  }

  protected updateA11y(): void {
    const targetEl = this.$a11yTarget;
    if (!targetEl) return;
    targetEl.setAttribute('aria-expanded', String(this.open));
  }

  protected onShow(params: SidebarActionParams): void {
    this._animation = !params.immediate;
    super.onShow(params);
    this.expandActive(params.initiator === 'init');
    if (params.activator && params.activator.hasAttribute('data-store')) {
      this.storeState();
    }
  }
  protected onHide(params: SidebarActionParams): void {
    this._animation = !params.immediate;
    super.onHide(params);
    this.collapseAll();
    if (params.activator && params.activator.hasAttribute('data-store')) {
      this.storeState();
    }
  }

  @bind
  protected onBreakpointChange(): void {
    const isDesktop = ESLMediaQuery.for('@+MD').matches;
    const isStoredOpen = !localStorage.getItem('sidebar-collapsed');
    this.toggle(isDesktop && isStoredOpen, {force: true, initiator: 'bpchange', immediate: !isDesktop});
  }

  @bind
  protected _onOutsideAction(e: Event): void {
    if (ESLMediaQuery.for('@+MD').matches) return;
    super._onOutsideAction(e);
  }
}
