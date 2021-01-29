import {ESLBasePopup} from './esl-base-popup';
import {bind} from '../../esl-utils/decorators/bind';
import {ExportNs} from '../../esl-utils/environment/export-ns';

const popups = new Map<string, ESLBasePopup>(); // name of group and active popup

let rootEl: HTMLElement;
let instance: ESLBasePopupGroupManager;


@ExportNs('BasePopupGroupManager')
export class ESLBasePopupGroupManager {

  public static init(root: HTMLElement = document.body) {
    rootEl = root;
    return instance ? instance : new ESLBasePopupGroupManager();
  }

  constructor() {
    this.bindEvents();
  }

  protected bindEvents() {
    rootEl.addEventListener('before:show', this.onBeforeShow);
    rootEl.addEventListener('before:hide', this.onBeforeHide);

    rootEl.addEventListener('show', this.onShow);
    rootEl.addEventListener('hide', this.onHide);

    rootEl.addEventListener('change:group', this.onChangeGroup);
  }

  /**
   * Hide active popup in group
   */
  public hide(groupName: string): boolean {
    if (!popups.has(groupName)) return false;
    popups.get(groupName)?.hide();
    return true;
  }

  /**
   * Set active popup in group
   */
  public set(groupName: string, popup: ESLBasePopup): boolean {
    if (!groupName) return false;
    popups.get(groupName)?.hide();
    popups.set(groupName, popup);
    return true;
  }

  /**
   * Get active popup in group or undefined if group doesn't exist
   */
  public get(groupName: string): ESLBasePopup | undefined {
    return popups.get(groupName);
  }

  /**
   * Delete popup in group if this popup is active
   */
  public delete(groupName: string, popup: ESLBasePopup): boolean {
    if (popups.get(groupName) !== popup) return false;
    popups.delete(groupName);
    return true;
  }

  /**
   *  Hide active popup before e.target (popup) will be shown
   */
  @bind
  protected onBeforeShow(e: CustomEvent) {
    const target = e.target;
    if (!(target instanceof ESLBasePopup)) return true;

    this.hide(target.groupName);

    return true;
  }

  @bind
  protected onBeforeHide(e: CustomEvent) {
    return true;
  }

  /**
   *  Update group state after a new popup is shown
   */
  @bind
  protected onShow(e: CustomEvent) {
    const target = e.target;
    if (!(target instanceof ESLBasePopup)) return true;

    const groupName = target.groupName;
    if (!groupName) return true;

    this.set(groupName, target);
    return true;
  }

  /**
   *  Update group state after active popup is hidden
   */
  @bind
  protected onHide(e: CustomEvent) {
    const target = e.target;
    if (!(target instanceof ESLBasePopup)) return true;

    this.delete(target.groupName, target);
    return true;
  }

  /**
   *  Update active popups
   */
  @bind
  protected onChangeGroup(e: CustomEvent) {
    const target = e.target;
    if (!(target instanceof ESLBasePopup)) return true;

    const {oldGroupName, newGroupName} = e.detail;
    this.delete(oldGroupName, target);
    this.set(newGroupName, target);
  }
}
