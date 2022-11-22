import {boolAttr, listen, prop, ready} from '../../../../src/modules/esl-utils/decorators';
import {ESLToggleable} from '../../../../src/modules/esl-toggleable/core/esl-toggleable';
import {ESLMediaQuery} from '../../../../src/modules/esl-media-query/core/esl-media-query';

import type {ESLToggleableActionParams} from '../../../../src/modules/esl-toggleable/core/esl-toggleable';

interface SidebarActionParams extends ESLToggleableActionParams {
  /** Change state without animation */
  immediate: boolean;
}

export class ESLDemoSidebar extends ESLToggleable {
  static is = 'esl-d-sidebar';

  @prop() public closeOnEsc = true;
  @prop() public closeOnOutsideAction = true;

  @prop() public submenus: string = '.sidebar-nav-secondary';
  @prop() public secondarySubmenus: string = '.sidebar-nav-third';
  @prop() public activeMenuAttr: string = 'data-open';

  @boolAttr({name: 'animation'}) protected _animation: boolean;

  public get $submenus(): ESLToggleable[] {
    return Array.from(this.querySelectorAll(this.submenus));
  }

  public get $secondarySubmenus(): ESLToggleable[] {
    return Array.from(this.querySelectorAll(this.secondarySubmenus));
  }

  protected get isDesktop(): boolean {
    return ESLMediaQuery.for('@+MD').matches;
  }

  protected get isStoredOpen(): boolean {
    return !localStorage.getItem('sidebar-collapsed');
  }

  @ready
  protected connectedCallback(): void {
    super.connectedCallback();
  }

  protected storeState(): void {
    this.open ? localStorage.removeItem('sidebar-collapsed') : localStorage.setItem('sidebar-collapsed', 'true');
  }

  protected setInitialState(): void {
    const initialParams = {force: true, initiator: 'init', immediate: true};

    if (this.isDesktop) {
      this.toggle(this.isStoredOpen, initialParams);
    } else {
      this.show(initialParams);
      this.hide(initialParams);
    }
  }

  public collapseAll(): void {
    this.$submenus.forEach((menu) => menu.hide({activator: this}));
  }

  public expandActive(noAnimate: boolean = false): void {
    const submenus = noAnimate ? this.$submenus.concat(this.$secondarySubmenus) : this.$submenus;
    submenus
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

  @listen({
    event: 'change',
    target: ESLMediaQuery.for('@+MD')
  })
  protected onBreakpointChange(): void {
    this.toggle(this.isDesktop && this.isStoredOpen, {force: true, initiator: 'bpchange', immediate: !this.isDesktop});
  }

  @listen({inherit: true})
  protected _onOutsideAction(e: Event): void {
    if (this.isDesktop) return;
    super._onOutsideAction(e);
  }
}
