/* eslint-disable max-len */
import '../actions/media-action';
import {ESLShareConfig} from '../core/esl-share-config';

import type {ESLShareButtonConfig} from '../core/esl-share-config';

export const twitter: ESLShareButtonConfig = {
  action: 'media',
  icon: '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" role="presentation" viewBox="0 0 27.99 27.99"><path d="M21.84 9.14a6.34 6.34 0 01-1.84.51 3.25 3.25 0 001.4-1.78 6.22 6.22 0 01-2 .78 3.22 3.22 0 00-5.57 2.2 2.92 2.92 0 00.09.73 9.11 9.11 0 01-6.67-3.36 3.16 3.16 0 00-.43 1.62 3.21 3.21 0 001.43 2.68 3.25 3.25 0 01-1.46-.41 3.23 3.23 0 002.58 3.16 3 3 0 01-.84.11 3 3 0 01-.61-.05 3.22 3.22 0 003 2.23 6.39 6.39 0 01-4 1.38 6.19 6.19 0 01-.76-.05 9.14 9.14 0 0014.08-7.71v-.41a6.36 6.36 0 001.6-1.63z"/></svg>',
  iconBackground: '#26a1ef',
  link: '//twitter.com/intent/tweet?text={t}&url={u}',
  name: 'twitter',
  title: 'Twitter'
};
ESLShareConfig.instance.appendButton(twitter);
