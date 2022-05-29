import {TraversingQuery} from '../../../src/modules/esl-traversing-query/core/esl-traversing-query';
import {attr, ESLBaseElement} from '../../../src/modules/esl-base-element/core';
import {scrollIntoView} from '../../../src/modules/esl-utils/misc/scrollIntoView';
import type {ESLSelect} from '../../../src/modules/all';

export class ESLDemoScrollControls extends ESLBaseElement {
  static is = 'esl-scroll-controls';

  @attr() public for: string;

  protected bindEvents(): void {
    const scrollBtn = this.querySelector('#scrollIntoView')!;
    scrollBtn.addEventListener('click', this._onClick);
  }

  public connectedCallback(): void {
    this.render();
    const forElements = TraversingQuery.all(this.for);
    forElements.forEach((el: HTMLElement) => {
      const option = document.createElement('option');
      const scrollNameValue = el.getAttribute('scrollname');
      if (!scrollNameValue) return;
      option.innerHTML = scrollNameValue;
      const target = TraversingQuery.first('#target') as ESLSelect;
      target.appendChild(option);
    });

    this.bindEvents();
  }

  private _onClick(): void {
    const behaviorOptions = TraversingQuery.all('[name="scroll-behavior"]') as HTMLInputElement[];
    const behavior = behaviorOptions.find((radio) => radio.checked)!.value as ScrollBehavior;

    const block = (TraversingQuery.first('#options_block') as ESLSelect).value as ScrollLogicalPosition;
    const inline = (TraversingQuery.first('#options_inline') as ESLSelect).value as ScrollLogicalPosition;

    const targetSelect = TraversingQuery.first('#target') as ESLSelect;
    const target = TraversingQuery.first(`[scrollname="${targetSelect.value?.toString()}"]`);

    const offsetLeft = Number((TraversingQuery.first('#offsetLeft') as HTMLInputElement).value);
    const offsetTop = Number((TraversingQuery.first('#offsetTop') as HTMLInputElement).value);
    scrollIntoView(target!, {behavior, block, inline, offsetLeft, offsetTop});
  }

  protected render(): void {
    this.innerHTML = `
      <ul class="esl-d-scroll-controls-ul">
      <li class="esl-d-scroll-controls-li">
        <label class="form-label">Behavior</label>

        <ul class="esl-d-scroll-controls-behavior">
          <li class="esl-d-scroll-controls-behavior-option">
            <input type="radio" name="scroll-behavior" id="smooth" value="smooth">
            <label for="smooth" class="form-label">Smooth</label>
          </li>

          <li class="esl-d-scroll-controls-behavior-option">
            <input type="radio" name="scroll-behavior" id="auto" value="auto" checked>
            <label for="auto" class="form-label">Auto</label>
          </li>
        </ul>
      </li>

      <li class="esl-d-scroll-controls-li">
        <label for="options_block" class="form-label">Block</label>
        <esl-select style="display: block"
                    placeholder="Block"
                    select-all-label="Block">
          <select esl-select-target
                  id="options_block"
                  name="options_block"
                  class="form-control">
            <option>start</option>
            <option>center</option>
            <option>end</option>
            <option>nearest</option>
          </select>
        </esl-select>
      </li>

      <li class="esl-d-scroll-controls-li">
        <label for="options_inline" class="form-label">Inline</label>
        <esl-select style="display: block" placeholder="Inline">
          <select esl-select-target
                  id="options_inline"
                  name="options_inline"
                  class="form-control">
            <option>start</option>
            <option>center</option>
            <option>end</option>
            <option>nearest</option>
          </select>
        </esl-select>
      </li>

      <li class="esl-d-scroll-controls-li">
        <label for="target" class="form-label">Target</label>
        <esl-select style="display: block" placeholder="Target">
          <select esl-select-target
                  id="target"
                  name="target"
                  class="form-control">
          </select>
        </esl-select>
      </li>

      <li class="esl-d-scroll-controls-li">
        <label for="marginArrow">OffsetLeft</label>
        <input type="text" class="form-control" id="offsetLeft" name="scroll-offsetLeft" min="0" max="1000" value="0" size="3">
      </li>

      <li class="esl-d-scroll-controls-li">
        <label for="marginArrow">OffsetTop</label>
        <input type="text" class="form-control" id="offsetTop" name="scroll-offsetTop" min="0" max="1000" value="0" size="3">
      </li>

      <li class="menu-item" style="margin-left: auto">
        <button type="button" class="btn btn-sec-orange esl-d-scroll-controls-button" id="scrollIntoView">Scroll</button>
      </li>
    </ul>
  `;
  }
}
