import {ESLBasePopup} from './esl-base-popup';
import {bind} from '../../esl-utils/decorators/bind';
import {ExportNs} from '../../esl-utils/environment/export-ns';
import {memoize} from '../../esl-utils/decorators/memoize';
import {EventUtils} from '../../esl-utils/dom/events';

@ExportNs('BasePopupGroupManager')
export class ESLBasePopupGroupManager {

  @memoize()
  public static get instance() {
    return new ESLBasePopupGroupManager();
  }

  public static init(root: HTMLElement = document.body) {
    const instance = ESLBasePopupGroupManager.instance;
    instance.root = root;
  }

  protected _root: HTMLElement;
  protected _popups: Map<string, ESLBasePopup> = new Map<string, ESLBasePopup>();

  public get root(): HTMLElement {
    return this._root;
  }
  public set root(root: HTMLElement) {
    if (this._root) this.unbindEvents();
    this._root = root;
    if (this._root) this.bindEvents();
  }

  protected bindEvents() {
    this.root.addEventListener('esl:before:show', this.onBeforeShow);

    this.root.addEventListener('esl:show', this.onShow);
    this.root.addEventListener('esl:hide', this.onHide);

    this.root.addEventListener('esl:change:group', this.onChangeGroup);
  }

  protected unbindEvents() {
    this.root.removeEventListener('esl:before:show', this.onBeforeShow);

    this.root.removeEventListener('esl:show', this.onShow);
    this.root.removeEventListener('esl:hide', this.onHide);

    this.root.removeEventListener('esl:change:group', this.onChangeGroup);
  }

  protected isAcceptable(target: any): target is ESLBasePopup {
    if (!(target instanceof ESLBasePopup)) return false;
    return !!target.groupName;
  }

  /** Hide active popup in group */
  public hide(groupName: string) {
    this.get(groupName)?.hide();
  }

  /** Set active popup in group */
  public set(groupName: string, popup: ESLBasePopup) {
    if (!groupName) return;
    this.hide(groupName);
    this._popups.set(groupName, popup);
  }

  /** Get active popup in group or undefined if group doesn't exist */
  public get(groupName: string): ESLBasePopup | undefined {
    return this._popups.get(groupName);
  }

  /** Delete popup from the group if passed popup is currently active */
  public delete(groupName: string, popup: ESLBasePopup) {
    if (this.get(groupName) !== popup) return;
    this._popups.delete(groupName);
  }

  /** Hide active popup before e.target (popup) will be shown */
  @bind
  protected onBeforeShow(e: CustomEvent) {
    const target = EventUtils.source(e);
    if (!this.isAcceptable(target)) return;
    this.hide(target.groupName);
  }

  /** Update active popup after a new popup is shown */
  @bind
  protected onShow(e: CustomEvent) {
    const target = EventUtils.source(e);
    if (!this.isAcceptable(target)) return;

    this.set(target.groupName, target);
  }

  /** Update group state after active popup is hidden */
  @bind
  protected onHide(e: CustomEvent) {
    const target = EventUtils.source(e);
    if (!this.isAcceptable(target)) return;

    this.delete(target.groupName, target);
  }

  /** Update active popups */
  @bind
  protected onChangeGroup(e: CustomEvent) {
    const target = EventUtils.source(e);
    if (!this.isAcceptable(target)) return;

    const {oldGroupName, newGroupName} = e.detail;
    this.delete(oldGroupName, target);
    this.set(newGroupName, target);
  }
}
