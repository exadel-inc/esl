import {EventUtils} from '@exadel/esl/modules/esl-utils/dom/events';
import {listen} from '@exadel/esl/modules/esl-utils/decorators/listen';
import {UIPPlugin} from '../../core/base/plugin';
import {UIPOptions, UIPSnippets} from '../registration';

/**
 * Header {@link UIPPlugin} custom element definition
 * Container for {@link UIPSnippets} and {@link UIPOptions} elements
 * @extends UIPPlugin
 */
export class UIPHeader extends UIPPlugin {
  static is = 'uip-header';

  protected connectedCallback(): void {
    super.connectedCallback();
    this.childElementCount || this.autofill();
  }

  /** Default configuration rendering */
  protected autofill(): void {
    this.renderSnippets();
    this.renderOptions();
    this.renderCopy();
  }

  /** Renders {@link UIPSnippets} element */
  protected renderSnippets(): void {
    if (this.model?.snippets.length) {
      const snippetsEl = document.createElement(UIPSnippets.is) as UIPSnippets;
      this.prepend(snippetsEl);
    }
  }

  /** Renders {@link UIPOptions} element */
  protected renderOptions(): void {
    const optionsEl = document.createElement(UIPOptions.is) as UIPSnippets;
    this.append(optionsEl);
  }

  /** Renders copy icon */
  protected renderCopy(): void {
    const icon = document.createElement('button');
    icon.title = 'copy markup';
    icon.classList.add('copy-icon');
    this.append(icon);
  }

  /** Handles copy icon click */
  @listen({event: 'click', selector: '.copy-icon'})
  protected _onCopyClick() {
    navigator.clipboard.writeText(this.model!.html).then(() => {
      EventUtils.dispatch(this, 'esl:alert:show', {
        detail: {
          text: 'Markup copied',
          cls: 'uip-alert-info'
        }
      });
    });
  }
}
