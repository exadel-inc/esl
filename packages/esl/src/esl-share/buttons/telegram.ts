/* eslint-disable @stylistic/max-len */
import '../actions/media-action';
import {ESLShareConfig} from '../core/esl-share-config';

import type {ESLShareButtonConfig} from '../core/esl-share-config';

export const telegram: ESLShareButtonConfig = {
  action: 'media',
  icon: '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" fill="#fff" focusable="false" role="presentation" style="background: #61a8de;" viewBox="0 0 455.731 455.731"><path d="M358.844 100.6 54.091 219.359c-9.871 3.847-9.273 18.012.888 21.012l77.441 22.868 28.901 91.706c3.019 9.579 15.158 12.483 22.185 5.308l40.039-40.882 78.56 57.665c9.614 7.057 23.306 1.814 25.747-9.859l52.031-248.76c2.548-12.185-9.44-22.337-21.039-17.817zm-38.208 55.206L179.08 280.984c-1.411 1.248-2.309 2.975-2.519 4.847l-5.45 48.448c-.178 1.58-2.389 1.789-2.861.271l-22.423-72.253c-1.027-3.308.312-6.892 3.255-8.717l167.163-103.676c3.844-2.386 7.78 2.906 4.391 5.902z"/></svg>',
  link: '//t.me/share/url?url={u}&text={t}',
  name: 'telegram',
  title: 'Telegram'
};
ESLShareConfig.append(telegram);
