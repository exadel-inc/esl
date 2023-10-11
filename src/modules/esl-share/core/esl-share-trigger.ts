import {attr, jsonAttr} from '../../esl-utils/decorators';
import {ESLTraversingQuery} from '../../esl-traversing-query/core';
import {ESLTrigger} from '../../esl-trigger/core';
import {ESLSharePopup} from './esl-share-popup';

import type {ESLToggleable, ESLToggleableActionParams} from '../../esl-toggleable/core/esl-toggleable';
import type {ESLSharePopupActionParams} from './esl-share-popup';

/**
 * ESLShareTrigger component
 * @author Dmytro Shovchko
 *
 * ESLShareTrigger is a component that allows triggering {@link ESLSharePopup} instance state changes.
 */
export class ESLShareTrigger extends ESLTrigger {
  public static override is = 'esl-share-trigger';

  /**
   * List of social networks or groups of them to display (all by default).
   * The value - a string containing the names of the buttons or groups (specified with
   * the prefix `group:`) separated by spaces.
   * @example "facebook reddit group:default"
   * */
  @attr({defaultValue: 'all'}) public list: string;
  /** Hover event tracking media query. Default: `all` */
  @attr({defaultValue: 'all'}) public override trackHover: string;

  /** Default initial params to pass into the popup */
  @jsonAttr<ESLSharePopupActionParams>({defaultValue: {
    position: 'top',
    hideDelay: 220
  }}) public popupInitialParams: ESLSharePopupActionParams;

  /** Target observable Toggleable */
  public override get $target(): ESLToggleable | null {
    return ESLSharePopup.sharedInstance;
  }
  public override set $target(value: any) {}

  /** Checks that the target is in active state */
  public override get isTargetActive(): boolean {
    return !!this.$target?.open && this.$target?.activator === this;
  }

  /** The text writing directionality of the element */
  protected get currentDir(): string {
    return getComputedStyle(this).direction;
  }

  /** The base language of the element */
  protected get currentLang(): string {
    const el = this.closest('[lang]');
    return (el) ? (el as HTMLElement).lang : '';
  }

  /** Container element that defines bounds of popups visibility */
  protected get $containerEl(): HTMLElement | undefined {
    const container = this.getClosestRelatedAttr('container');
    return container ? ESLTraversingQuery.first(container, this) as HTMLElement : undefined;
  }

  /** Update `$target` Toggleable  from `target` selector */
  public override updateTargetFromSelector(): void {}

  /** Gets attribute value from the closest element with group behavior settings */
  protected getClosestRelatedAttr(attrName: string): string | null {
    const relatedAttrName = `${this.baseTagName}-${attrName}`;
    const $closest = this.closest(`[${relatedAttrName}]`);
    return $closest ? $closest.getAttribute(relatedAttrName) : null;
  }

  /** Merges params to pass to the toggleable */
  protected override mergeToggleableParams(this: ESLShareTrigger, ...params: ESLSharePopupActionParams[]): ESLSharePopupActionParams {
    return Object.assign({
      initiator: 'share',
      activator: this,
      containerEl: this.$containerEl,
      list: this.list,
      dir: this.currentDir,
      lang: this.currentLang
    }, this.popupInitialParams, ...params);
  }

  /** Shows popup with passed params */
  public override showTarget(params: ESLToggleableActionParams = {}): void {
    const actionParams = this.mergeToggleableParams({}, params);
    if (ESLSharePopup.open) this.hideTarget();
    ESLSharePopup.show(actionParams);
  }

  /** Hides popup with passed params */
  public override hideTarget(params: ESLToggleableActionParams = {}): void {
    const actionParams = this.mergeToggleableParams({}, params);
    ESLSharePopup.hide(actionParams);
  }
}

declare global {
  export interface ESLLibrary {
    ShareTrigger: typeof ESLShareTrigger;
  }
  export interface HTMLElementTagNameMap {
    'esl-share-trigger': ESLShareTrigger;
  }
}
