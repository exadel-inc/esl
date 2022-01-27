import {loadScript} from '../../../modules/esl-utils/dom/script';

export function loadSearchScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    loadScript('gss', 'https://cse.google.com/cse.js?cx=3171f866738b34f02')
      .then(() => {
        (window as any).__gcse = {
          parsetags: 'onload',
          initializationCallback: (): void => resolve()
        };
      })
      .catch(() => reject());
  });
}
