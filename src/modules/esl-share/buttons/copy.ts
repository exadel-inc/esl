/* eslint-disable max-len */
import '../actions/copy-action';
import {ESLShareConfig} from '../core/esl-share-config';

import type {ESLShareButtonConfig} from '../core/esl-share-config';

export const copy: ESLShareButtonConfig = {
  action: 'copy',
  icon: '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" fill="#fff" focusable="false" role="presentation" style="background: #a0522d;" viewBox="0 0 28 28"><path d="M17 9.69l-7.43 7.43 1.18 1.18 7.43-7.43L17 9.69z"/><path d="M4.31 17.8c-.481.481-.48 1.29.00138 1.77l4.02 4.02c.481.481 1.29.483 1.77.00138l4.95-4.95c.481-.481.481-1.29-7e-7-1.78l-4.02-4.02c-.481-.481-1.29-.481-1.78 0l-4.95 4.95zm1.47.887l4.36-4.36 3.44 3.44-4.36 4.36-3.44-3.44zm7-9.37c-.481.481-.481 1.29 2.8e-7 1.78l4.02 4.02c.481.481 1.29.481 1.78 0l4.95-4.95c.481-.481.48-1.29-.00138-1.77l-4.02-4.02c-.481-.481-1.29-.483-1.77-.00138l-4.95 4.95zm1.47.889l4.36-4.36 3.44 3.44-4.36 4.36-3.44-3.44z"/></svg>',
  link: '',
  name: 'copy',
  title: 'Copy',
  additional: {
    copyAlertMsg: 'Copied to clipboard'
  }
};
ESLShareConfig.append(copy);
