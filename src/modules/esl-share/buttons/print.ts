/*  TODO change after migration eslint-disable max-len */
import '../actions/print-action';
import {ESLShareConfig} from '../core/esl-share-config';

import type {ESLShareButtonConfig} from '../core/esl-share-config';

export const print: ESLShareButtonConfig = {
  action: 'print',
  icon: '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" fill="#fff" focusable="false" role="presentation" style="background: #2f4f4f;" viewBox="0 0 247.1 247.1"><path d="M75.4 175.5h97v6.5h-97zM75.4 194.9h97v6.5h-97z" fill="#fff"/><circle stroke-width="2" stroke-miterlimit="10" cx="178.9" cy="117.3" r="6.5" fill="#fff"/><path d="M198.3 84.9h-12.9V39.6c0-7.1-5.8-12.9-12.9-12.9h-97c-7.1 0-12.9 5.8-12.9 12.9v45.3H49.5c-11 0-19.4 8.4-19.4 19.4v58.2c0 11 8.4 19.4 19.4 19.4h12.9v25.9c0 7.1 5.8 12.9 12.9 12.9h97c7.1 0 12.9-5.8 12.9-12.9v-25.9h12.9c11 0 19.4-8.4 19.4-19.4v-58.2c.2-11-8.2-19.4-19.2-19.4zM68.9 39.6c0-3.2 2.6-6.5 6.5-6.5h97c3.2 0 6.5 2.6 6.5 6.5v45.3h-110V39.6zm110 168.2c0 3.2-2.6 6.5-6.5 6.5h-97c-3.2 0-6.5-2.6-6.5-6.5v-45.3h110v45.3zm32.3-45.3c0 7.1-5.8 12.9-12.9 12.9h-12.9V156h-123v19.4H49.5c-7.1 0-12.9-5.8-12.9-12.9v-58.2c0-7.1 5.8-12.9 12.9-12.9h148.8c7.1 0 12.9 5.8 12.9 12.9v58.2z"/></svg>',
  link: '',
  name: 'print',
  title: 'Print page'
};
ESLShareConfig.append(print);
