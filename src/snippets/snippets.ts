import {ESLBaseElement, attr} from '@exadel/esl/modules/esl-base-element/core';
import {bind} from '@exadel/esl/modules/esl-utils/decorators/bind';
import {UIPRoot} from '../core/root';
import {EventUtils} from '@exadel/esl/modules/esl-utils/dom/events';

export class UIPSnippets extends ESLBaseElement {
  public static is = 'uip-snippets';

  public static ACTIVE_CLASS = 'active';

  protected _$root: UIPRoot;

  @attr({defaultValue: 'Snippets'}) public label: string;


  public get $items(): HTMLElement[] {
    const items = this.querySelectorAll('.snippets-list-item');
    return Array.from(items) as HTMLElement[];
  }

  public get $active(): HTMLElement | null {
    return this.$items.find(item => item.classList.contains(UIPSnippets.ACTIVE_CLASS)) || null;
  }

  public set $active(snippet: HTMLElement | null) {
    this.$active?.classList.remove(UIPSnippets.ACTIVE_CLASS);
    snippet?.classList.add(UIPSnippets.ACTIVE_CLASS);
  }

  protected connectedCallback() {
    super.connectedCallback();
    this.bindEvents();

    this._$root = this.closest(`${UIPRoot.is}`) as UIPRoot;

    this.render();
    if (!this.$active) this.$active = this.$items[0];
    this.sendMarkUp();
  }

  protected disconnectedCallback() {
    super.disconnectedCallback();
    this.unbindEvents();
  }

  protected bindEvents() {
    this.addEventListener('click', this._onClick);
  }

  protected unbindEvents() {
    this.removeEventListener('click', this._onClick);
  }

  protected render(): void {
    if (this.closest('.snippets-wrapper')) return;

    const $wrapper = document.createElement('div');
    $wrapper.className = 'snippets-wrapper';

    const snippets = this.querySelectorAll('template[uip-snippet]');
    if (!snippets.length) return;
    const $ul = document.createElement('ul');
    $ul.className = 'snippets-list';

    snippets.forEach(snippet => {
      const li = document.createElement('li');
      li.classList.add('snippets-list-item');
      const label = snippet.getAttribute('label');
      if (!label) return;
      li.innerHTML = label;
      if (snippet.classList.contains(UIPSnippets.ACTIVE_CLASS)) this.$active = li;
      li.appendChild(snippet);
      $ul?.appendChild(li);
    });

    $wrapper.innerHTML = `
        <span class="section-name">${this.label}</span>
        <uip-snippets>${$ul.outerHTML}</uip-snippets>
    `;
    this.parentElement?.replaceChild($wrapper, this);
  }

  protected sendMarkUp(): void {
    const tmpl = this.$active?.querySelector('template[uip-snippet]');
    if (!tmpl) return;
    const detail = {source: UIPSnippets.is, markup: tmpl.innerHTML};
    EventUtils.dispatch(this, 'request:change', {detail});
  }

  @bind
  protected _onClick(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.classList.contains('snippets-list-item')) return;
    this.$active = target;
    this.sendMarkUp();
  }
}

