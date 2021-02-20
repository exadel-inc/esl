import {ExportNs} from '../../esl-utils/environment/export-ns';
import {ESLBaseElement} from '../../esl-base-element/core/esl-base-element';
import {attr} from '../../esl-base-element/decorators/attr';

@ExportNs('Tabs')
export class ESLTabs extends ESLBaseElement {
  public static is = 'esl-tabs-container';

  @attr({defaultValue: '::parent::find(esl-tab)'}) public targets: string;

  protected connectedCallback() {
    super.connectedCallback();
    this.render();
  }

  public render() {
    if (this.querySelector('esl-a11y-group')) return;
    const $el = document.createElement('esl-a11y-group');
    $el.setAttribute('targets', this.targets);
    $el.setAttribute('click-on-active', 'true');
    this.appendChild($el);
  }
}
