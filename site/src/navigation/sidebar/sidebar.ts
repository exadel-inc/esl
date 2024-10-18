import {boolAttr, listen, prop, ready} from '@exadel/esl/modules/esl-utils/decorators';
import {ESLToggleable} from '@exadel/esl/modules/esl-toggleable/core/esl-toggleable';
import {ESLMediaQuery} from '@exadel/esl/modules/esl-media-query/core/esl-media-query';

import type {ESLToggleableActionParams} from '@exadel/esl/modules/esl-toggleable/core/esl-toggleable';

interface SidebarActionParams extends ESLToggleableActionParams {
  /** Change state without animation */
  immediate: boolean;
}

export class ESLDemoSidebar extends ESLToggleable {
  static override is = 'esl-d-sidebar';

  @prop() public override closeOnEsc = true;
  @prop() public override closeOnOutsideAction = true;

  @prop() public submenus: string = 'esl-panel';
  @prop() public activeMenuAttr: string = 'data-open';

  @boolAttr({name: 'animation'}) protected _animation: boolean;

  public get $submenus(): ESLToggleable[] {
    return Array.from(this.querySelectorAll(this.submenus));
  }

  @ready
  protected override connectedCallback(): void {
    super.connectedCallback();
  }

  protected storeState(): void {
    this.open ? localStorage.removeItem('sidebar-collapsed') : localStorage.setItem('sidebar-collapsed', 'true');
  }

  protected override setInitialState(): void {
    const isDesktop = ESLMediaQuery.for('@+MD').matches;
    const isStoredOpen = !localStorage.getItem('sidebar-collapsed');
    this.toggle(isDesktop && isStoredOpen, {force: true, initiator: 'init', immediate: true});
  }

  public collapseAll(): void {
    this.$submenus.forEach((menu) => menu.hide({activator: this}));
  }

  public expandActive(noAnimate: boolean = false): void {
    const $open = this.$submenus.filter((menu) => menu.hasAttribute('data-open'));
    const $children = $open.filter((menu) => !!menu.parentElement?.closest(this.submenus));
    const $roots = $open.filter((menu) => !$children.includes(menu));

    // TODO: fix order on ESLPanel level
    $children.forEach(($menu) => $menu.show({noAnimate: true, activator: this}));
    $roots.forEach(($menu) => $menu.show({noAnimate, activator: this}));
  }

  protected override updateA11y(): void {
    const targetEl = this.$a11yTarget;
    if (!targetEl) return;
    targetEl.setAttribute('aria-expanded', String(this.open));
  }

  protected override onShow(params: SidebarActionParams): void {
    this._animation = !params.immediate;
    super.onShow(params);
    this.expandActive(params.initiator === 'init');
    if (params.activator && params.activator.hasAttribute('data-store')) {
      this.storeState();
    }
  }
  protected override onHide(params: SidebarActionParams): void {
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
  protected onBreakpointChange({matches: isDesktop}: MediaQueryListEvent): void {
    const isStoredOpen = !localStorage.getItem('sidebar-collapsed');
    this.toggle(isDesktop && isStoredOpen, {force: true, initiator: 'bpchange', immediate: !isDesktop});
  }

  @listen({inherit: true})
  protected override _onOutsideAction(e: Event): void {
    if (ESLMediaQuery.for('@+MD').matches) return;
    super._onOutsideAction(e);
  }
}
