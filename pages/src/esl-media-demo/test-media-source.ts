import {attr} from '../../../src/modules/esl-utils/decorators/attr';
import {listen} from '../../../src/modules/esl-utils/decorators/listen';
import {debounce} from '../../../src/modules/esl-utils/async/debounce';
import {decorate} from '../../../src/modules/esl-utils/decorators/decorate';
import {ESLBaseElement} from '../../../src/modules/esl-base-element/core/esl-base-element';
import {TraversingQuery} from '../../../src/modules/esl-traversing-query/core/esl-traversing-query';

class ESLDemoMediaSource extends ESLBaseElement {
  static is = 'esl-d-media-source';

  @attr() public target: string;

  public get $targets(): HTMLElement[] {
    return TraversingQuery.all(this.target, this) as HTMLElement[];
  }

  protected connectedCallback(): void {
    super.connectedCallback();
    this.render();
    this.onChange();
  }

  protected render(): void {
    const form = document.createElement('form');
    form.innerHTML = `
      <fieldset>
        <legend>Video Settings:</legend>
          <div class="input-group mb-2">
          <select class="form-control" name="media-type">
            <option value="auto">- Auto -</option>
            <option value="audio">HTML Audio</option>
            <option value="video">HTML Video</option>
            <option value="youtube">Youtube</option>
            <option value="brightcove">Brightcove</option>
            <option value="iframe">Iframe</option>
          </select>
        </div>
        <div class="input-group mb-2">
          <input type="text" class="form-control" placeholder="Media src" name="media-src" autocomplete="on"/>
        </div>
        <div class="input-group mb-2">
          <input type="text" class="form-control" placeholder="Media id" name="media-id" autocomplete="on"/>
        </div>
        <div class="input-group mb-2">
          <input type="text" class="form-control" placeholder="Player id" name="player-id" autocomplete="on"/>
        </div>
        <div class="input-group mb-2">
          <input type="text" class="form-control" placeholder="Player account" name="player-account" autocomplete="on"/>
        </div>

        <div class="form-group">
          <div class="form-check form-check-inline">
            <label class="form-check-label"><input type="checkbox" name="muted" class="form-check-input"/> Muted</label>
          </div>
          <div class="form-check form-check-inline">
            <label class="form-check-label"><input type="checkbox" name="autoplay" class="form-check-input"/> Autoplay</label>
          </div>
          <div class="form-check form-check-inline">
            <label class="form-check-label"><input type="checkbox" name="disabled" class="form-check-input"/> Disabled</label>
          </div>
        </div>
      </fieldset>
    `;
    form.action = 'javascript: void 0;';

    this.innerHTML = '';
    this.appendChild(form);
  }

  @listen('change')
  @decorate(debounce, 750)
  protected onChange(): void {
    const inputs = this.querySelectorAll('input[name], select[name]');
    Array.from(inputs).forEach((input: HTMLInputElement | HTMLSelectElement) => {
      this.$targets.forEach((target: HTMLElement) => {
        if (input instanceof HTMLInputElement && input.type === 'checkbox') {
          target.toggleAttribute(input.name, input.checked);
        } else {
          target.setAttribute(input.name, input.value);
        }
      });
    });
  }
}

ESLDemoMediaSource.register();
