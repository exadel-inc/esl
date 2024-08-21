/*  TODO change after migration eslint-disable max-len */
import '../actions/media-action';
import {ESLShareConfig} from '../core/esl-share-config';

import type {ESLShareButtonConfig} from '../core/esl-share-config';

export const linkedin: ESLShareButtonConfig = {
  action: 'media',
  icon: '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" fill="#fff" focusable="false" role="presentation" style="background: #0b77b3;" viewBox="0 0 27.99 27.99"><path d="M6.37 11.33h3.25v10.45H6.37zM8 6.13A1.88 1.88 0 116.12 8 1.88 1.88 0 018 6.13M11.65 11.33h3.12v1.43h.05a3.4 3.4 0 013.07-1.69c3.29 0 3.9 2.17 3.9 5v5.73h-3.25v-5.11c0-1.21 0-2.77-1.69-2.77s-1.94 1.32-1.94 2.69v5.17h-3.25V11.33z"/></svg>',
  link: '//www.linkedin.com/sharing/share-offsite/?url={u}',
  name: 'linkedin',
  title: 'LinkedIn'
};
ESLShareConfig.append(linkedin);
