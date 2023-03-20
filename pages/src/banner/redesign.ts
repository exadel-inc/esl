import {ESLEventUtils} from '../../../src/modules/esl-utils/dom/events';
import {onDocumentReady} from '../../../src/modules/esl-utils/dom/ready';

import type {AlertActionParams} from '../../../src/modules/esl-alert/core/esl-alert';

onDocumentReady(() => {
  const KEY = 'redesign-2021-testing';
  if (sessionStorage.getItem(KEY)) return;
  sessionStorage.setItem(KEY, '1');

  const detail: AlertActionParams = {
    cls: 'alert alert-info banner-popup-alert',
    html: `
        <div class="banner-popup-text">
          <p>Hey dear ESL site visitor, it is a preview version of our site redesign.</p>
          <p>We hope you like it. Feel free to create an issue on GitHub in case you are faced with a bug.</p>
          <p>Enjoy the new experience of ESL presentation!</p>
        </div>
        <span class="close"></span>
    `,
    hideDelay: 15000
  };
  ESLEventUtils.dispatch(document.body, 'esl:alert:show', {detail});
});
