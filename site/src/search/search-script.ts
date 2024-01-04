import {loadScript} from '@exadel/esl/modules/esl-utils/dom/script';
import {memoizeFn} from '@exadel/esl/modules/esl-utils/misc/memoize';

function loadSearchScript(): Promise<Event> {
  return loadScript('gss', 'https://cse.google.com/cse.js?cx=3171f866738b34f02');
}

const onGSSReady = (): Promise<void> => {
  return new Promise((resolve) => {
    (window as any).__gcse = {
      parsetags: 'onload',
      initializationCallback: (): void => resolve()
    };
  });
};

export const requestGss = memoizeFn(() => loadSearchScript().then(onGSSReady));
