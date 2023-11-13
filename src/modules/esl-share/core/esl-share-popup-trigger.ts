import {attr, jsonAttr} from '../../esl-utils/decorators';
import {ESLTraversingQuery} from '../../esl-traversing-query/core';
import {ESLTrigger} from '../../esl-trigger/core';
import {ESLSharePopup} from './esl-share-popup';

import type {ESLToggleable} from '../../esl-toggleable/core/esl-toggleable';
import type {ESLSharePopupActionParams} from './esl-share-popup';

/**
 * ESLSharePopupTrigger component
 * @author Dmytro Shovchko
 *
 * ESLSharePopupTrigger is a component that allows triggering {@link ESLSharePopup} instance state changes.
 */
export class ESLSharePopupTrigger extends ESLTrigger {
  public static override is = 'esl-share-popup-trigger';
  public static override observedAttributes = ['list'];

  /** Register {@link ESLSharePopupTrigger} component and dependent {@link ESLSharePopup} */
  public static override register(): void {
    ESLSharePopup.register();
    super.register();
  }

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
    hideDelay: 300
  }})
  public popupInitialParams: ESLSharePopupActionParams;

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

  protected override attributeChangedCallback(attrName: string, oldValue: string | null, newValue: string | null): void {
    if (!this.connected || oldValue === newValue) return;
    this.update();
  }

  /** Updates the component and related popup */
  protected update(): void {
    if (!this.isTargetActive) return;
    this.$target?.hide();
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
  protected override mergeToggleableParams(this: ESLSharePopupTrigger, ...params: ESLSharePopupActionParams[]): ESLSharePopupActionParams {
    return Object.assign({
      initiator: 'share',
      activator: this,
      containerEl: this.$containerEl,
      list: this.list,
      dir: this.currentDir,
      lang: this.currentLang
    }, this.popupInitialParams, ...params);
  }
}

declare global {
  export interface ESLLibrary {
    SharePopupTrigger: typeof ESLSharePopupTrigger;
  }
  export interface HTMLElementTagNameMap {
    'esl-share-popup-trigger': ESLSharePopupTrigger;
  }
}
