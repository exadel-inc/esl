/* eslint-disable @stylistic/max-len */
import '../actions/media-action';
import {ESLShareConfig} from '../core/esl-share-config';

import type {ESLShareButtonConfig} from '../core/esl-share-config';

export const skype: ESLShareButtonConfig = {
  action: 'media',
  icon: '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" fill="#fff" focusable="false" role="presentation" style="background: #009edc;" viewBox="0 0 32 32"><path d="M11 4c-3.86 0-7 3.14-7 7 0 1.03.32 1.99.72 2.88-.13.69-.22 1.39-.22 2.12a11.51 11.51 0 0 0 13.63 11.28c.88.4 1.84.72 2.87.72 3.86 0 7-3.14 7-7 0-1.03-.32-1.99-.72-2.88.13-.69.22-1.39.22-2.12A11.51 11.51 0 0 0 13.87 4.72 6.96 6.96 0 0 0 11 4Zm0 2c.86 0 1.67.21 2.38.6a1 1 0 0 0 .68.09 9.49 9.49 0 0 1 11.25 11.25 1 1 0 0 0 .1.69 4.98 4.98 0 0 1-6.78 6.78 1 1 0 0 0-.7-.1A9.49 9.49 0 0 1 6.69 14.06a1 1 0 0 0-.09-.69A4.98 4.98 0 0 1 11 6Zm4.84 3.16c-2.47 0-5.12 1.04-5.12 3.84 0 1.35.48 2.77 3.12 3.44l3.32.81c1 .25 1.25.8 1.25 1.31 0 .84-.84 1.66-2.35 1.66-2.95 0-2.57-2.25-4.15-2.25-.71 0-1.22.49-1.22 1.19 0 1.36 1.67 3.15 5.37 3.15 3.52 0 5.25-1.7 5.25-3.97 0-1.46-.67-3-3.34-3.59l-2.44-.56c-.92-.21-2-.48-2-1.35 0-.87.74-1.5 2.1-1.5 2.72 0 2.49 1.88 3.84 1.88.71 0 1.31-.4 1.31-1.13 0-1.68-2.66-2.93-4.94-2.93Z"/></svg>',
  link: '//web.skype.com/share?url={u}&source=button&text={t}',
  name: 'skype',
  title: 'Skype'
};
ESLShareConfig.append(skype);
