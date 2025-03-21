import {ExportNs} from '../../esl-utils/environment/export-ns';
import {ESLBaseElement} from '../../esl-base-element/core';
import {isEqual} from '../../esl-utils/misc/object/compare';
import {attr, boolAttr, listen, memoize, prop} from '../../esl-utils/decorators';
import {ESLShareButton} from './esl-share-button';
import {ESLShareConfig} from './esl-share-config';

import type {ESLShareButtonConfig} from './esl-share-config';

export type {ESLShareListTagShape} from './esl-share-list.shape';

/**
 * ESLShareList
 * @author Dmytro Shovchko
 *
 * ESLShareList is a custom element to dynamically draw {@link ESLShareButton}s using simplified shared config
 */
@ExportNs('ShareList')
export class ESLShareList extends ESLBaseElement {
  public static override is = 'esl-share-list';
  public static observedAttributes = ['list'];

  /** Register {@link ESLShareList} component and dependent {@link ESLShareButton} */
  public static override register(): void {
    ESLShareButton.register();
    super.register();
  }

  /** Event to dispatch on change of {@link ESLShareList} */
  @prop('esl:share:changed') public SHARE_CHANGED_EVENT: string;
  /** Event to dispatch on {@link ESLShareList} ready state */
  @prop('esl:share:ready') public SHARE_READY_EVENT: string;

  /**
   * List of social networks or groups of them to display (all by default).
   * The value - a string containing the names of the buttons or groups (specified with
   * the prefix group:) separated by spaces.
   * @example "facebook reddit group:default"
   * */
  @attr({defaultValue: 'all'}) public list: string;

  /** @readonly Ready state marker */
  @boolAttr({readonly: true}) public ready: boolean;

  /** @returns config of buttons specified by the list attribute */
  @memoize()
  public get buttonsConfig(): ESLShareButtonConfig[] {
    return ESLShareConfig.instance.get(this.list);
  }

  protected override attributeChangedCallback(attrName: string, oldVal: string, newVal: string): void {
    if (!this.connected || oldVal === newVal) return;
    this.update();
  }

  protected override connectedCallback(): void {
    super.connectedCallback();
    this.init();
  }

  /** Initializes the component */
  protected init(force?: boolean): void {
    if (this.ready && !force) return;
    this.buildContent();
    this.onReady();
  }

  /** Updates the component if the buttons config was changed */
  protected update(): void {
    const {buttonsConfig} = this;
    memoize.clear(this, 'buttonsConfig');
    if (isEqual(this.buttonsConfig, buttonsConfig)) return;
    this.init(true);
  }

  /** Appends buttons to the component. */
  protected buildContent(): void {
    this.innerHTML = '';
    this.buttonsConfig.forEach((cfg) => {
      const btn = ESLShareButton.create(cfg.name);
      btn && this.appendChild(btn);
    });
  }

  /** Actions on complete init and ready component. */
  private onReady(): void {
    if (this.ready) return;
    this.$$attr('ready', true);
    this.$$fire(this.SHARE_READY_EVENT, {bubbles: false});
  }

  @listen({event: 'change', target: ESLShareConfig.instance})
  protected _onConfigChange(): void {
    this.update();
    this.$$fire(this.SHARE_CHANGED_EVENT, {bubbles: false});
  }
}

declare global {
  export interface ESLLibrary {
    ShareList: typeof ESLShareList;
  }
  export interface HTMLElementTagNameMap {
    'esl-share-list': ESLShareList;
  }
}
