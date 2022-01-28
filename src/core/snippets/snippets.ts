import {memoize} from '@exadel/esl/modules/esl-utils/decorators/memoize';
import {bind} from '@exadel/esl/modules/esl-utils/decorators/bind';
import {UIPPlugin} from '../base/plugin';

/**
 * Container class for snippets (component's templates).
 * @extends UIPPlugin
 */
export class UIPSnippets extends UIPPlugin {
  public static is = 'uip-snippets';
  /** CSS Class for snippets list. */
  public static LIST = 'snippets-list';
/** CSS Class for snippets list item. */
  public static LIST_ITEM = 'snippets-list-item';
  /** CSS Class added to active snippet. */
  public static ACTIVE_ITEM = 'active';
/** CSS Class for snippets dropdown. */
  public static DROPDOWN = 'snippets-dropdown';
/** CSS Class for snippets title. */
  public static TITLE = 'snippets-title';
  /** CSS Class for dropdown control. */
  public static DROPDOWN_CTRL = 'snippets-dropdown-control';
  /** CSS Class for dropdown wrapper. */
  public static DROPDOWN_WRAPPER = 'snippets-dropdown-wrapper';
  /** Index of current snippet list item*/
  public currentIndex = 0;

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
    this.querySelector(`.${UIPSnippets.LIST}`)?.addEventListener('click', this._onListClick);
    this.querySelector(`.${UIPSnippets.DROPDOWN_CTRL}`)?.addEventListener('click', this._onDropdownClick);
  }

  protected unbindEvents() {
    this.querySelector(`.${UIPSnippets.LIST}`)?.removeEventListener('click', this._onListClick);
    this.querySelector(`.${UIPSnippets.DROPDOWN_CTRL}`)?.removeEventListener('click', this._onDropdownClick);
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
    const $title = document.createElement('span');
    $title.className = UIPSnippets.TITLE;

    snippets.length > 1
      ? this.renderDropdown(snippets, $title)
      : this.appendChild($title);
  }

  protected renderDropdown(snippets: HTMLTemplateElement[], title: HTMLElement) {
    const $dropdown = document.createElement('div');
    $dropdown.className = UIPSnippets.DROPDOWN;
    const $control = document.createElement('div');
    $control.className = UIPSnippets.DROPDOWN_CTRL;
    const $content = document.createElement('div');
    $content.className = UIPSnippets.DROPDOWN_WRAPPER;
    const $ul = document.createElement('ul');
    $ul.className = `${UIPSnippets.LIST} esl-scrollable-content`;

    Array.from(snippets)
      .map((snippet: HTMLTemplateElement) => this.buildListItem(snippet))
      .forEach((item) => item && $ul.appendChild(item));

    $content.appendChild($ul);
    this.$scroll && $content.appendChild(this.$scroll);
    $control.appendChild(title);
    this.appendChild($control);
    $dropdown.appendChild($content);
    this.appendChild($dropdown);
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
    const titleText = this.querySelector(`.${UIPSnippets.TITLE}`) as HTMLElement;
    titleText.textContent = `${snippet.getAttribute('label')}`;
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
