/* eslint-disable @stylistic/max-len */
import '../actions/media-action';
import {ESLShareConfig} from '../core/esl-share-config';

import type {ESLShareButtonConfig} from '../core/esl-share-config';

export const facebook: ESLShareButtonConfig = {
  action: 'media',
  icon: '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" fill="#fff" focusable="false" role="presentation" style="background: #3c5996;" viewBox="0 0 27.99 28"><path d="M23 17.11l.55-4.24h-4.2v-2.71c0-1.23.34-2.06 2.1-2.06h2.25V4.29a31.62 31.62 0 00-3.28-.16c-3.24 0-5.46 2-5.46 5.61v3.13h-3.63v4.24H15V28h4.39V17.11z"/></svg>',
  link: '//www.facebook.com/sharer.php?u={u}',
  name: 'facebook',
  title: 'Facebook'
};
ESLShareConfig.append(facebook);
