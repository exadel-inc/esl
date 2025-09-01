import {attr, ready} from '@exadel/esl/modules/esl-utils/decorators';
import {ESLMixinElement} from '@exadel/esl';

export class ESLDemoNewLabel extends ESLMixinElement {
  static override is = 'esl-d-new-label';

  @attr({name: ESLDemoNewLabel.is, parser: parseInt}) public date: number;

  @ready
  protected override connectedCallback(): void {
    super.connectedCallback();
    if (!this.isLabelExpired()) this.appendLabel();
  }

  protected isLabelExpired(): boolean {
    const time = 30 * 24 * 60 * 60 * 1000;
    return this.date + time < Date.now();
  }

  protected appendLabel(): void {
    const label = document.createElement('sup');
    label.className = 'badge badge-small badge-sup badge-success';
    label.textContent = 'new';
    this.$host.appendChild(label);
  }
}
