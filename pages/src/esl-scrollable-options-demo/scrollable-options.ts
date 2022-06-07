import {TraversingQuery} from '../../../src/modules/esl-traversing-query/core/esl-traversing-query';
import {attr, ESLBaseElement, listen} from '../../../src/modules/esl-base-element/core';
import type {ESLSelect} from '../../../src/modules/all';

export class ESLDemoScrollControls extends ESLBaseElement {
  static is = 'esl-d-scroll-controls';

  @attr() public target: string;

  protected connectedCallback(): void {
    TraversingQuery.all(this.target).forEach((el: HTMLElement) => {
      const option = document.createElement('option');
      const scrollNameValue = el.getAttribute('scrollname');
      if (!scrollNameValue) return;
      option.innerHTML = scrollNameValue;
      const target = TraversingQuery.first('::find(#target)', this) as ESLSelect;
      target.appendChild(option);
    });
    super.connectedCallback();
  }

  @listen({event: 'click', selector: '#scrollIntoView'})
  private onClick(): void {
    const behaviorOptions = TraversingQuery.all('::find([name="scroll-behavior"])', this) as HTMLInputElement[];
    const behavior = behaviorOptions.find((radio) => radio.checked)!.value as ScrollBehavior;

    const block = (TraversingQuery.first('::find(#options_block)', this) as ESLSelect).value as ScrollLogicalPosition;
    const inline = (TraversingQuery.first('::find(#options_inline)', this) as ESLSelect).value as ScrollLogicalPosition;

    const targetSelect = TraversingQuery.first('::find(#target)', this) as ESLSelect;
    const target = TraversingQuery.first(`[scrollname="${targetSelect.value?.toString()}"]`);

    const offsetLeft = Number((TraversingQuery.first('::find(#offsetLeft)', this) as HTMLInputElement).value);
    const offsetTop = Number((TraversingQuery.first('::find(#offsetTop)', this) as HTMLInputElement).value);
    target!.scrollIntoView({behavior, block, inline});
  }
}
