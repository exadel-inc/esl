/* eslint-disable @stylistic/max-len */
import '../actions/media-action';
import {ESLShareConfig} from '../core/esl-share-config';

import type {ESLShareButtonConfig} from '../core/esl-share-config';

export const mixi: ESLShareButtonConfig = {
  action: 'media',
  icon: '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" fill="#fff" focusable="false" role="presentation" style="background: #cfab59;" viewBox="0 0 32 32"><path d="M16.087 5.36c-6.414 0-11.97 3.93-11.97 11.265 0 6.865 7.628 10.092 12.635 8.918v2.348S27.88 24.958 27.88 15.04c0-6.043-4.458-9.68-11.793-9.68zm6.768 14.63h-1.643v-5.634c0-.703-.506-1.565-1.566-1.565-.89 0-2.504.374-2.504 2.06v5.14H15.5v-5.202c0-1.57-.782-2.073-1.486-2.073-1.14 0-2.698.802-2.698 2.384v4.89H9.673v-8.92h1.643v1.02c.654-.538 1.548-1.02 2.698-1.02 1.21 0 2.07.428 2.58 1.27a4.444 4.444 0 013.052-1.19c1.947 0 3.21 1.772 3.21 3.172v5.667z"/></svg>',
  link: '//mixi.jp/share.pl?u={u}',
  name: 'mixi',
  title: 'Mixi'
};
ESLShareConfig.append(mixi);
