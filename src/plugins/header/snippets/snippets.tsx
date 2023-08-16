import {memoize} from '@exadel/esl/modules/esl-utils/decorators/memoize';
import {listen} from '@exadel/esl/modules/esl-utils/decorators/listen';

import {UIPPlugin} from '../../../core/base/plugin';
import {SnippetTemplate} from '../../../core/base/model';
import {UIPOptionIcons} from '../options/OptionIcons';

import * as React from 'jsx-dom';

/**
 * Snippets {@link UIPPlugin} custom element definition
 * Container class for snippets (component's templates)
 * @extends UIPPlugin
 */
export class UIPSnippets extends UIPPlugin {
  public static is = 'uip-snippets';
  /** CSS Class for snippets list item */
  public static LIST_ITEM = 'snippets-list-item';
  /** CSS Class added to active snippet */
  public static ACTIVE_ITEM = 'active';
  /** Index of current snippet list item */
  public currentIndex: number;

  /** Active snippet title */
  @memoize()
  protected get $title() {
    return <span className="snippets-title"></span>;
  }

  /** Snippets list from dropdown element*/
  @memoize()
  public get $items(): HTMLElement[] {
    const items = this.querySelectorAll(`.${UIPSnippets.LIST_ITEM}`);
    return Array.from(items) as HTMLElement[];
  }

  protected connectedCallback() {
    super.connectedCallback();
    this.render();
    // Initial update
    setTimeout(() => this.$active = this.$active || this.$items[0]);
  }

  protected disconnectedCallback() {
    super.disconnectedCallback();
  }

  /**
   * Handles `mouseup` event to
   * manage dropdown open state
   */
  @listen({event: 'mouseup', target: document.body})
  protected onOutsideAction(e: Event) {
    if (!this.classList.contains('dropdown-open')) return;
    const target = e.target as HTMLElement;
    if (this.contains(target)) return false;
    this.toggleDropdown();
  }

  /** Active snippet element */
  public get $active(): HTMLElement | null {
    return this.$items.find(item => item.classList.contains(UIPSnippets.ACTIVE_ITEM)) || null;
  }
  /** Sets active snippet element */
  public set $active(snippet: HTMLElement | null) {
    this.$items.forEach((item) => item.classList.toggle(UIPSnippets.ACTIVE_ITEM, snippet === item));
    this.updateTitleText();
  }

  /** Initializes snippets layout */
  protected render(): void {
    const snippets = this.model!.snippets;
    if (!snippets.length) return;

    snippets.length > 1
      ?this.appendChild(this.$innerContent(snippets))
      :this.appendChild(this.$title);
  }

  /** Renders dropdown element for a case with multiple snippets */
  protected $innerContent(snippets: SnippetTemplate[]) {

    return <>
      <div className="snippets-dropdown-control">
        {UIPOptionIcons.snippetSVG.cloneNode(true) as HTMLElement}
        {this.$title}
      </div>
      <div className="snippets-dropdown">
        <div className="snippets-dropdown-wrapper">
          <div className="snippets-list esl-scrollable-content">
            {snippets.map((snippet: SnippetTemplate) => this.buildListItem(snippet))}
          </div>
          <esl-scrollbar target="::prev"></esl-scrollbar>
        </div>
      </div>
    </>;
  }

  /** Builds snippets list item */
  protected buildListItem(snippet: SnippetTemplate) {
    const label = snippet.getAttribute('label');
    if (!label) return;

    let className = UIPSnippets.LIST_ITEM;
    if (snippet === this.model?.activeSnippet) {
      className = className.concat(' ', UIPSnippets.ACTIVE_ITEM);
    }
    return <li className={className}>{label}</li>;
  }

  /** Updates dropdown title with the name of active snippet */
  protected updateTitleText(): void {
    if (this.model) {
      this.$title.textContent = `${this.model.activeSnippet.getAttribute('label')}`;
    }
  }

  /** Handles `click` event to manage active snippet */
  @listen({event: 'click', selector: '.snippets-list-item'})
  protected _onItemClick(event: Event) {
    const target = event.target as HTMLElement;
    const index = this.$items.indexOf(target);
    if (index < 0) return;

    this.toggleDropdown();

    if (this.currentIndex !== index && this.model) {
      this.model.applySnippet(this.model.snippets[index], this);
      this.$active = target;
      this.currentIndex = index;
    }
  }

  /**
   * Handles dropdown control `click` event to
   * manage dropdown open state
   */
  @listen({event: 'click', selector: '.snippets-dropdown-control'})
  protected _onDropdownClick() {
    this.toggleDropdown();
  }

  /** Toggles dropdown open state */
  public toggleDropdown(): void {
    this.classList.toggle('dropdown-open');
  }
}
