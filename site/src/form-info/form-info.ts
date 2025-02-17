import {ESLMixinElement} from '@exadel/esl/modules/esl-mixin-element/core';

export class ESLDemoFormInfo extends ESLMixinElement {
  static override is = 'esl-d-form-info';

  private updateFormInfo(event: Event): void {
    const form = document.querySelector('.form') as HTMLFormElement | null;
    const info = document.querySelector('.demo-info') as HTMLElement | null;

    event.preventDefault();
    const data: Record<string, string | string[]> = {};
    if (!form || !info) return;

    const formData = new FormData(form);

    formData.forEach((value, key) => {
      const stringValue = value instanceof File ? value.name : String(value);

      if (data[key] as string) {
        if (Array.isArray(data[key])) {
          (data[key]).push(stringValue);
        } else {
          data[key] = [data[key], stringValue].flat();
        }
      } else {
        data[key] = stringValue;
      }
    });

    info.textContent = JSON.stringify(data, null, 2);
    info.removeAttribute('hidden');
  }

  public override connectedCallback(): void {
    document.addEventListener('submit', this.updateFormInfo);
  }

  public override disconnectedCallback(): void {
    document.addEventListener('submit', this.updateFormInfo);
  }
}
