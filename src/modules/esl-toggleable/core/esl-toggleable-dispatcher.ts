import {ESLToggleable} from './esl-toggleable';
import {ESLBaseElement} from '../../esl-base-element/core';
import {bind} from '../../esl-utils/decorators/bind';
import {EventUtils} from '../../esl-utils/dom/events';
import {ExportNs} from '../../esl-utils/environment/export-ns';

@ExportNs('ToggleableGroupDispatcher')
export class ESLToggleableDispatcher extends ESLBaseElement {
  public static readonly is = 'esl-toggleable-dispatcher';

  /**
   * Initialize ToggleableGroupDispatcher
   * Uses esl-toggleable-dispatcher tag and document body root by default
   */
  public static init(root: HTMLElement = document.body, tagName: string = this.is) {
    if (!root) throw new Error('Root element should be specified');
    const instances = root.getElementsByTagName(tagName);
    if (instances.length) return;
    this.register(tagName);
    root.insertAdjacentElement('afterbegin', document.createElement(tagName));
  }

  protected _root: HTMLElement | null;
  protected _popups: Map<string, ESLToggleable> = new Map<string, ESLToggleable>();

  protected connectedCallback() {
    super.connectedCallback();
    this.root = this.parentElement;
  }
  protected disconnectedCallback() {
    super.disconnectedCallback();
    this.root = null;
  }

  protected bindEvents() {
    if (!this.root) return;
    this.root.addEventListener('esl:before:show', this._onBeforeShow);
    this.root.addEventListener('esl:show', this._onShow);
    this.root.addEventListener('esl:hide', this._onHide);
    this.root.addEventListener('esl:change:group', this._onChangeGroup);
  }
  protected unbindEvents() {
    if (!this.root) return;
    this.root.removeEventListener('esl:before:show', this._onBeforeShow);
    this.root.removeEventListener('esl:show', this._onShow);
    this.root.removeEventListener('esl:hide', this._onHide);
    this.root.removeEventListener('esl:change:group', this._onChangeGroup);
  }

  /** Observed element */
  public get root(): HTMLElement | null {
    return this._root;
  }
  public set root(root: HTMLElement | null) {
    this.unbindEvents();
    this._root = root;
    this.bindEvents();
  }

  /** Guard-condition for targets */
  protected isAcceptable(target: any): target is ESLToggleable {
    if (!(target instanceof ESLToggleable)) return false;
    return !!target.groupName;
  }

  /** Hide active element in group */
  public hideActive(groupName: string) {
    this.getActive(groupName)?.hide();
  }

  /** Set active element in group */
  public setActive(groupName: string, popup: ESLToggleable) {
    if (!groupName) return;
    this.hideActive(groupName);
    this._popups.set(groupName, popup);
  }

  /** Get active element in group or undefined if group doesn't exist */
  public getActive(groupName: string): ESLToggleable | undefined {
    return this._popups.get(groupName);
  }

  /** Delete element from the group if passed element is currently active */
  public deleteActive(groupName: string, popup: ESLToggleable) {
    if (this.getActive(groupName) !== popup) return;
    this._popups.delete(groupName);
  }

  /** Hide active element before e.target will be shown */
  @bind
  protected _onBeforeShow(e: CustomEvent) {
    const target = EventUtils.source(e);
    if (!this.isAcceptable(target)) return;
    this.hideActive(target.groupName);
  }

  /** Update active element after a new element is shown */
  @bind
  protected _onShow(e: CustomEvent) {
    const target = EventUtils.source(e);
    if (!this.isAcceptable(target)) return;

    this.setActive(target.groupName, target);
  }

  /** Update group state after active element is hidden */
  @bind
  protected _onHide(e: CustomEvent) {
    const target = EventUtils.source(e);
    if (!this.isAcceptable(target)) return;

    this.deleteActive(target.groupName, target);
  }

  /** Update active elements */
  @bind
  protected _onChangeGroup(e: CustomEvent) {
    const target = EventUtils.source(e);
    if (!this.isAcceptable(target)) return;

    const {oldGroupName, newGroupName} = e.detail;
    this.deleteActive(oldGroupName, target);
    this.setActive(newGroupName, target);
  }
}
