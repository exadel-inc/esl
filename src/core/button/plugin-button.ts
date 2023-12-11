import {listen} from '@exadel/esl/modules/esl-utils/decorators';
import {ENTER} from '@exadel/esl/modules/esl-utils/dom/keys';

import {UIPPlugin} from '../base/plugin';

export abstract class UIPPluginButton extends UIPPlugin {
  public static defaultTitle: string = '';

  /**
   * Creates uip-copy element
   * @param content - inner content of created element
   * @param cls - class name of created element
   */
  public static create<T extends typeof UIPPluginButton>(this: T, content?: string | Element | JSX.Element, cls: string = ''): InstanceType<T> {
    const $el = document.createElement(this.is) as InstanceType<T>;
    $el.className = cls;
    if (typeof content === 'string') $el.innerHTML = content;
    if (typeof content === 'object') $el.appendChild(content);
    return $el;
  }

  /** Executes UIP action */
  protected abstract onAction(): void;

  protected override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute('tabindex', '0');
    this.setAttribute('role', 'button');

    const type = this.constructor as typeof UIPPluginButton;
    if (type.defaultTitle && !this.hasAttribute('title')) {
      this.setAttribute('title', this.label || type.defaultTitle);
    }
  }

  @listen('click')
  protected _onClick(e: PointerEvent): void {
    e.preventDefault();
    this.onAction();
  }

  @listen('keydown')
  protected _onKeyDown(e: KeyboardEvent): void {
    if (e.key === ENTER) this.click();
  }
}
