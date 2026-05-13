import {ESLMixinElement} from '@exadel/esl/modules/esl-mixin-element/core';
import {attr, listen} from '@exadel/esl/modules/esl-utils/decorators';

/**
 * ESLDemoSkillCopy — mixin for skill card copy-to-clipboard button.
 * Attach via `esl-d-skill-copy` attribute on any button with a `data-url` pointing to a raw skill file.
 *
 * @example
 * ```html
 * <button esl-d-skill-copy data-url="/skills/esl-core.md">Copy to clipboard</button>
 * ```
 */
export class ESLDemoSkillCopy extends ESLMixinElement {
  public static override is = 'esl-d-skill-copy';

  /** URL of the raw skill file to copy */
  @attr({name: 'data-url', defaultValue: ''}) public url: string;

  /** Duration (ms) to show the feedback label after a successful copy */
  @attr({name: 'data-feedback-duration', defaultValue: 2500, parser: parseInt})
  public feedbackDuration: number;

  @listen('click')
  protected async _onClick(): Promise<void> {
    if (!this.url) return;
    try {
      const item = new ClipboardItem({
        'text/plain': fetch(this.url)
          .then((r) => {
            if (!r.ok) throw new Error(`Failed to fetch skill file: ${r.status} ${r.statusText}`);
            return r.text();
          })
          .then((text) => new Blob([text], {type: 'text/plain'})),
      });
      await navigator.clipboard.write([item]);
      this._showFeedback();
    } catch (e) {
      this.$$error(e as Error, '_onClick');
    }
  }

  protected _showFeedback(): void {
    const original = this.$host.textContent?.trim() ?? '';
    this.$host.textContent = '✓ Copied!';
    this.$host.toggleAttribute('data-copied', true);
    setTimeout(() => {
      this.$host.textContent = original;
      this.$host.toggleAttribute('data-copied', false);
    }, this.feedbackDuration);
  }
}
