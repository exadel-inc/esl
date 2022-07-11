import {memoize} from '@exadel/esl/modules/esl-utils/decorators/memoize';
import {bind} from '@exadel/esl/modules/esl-utils/decorators/bind';
import {listen} from '@exadel/esl/modules/esl-utils/decorators/listen';

import {UIPPlugin} from '../../../core/base/plugin';
import {SnippetTemplate} from '../../../core/base/model';

/**
 * Container class for snippets (component's templates).
 * @extends UIPPlugin
 */
export class UIPSnippets extends UIPPlugin {
  public static is = 'uip-snippets';
  /** CSS Class for snippets list item. */
  public static LIST_ITEM = 'snippets-list-item';
  /** CSS Class added to active snippet. */
  public static ACTIVE_ITEM = 'active';
  /** Index of current snippet list item*/
  public currentIndex = 0;

  @memoize()
  protected get $snippetList() {
    const $el = document.createElement('div');
    $el.className = 'snippets-list';
    return $el;
  }

  @memoize()
  protected get $title() {
    const $el = document.createElement('span');
    $el.className = 'snippets-title';
    return $el;
  }

  @memoize()
  protected get $dropdown() {
    const $el = document.createElement('div');
    $el.className = 'snippets-dropdown';
    return $el;
  }

  @memoize()
  protected get $dropdownControl(): HTMLElement {
    const $el = document.createElement('div');
    $el.className = 'snippets-dropdown-control';
    return $el;
  }

  @memoize()
  protected get $dropdownWrapper(): HTMLElement {
    const $el = document.createElement('div');
    $el.className = 'snippets-dropdown-wrapper';
    return $el;
  }

  @memoize()
  public get $items(): HTMLElement[] {
    const items = this.querySelectorAll(`.${UIPSnippets.LIST_ITEM}`);
    return Array.from(items) as HTMLElement[];
  }

  @memoize()
  public get $scroll(): HTMLElement {
    const $scroll = document.createElement('esl-scrollbar');
    $scroll.setAttribute('target', '::prev');
    return $scroll;
  }

  protected connectedCallback() {
    super.connectedCallback();
    this.render();
    this.updateTitleText();
    // Initial update
    setTimeout(() => this.$active = this.$active || this.$items[0]);
  }

  protected disconnectedCallback() {
    super.disconnectedCallback();
  }

  @listen({event: 'mouseup', target: document.body})
  protected onOutsideAction(e: Event) {
    if (!this.classList.contains('dropdown-open')) return;
    const target = e.target as HTMLElement;
    if (this.contains(target)) return false;
    this.toggleDropdown();
  }

  public get $active(): HTMLElement | null {
    return this.$items.find(item => item.classList.contains(UIPSnippets.ACTIVE_ITEM)) || null;
  }
  public set $active(snippet: HTMLElement | null) {
    this.$items.forEach((item) => item.classList.toggle(UIPSnippets.ACTIVE_ITEM, snippet === item));
  }

  /** Render snippets list. */
  protected render(): void {
    const snippets = this.model!.snippets;
    if (!snippets.length) return;

    snippets.length > 1
      ? this.renderDropdown(snippets, this.$title)
      : this.appendChild(this.$title);
  }

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

  /** Build snippets list item. */
  protected buildListItem(snippet: SnippetTemplate) {
    const label = snippet.getAttribute('label');
    if (!label) return;

    const $li = document.createElement('li');
    $li.classList.add(UIPSnippets.LIST_ITEM);
    $li.textContent = label;
    return $li;
  }

  protected updateTitleText(): void {
    if (this.model) {
      this.$title.textContent = `${this.model.activeSnippet.getAttribute('label')}`;
    }
  }

  @listen('click')
  protected _onItemClick(event: Event) {
    const target = event.target as HTMLElement;
    const index = this.$items.indexOf(target);
    if (index < 0) return;

    this.toggleDropdown();

    if (this.currentIndex !== index && this.model) {
      this.model.applySnippet(this.model.snippets[index], this);
      this.$active = target;
      this.currentIndex = index;
      this.updateTitleText();
    }
  }

  @listen('click')
  protected _onDropdownClick() {
    this.toggleDropdown();
  }

  public toggleDropdown(): void {
    this.classList.toggle('dropdown-open');
  }
}
