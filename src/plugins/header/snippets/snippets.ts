import {memoize} from '@exadel/esl/modules/esl-utils/decorators/memoize';
import {listen} from '@exadel/esl/modules/esl-utils/decorators/listen';
import type {ESLScrollbar} from '@exadel/esl/modules/esl-scrollbar/core';

import {UIPPlugin} from '../../../core/base/plugin';
import {SnippetTemplate} from '../../../core/base/model';

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

  /** Snippets container element */
  @memoize()
  protected get $snippetList(): HTMLElement {
    const $el = document.createElement('div');
    $el.className = 'snippets-list';
    return $el;
  }

  /** Active snippet title */
  @memoize()
  protected get $title(): HTMLElement {
    const $el = document.createElement('span');
    $el.className = 'snippets-title';
    return $el;
  }

  /** Snippets dropdown element */
  @memoize()
  protected get $dropdown(): HTMLElement {
    const $el = document.createElement('div');
    $el.className = 'snippets-dropdown';
    return $el;
  }

  /** Dropdown control element */
  @memoize()
  protected get $dropdownControl(): HTMLElement {
    const $el = document.createElement('div');
    $el.className = 'snippets-dropdown-control';
    return $el;
  }

  /** Dropdown wrapper element */
  @memoize()
  protected get $dropdownWrapper(): HTMLElement {
    const $el = document.createElement('div');
    $el.className = 'snippets-dropdown-wrapper';
    return $el;
  }

  /** Snippets list from dropdown element*/
  @memoize()
  public get $items(): HTMLElement[] {
    const items = this.querySelectorAll(`.${UIPSnippets.LIST_ITEM}`);
    return Array.from(items) as HTMLElement[];
  }

  /** {@link ESLScrollbar} scroll element */
  @memoize()
  public get $scroll(): ESLScrollbar {
    const $scroll = document.createElement('esl-scrollbar');
    $scroll.setAttribute('target', '::prev');
    return $scroll;
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
      ? this.renderDropdown(snippets, this.$title)
      : this.appendChild(this.$title);
  }

  /** Renders dropdown element for a case with multiple snippets */
  protected renderDropdown(snippets: SnippetTemplate[], title: HTMLElement) {

    snippets
      .map((snippet: SnippetTemplate) => this.buildListItem(snippet))
      .forEach((item) => item && this.$snippetList.appendChild(item));

    this.$snippetList.classList.add('esl-scrollable-content');
    this.$dropdownWrapper.appendChild(this.$snippetList);
    this.$scroll && this.$dropdownWrapper.appendChild(this.$scroll);

    this.$dropdownControl.appendChild(title);
    this.appendChild(this.$dropdownControl);

    this.$dropdown.appendChild(this.$dropdownWrapper);
    this.appendChild(this.$dropdown);
  }

  /** Builds snippets list item */
  protected buildListItem(snippet: SnippetTemplate) {
    const label = snippet.getAttribute('label');
    if (!label) return;

    const $li = document.createElement('li');
    $li.classList.add(UIPSnippets.LIST_ITEM);
    $li.textContent = label;
    snippet === this.model?.activeSnippet && $li.classList.add(UIPSnippets.ACTIVE_ITEM);
    return $li;
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
