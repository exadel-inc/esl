/*  TODO change after migration eslint-disable max-len */
import '../actions/media-action';
import {ESLShareConfig} from '../core/esl-share-config';

import type {ESLShareButtonConfig} from '../core/esl-share-config';

export const kakao: ESLShareButtonConfig = {
  action: 'media',
  icon: '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" fill="#fff" focusable="false" role="presentation" style="background: #fab900;" viewBox="0 0 32 32"><path d="M20.826 6h-9.652C10.524 6 10 6.51 10 7.138v9.336c0 .63.525 1.14 1.174 1.14h4.45c-.03 1.11-.507 2.318-1.196 3.39-.775 1.207-2.426 2.543-2.44 2.555-.13.12-.226.26-.23.456 0 .15.08.263.167.385l3.104 3.395s.15.154.274.183c.14.033.3.037.41-.045 5.374-4.032 6.15-9.085 6.285-11.82V7.137C22 6.508 21.475 6 20.826 6" fill-rule="evenodd"/></svg>',
  link: '//story.kakao.com/share?url={u}',
  name: 'kakao',
  title: 'Kakao'
};
ESLShareConfig.append(kakao);
