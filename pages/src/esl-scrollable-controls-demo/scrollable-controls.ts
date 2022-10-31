import {TraversingQuery} from '../../../src/modules/esl-traversing-query/core/esl-traversing-query';
import {attr, ESLBaseElement, listen} from '../../../src/modules/esl-base-element/core';
import {scrollIntoView} from '../../../src/modules/esl-utils/dom/scroll';
import type {ESLSelect} from '../../../src/modules/all';

export class ESLDemoScrollControls extends ESLBaseElement {
  static is = 'esl-d-scroll-controls';

  @attr() public target: string;

  protected connectedCallback(): void {
    TraversingQuery.all(this.target).forEach((el: HTMLElement) => {
      const scrollNameValue = el.getAttribute('scrollname');
      if (!scrollNameValue) return;
      const option = document.createElement('option');
      option.innerHTML = scrollNameValue;
      const target = TraversingQuery.first('::find(#target)', this) as ESLSelect;
      target.appendChild(option);
    });
    super.connectedCallback();
  }

  // @listen({event: 'click', selector: '#scrollIntoView'})
  @listen({event: 'click', selector: '.esl-d-scroll-controls-button'})
  private onClick(e: PointerEvent): void {
    const behaviorOptions = TraversingQuery.all('::find([name="scroll-behavior"])', this) as HTMLInputElement[];
    const behavior = behaviorOptions.find((radio) => radio.checked)!.value as ScrollBehavior;

    const block = (TraversingQuery.first('::find(#options_block)', this) as ESLSelect).value as ScrollLogicalPosition;
    const inline = (TraversingQuery.first('::find(#options_inline)', this) as ESLSelect).value as ScrollLogicalPosition;

    const targetSelect = TraversingQuery.first('::find(#target)', this) as ESLSelect;
    const target = TraversingQuery.first(`[scrollname="${targetSelect.value?.toString()}"]`);

    const offsetInline = Number((TraversingQuery.first('::find(#offsetInline)', this) as HTMLInputElement).value);
    const offsetBlock = Number((TraversingQuery.first('::find(#offsetBlock)', this) as HTMLInputElement).value);
    (target as HTMLElement).style.scrollMarginInline = `${offsetInline}px ${offsetInline}px`;
    (target as HTMLElement).style.scrollMarginBlock = `${offsetBlock}px ${offsetBlock}px`;
    if ((e.target as HTMLElement).id.includes('Native')) {
      target?.scrollIntoView({behavior, block, inline});
    } else {
      scrollIntoView(target!, {behavior, block, inline})
        .then(() => this.$$fire('esl:alert:show',
          {detail: {
            text: 'Sucessful scroll to given position',
            cls: 'alert alert-info'
          }})
        )
        .catch(() => this.$$fire('esl:alert:show',
          {detail: {
            text: 'Failed to scroll to given position',
            cls: 'alert alert-danger'
          }})
        );
    }
  }
}
