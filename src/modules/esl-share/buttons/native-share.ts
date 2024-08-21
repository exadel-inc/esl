/*  TODO change after migration eslint-disable max-len */
import '../actions/native-action';
import {ESLShareConfig} from '../core/esl-share-config';

import type {ESLShareButtonConfig} from '../core/esl-share-config';

export const nativeShare: ESLShareButtonConfig = {
  action: 'native',
  icon: '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" fill="#fff" focusable="false" role="presentation" style="background: #ff6347;" viewBox="0 0 24 24"><path d="m21.7 10.2-6.6-6c-.5-.5-1.1 0-1.1.8v3c-4.7 0-8.7 2.9-10.6 6.8-.7 1.3-1.1 2.7-1.4 4.1-.2 1 1.3 1.5 1.9.6C6.1 16 9.8 13.7 14 13.7V17c0 .8.6 1.3 1.1.8l6.6-6c.4-.4.4-1.2 0-1.6z"/></svg>',
  link: '',
  name: 'native-share',
  title: 'Share page'
};
ESLShareConfig.append(nativeShare);
