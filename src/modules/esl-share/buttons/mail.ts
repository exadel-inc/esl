/* eslint-disable @stylistic/max-len */
import '../actions/external-action';
import {ESLShareConfig} from '../core/esl-share-config';

import type {ESLShareButtonConfig} from '../core/esl-share-config';

export const mail: ESLShareButtonConfig = {
  action: 'external',
  icon: '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" fill="#fff" focusable="false" role="presentation" style="background: #ff1493;" viewBox="0 0 28 28"><path d="M4.63 6.94v14.1h18.8V6.94H4.63zm2.44 1.78h13.9l-6.93 5.67-6.93-5.67zm14.6 1.72v8.82H6.47v-8.79l7.59 6.21 7.63-6.24z"/></svg>',
  link: 'mailto:?subject={title}&body={url}',
  name: 'mail',
  title: 'Mail'
};
ESLShareConfig.append(mail);
