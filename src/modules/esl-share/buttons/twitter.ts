/*  TODO change after migration eslint-disable max-len */
import '../actions/media-action';
import {ESLShareConfig} from '../core/esl-share-config';

import type {ESLShareButtonConfig} from '../core/esl-share-config';

export const twitter: ESLShareButtonConfig = {
  action: 'media',
  icon: '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" fill="#fff" focusable="false" role="presentation" style="background: #000;" viewBox="0 0 28 28"><path d="M20.2,4.3h3.3l-7.2,8.3l8.5,11.2h-6.7L13,16.9l-6,6.8H3.7l7.7-8.8L3.3,4.3h6.8l4.7,6.2L20.2,4.3z M19.1,21.8 h1.8L9.1,6.1h-2L19.1,21.8z"/></svg>',
  link: '//twitter.com/intent/tweet?text={t}&url={u}',
  name: 'twitter',
  title: 'X'
};
ESLShareConfig.append(twitter);
