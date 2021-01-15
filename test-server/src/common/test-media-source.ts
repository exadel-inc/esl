import {debounce} from '../../../src/modules/esl-utils/async/debounce';

class TestMediaSource extends HTMLElement {
  get target() {
    const targetSel = this.getAttribute('target');
    return document.querySelector(targetSel || '');
  }

  private render() {
    const form = document.createElement('form');
    form.innerHTML = `
			<fieldset>
				<legend>Video Settings:</legend>
		    <div class="input-group mb-2 mr-sm-2">
			    <select class="form-control" name="media-type">
			      <option value="auto">- Auto -</option>
			      <option value="audio">HTML Audio</option>
			      <option value="video">HTML Video</option>
			      <option value="youtube">Youtube</option>
			      <option value="brightcove">Brightcove</option>
			      <option value="iframe">Iframe</option>
					</select>
        </div>
			  <div class="input-group mb-2 mr-sm-2">
			    <input type="text" class="form-control" placeholder="Media src" name="media-src" autocomplete="on"/>
			  </div>
			  <div class="input-group mb-2 mr-sm-2">
			    <input type="text" class="form-control" placeholder="Media id" name="media-id" autocomplete="on"/>
			  </div>
        <div class="input-group mb-2 mr-sm-2">
			    <input type="text" class="form-control" placeholder="Player id" name="player-id" autocomplete="on"/>
        </div>
        <div class="input-group mb-2 mr-sm-2">
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

  private onChange() {
    const target = this.target;
    const inputs = this.querySelectorAll('input[name], select[name]');
    Array.from(inputs).forEach((input: HTMLInputElement | HTMLSelectElement) => {
      if (!target) return;
      if (input instanceof HTMLInputElement && input.type === 'checkbox') {
        target.toggleAttribute(input.name, input.checked);
      } else {
        target.setAttribute(input.name, input.value);
      }
    });
  }

  protected connectedCallback() {
    this.render();
    this.addEventListener('change', debounce(() => this.onChange(), 750));
    this.onChange();
  }
}

customElements.define('test-media-source', TestMediaSource);
