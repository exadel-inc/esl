import {CSSClassUtils} from '@exadel/esl';
import {bind} from '@exadel/esl/modules/esl-utils/decorators/bind';
import {UIPPlugin} from '../core/plugin';

export class UIPSnippets extends UIPPlugin {
  public static is = 'uip-snippets';

  public static ACTIVE_CLASS = 'active';

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

  protected handleChange() {}

  protected render(): void {
    const $inner = document.createElement('div');
    CSSClassUtils.add($inner, 'uip-snippets-inner esl-scrollable-content');

    const $scroll = document.createElement('esl-scrollbar');
    $scroll.setAttribute('target', '::prev(.uip-snippets-inner)');

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

    $inner.appendChild($ul);
    this.innerHTML = $inner.outerHTML + $scroll.outerHTML;
  }

  protected sendMarkUp(): void {
    const tmpl = this.$active?.querySelector('template[uip-snippet]');
    if (!tmpl) return;

    this.dispatchChange(tmpl.innerHTML);
  }

  @bind
  protected _onClick(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.classList.contains('snippets-list-item')) return;
    this.$active = target;

    this.sendMarkUp();
  }
}

