/*  TODO change after migration eslint-disable max-len */
import '../actions/media-action';
import {ESLShareConfig} from '../core/esl-share-config';

import type {ESLShareButtonConfig} from '../core/esl-share-config';

export const tumblr: ESLShareButtonConfig = {
  action: 'media',
  icon: '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" fill="#fff" focusable="false" role="presentation" style="background: #021a35;" viewBox="0 0 24 24"><path d="M17.43 22h-3.38c-3.03 0-5.3-1.55-5.3-5.25v-5.93H6v-3.2c3.03-.79 4.3-3.38 4.45-5.62h3.15v5.1h3.68v3.72H13.6v5.16c0 1.55.79 2.09 2.04 2.09h1.78V22Z"/></svg>',
  link: '//www.tumblr.com/widgets/share/tool?canonicalUrl={u}&title={t}',
  name: 'tumblr',
  title: 'Tumblr'
};
ESLShareConfig.append(tumblr);
