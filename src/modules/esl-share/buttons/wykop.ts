/*  TODO change after migration eslint-disable max-len */
import '../actions/media-action';
import {ESLShareConfig} from '../core/esl-share-config';

import type {ESLShareButtonConfig} from '../core/esl-share-config';

export const wykop: ESLShareButtonConfig = {
  action: 'media',
  icon: '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" fill="#fff" focusable="false" role="presentation" style="background: #fb803f;" viewBox="0 0 32 32"><path d="M14.722 19.784l-3.48-6.832-2.667 1.36 3.82 7.497.056-.03.313.61 10.608-5.404-.48-.944-3.65-7.165-2.667 1.36 3.48 6.83-1.332.68-3.48-6.832-2.666 1.358 3.48 6.832-1.332.68z" fill="#fff"/><path d="M7.372 12.77c0-2.38 1.86-4.308 4.152-4.308h8.952c2.294 0 4.152 1.928 4.152 4.308v6.46c0 2.38-1.86 4.308-4.152 4.308h-8.952c-2.294 0-4.152-1.928-4.152-4.308v-6.46zM5 12.77v6.46C5 22.97 7.92 26 11.524 26h8.952C24.08 26 27 22.97 27 19.23v-6.46C27 9.03 24.08 6 20.476 6h-8.952C7.92 6 5 9.03 5 12.77z"/></svg>',
  link: '//www.wykop.pl/dodaj?url={u}&title={t}',
  name: 'wykop',
  title: 'Wykop'
};
ESLShareConfig.append(wykop);
