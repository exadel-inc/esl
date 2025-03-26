/* eslint-disable @stylistic/max-len */
import '../actions/media-action';
import {ESLShareConfig} from '../core/esl-share-config';

import type {ESLShareButtonConfig} from '../core/esl-share-config';

export const hatena: ESLShareButtonConfig = {
  action: 'media',
  icon: '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" fill="#fff" focusable="false" role="presentation" style="background: #08aed9;" viewBox="0 0 32 32"><path d="M6.96 8.22h7.33c1.25 0 2.21.37 2.88 1.1s1 1.64 1 2.72c0 .91-.24 1.69-.72 2.34-.32.43-.78.77-1.4 1.02.93.27 1.61.72 2.05 1.37.44.65.66 1.46.66 2.43 0 .8-.16 1.51-.47 2.15-.31.64-.74 1.14-1.28 1.51-.34.23-.84.4-1.52.5-.9.14-1.5.21-1.79.21H6.96V8.22zm3.88 6.02h1.74c.62 0 1.06-.13 1.3-.38.24-.26.37-.62.37-1.1 0-.44-.12-.8-.37-1.05-.24-.25-.67-.38-1.27-.38h-1.77v2.91zm0 6.03h2.04c.69 0 1.18-.15 1.46-.43s.43-.68.43-1.17c0-.45-.14-.82-.42-1.09-.28-.28-.77-.41-1.47-.41h-2.03c-.01-.01-.01 3.1-.01 3.1zM21.21 8.41h3.58v9.58h-3.58z"/><circle cx="23" cy="21.53" r="2.04"/></svg>',
  link: '//b.hatena.ne.jp/entry/panel/?url={u}&btitle={t}',
  name: 'hatena',
  title: 'Hatena'
};
ESLShareConfig.append(hatena);
