import {memoize} from '@exadel/esl/modules/esl-utils/decorators/memoize';
import {bind} from '@exadel/esl/modules/esl-utils/decorators/bind';
import {UIPPlugin} from '../base/plugin';

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
  protected get $dropdownControl() {
    const $el = document.createElement('div');
    $el.className = 'snippets-dropdown-control';

    return $el;
  }

  @memoize()
  protected get $dropdownWrapper() {
    const $el = document.createElement('div');
    $el.className = 'snippets-dropdown-wrapper';

    return $el;
  }

  protected connectedCallback() {
    super.connectedCallback();
    this.render();
    this.bindEvents();

    if (this.model) {
      this.model.applySnippet(this.model.snippets[this.currentIndex], this);
      this.updateTitleText(this.model.activeSnippet);
    }
    // Initial update
    setTimeout(() => this.$active = this.$active || this.$items[0]);
  }

  protected disconnectedCallback() {
    super.disconnectedCallback();
    this.unbindEvents();
  }

  protected bindEvents() {
    this.$snippetList.addEventListener('click', this._onListClick);
    this.$dropdownControl.addEventListener('click', this._onDropdownClick);
  }

  protected unbindEvents() {
    this.$snippetList.removeEventListener('click', this._onListClick);
    this.$dropdownControl.removeEventListener('click', this._onDropdownClick);
  }

  @memoize()
  public get $items(): HTMLElement[] {
    const items = this.querySelectorAll(`.${UIPSnippets.LIST_ITEM}`);
    return Array.from(items) as HTMLElement[];
  }

  public get $active(): HTMLElement | null {
    return this.$items.find(item => item.classList.contains(UIPSnippets.ACTIVE_ITEM)) || null;
  }
  public set $active(snippet: HTMLElement | null) {
    this.$items.forEach((item) => item.classList.toggle(UIPSnippets.ACTIVE_ITEM, snippet === item));
  }

  @memoize()
  public get $scroll() {
    const $scroll = document.createElement('esl-scrollbar');
    $scroll.setAttribute('target', '::prev');
    return $scroll;
  }

  /** Render snippets list. */
  protected render(): void {
    const snippets = this.model!.snippets;
    if (!snippets.length) return;

    snippets.length > 1
      ? this.renderDropdown(snippets, this.$title)
      : this.appendChild(this.$title);
  }

  protected renderDropdown(snippets: HTMLTemplateElement[], title: HTMLElement) {

    Array.from(snippets)
      .map((snippet: HTMLTemplateElement) => this.buildListItem(snippet))
      .forEach((item) => item && this.$snippetList.appendChild(item));

    this.$snippetList.classList.add('esl-scrollable-content');
    this.$dropdownWrapper.appendChild(this.$snippetList);
    this.$scroll &&this.$dropdownWrapper.appendChild(this.$scroll);

    this.$dropdownControl.appendChild(title);
    this.appendChild(this.$dropdownControl);

    this.$dropdown.appendChild(this.$dropdownWrapper);
    this.appendChild(this.$dropdown);
  }

  /** Build snippets list item. */
  protected buildListItem(snippet: HTMLTemplateElement) {
    const label = snippet.getAttribute('label');
    if (!label) return;

    const $li = document.createElement('li');
    $li.classList.add(UIPSnippets.LIST_ITEM);
    $li.textContent = label;
    return $li;
  }

  protected updateTitleText(snippet: HTMLTemplateElement) {
    this.$title.textContent = `${snippet.getAttribute('label')}`;
  }

  @bind
  protected _onListClick(event: Event) {
    const target = event.target as HTMLElement;
    const index = this.$items.indexOf(target);
    if (index < 0) return;

    this.toggleDropdown();

    if (this.currentIndex !== index && this.model) {
      this.model.applySnippet(this.model.snippets[index], this);
      this.$active = target;
      this.currentIndex = index;
      this.updateTitleText(this.model.activeSnippet);
    }
  }

  @bind
  protected _onDropdownClick() {
    this.toggleDropdown();
  }

  toggleDropdown(): void {
    this.classList.contains('dropdown-open')
      ? this.classList.remove('dropdown-open')
      : this.classList.add('dropdown-open');
  }
}
