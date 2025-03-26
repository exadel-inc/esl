/* eslint-disable @stylistic/max-len */
import '../actions/media-action';
import {ESLShareConfig} from '../core/esl-share-config';

import type {ESLShareButtonConfig} from '../core/esl-share-config';

export const pusha: ESLShareButtonConfig = {
  action: 'media',
  icon: '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" fill="#fff" focusable="false" role="presentation" style="background: #0878ba;" viewBox="0 0 32 32"><path d="M29.27 22.19V8.07l-12.06 6.85 3.84 2.33C15.72 24.14 5.9 29.31 0 31.96V32h19.64c3.68-4.86 7.03-11.46 7.03-11.46l2.6 1.65z"/></svg>',
  link: '//www.pusha.se/posta?url={u}&title={t}',
  name: 'pusha',
  title: 'Pusha'
};
ESLShareConfig.append(pusha);
