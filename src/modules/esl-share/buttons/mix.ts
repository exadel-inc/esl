/*  TODO change after migration eslint-disable max-len */
import '../actions/media-action';
import {ESLShareConfig} from '../core/esl-share-config';

import type {ESLShareButtonConfig} from '../core/esl-share-config';

export const mix: ESLShareButtonConfig = {
  action: 'media',
  icon: '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" fill="#fff" focusable="false" role="presentation" style="background: #eb4924;" viewBox="0 0 32 32"><path d="M26 6v11.077C26 18.123 25.105 19 24 19s-2-.877-2-1.923v-1a2 2 0 00-2-2 2 2 0 00-2 2v2.846c-.02 1.046-.915 1.923-2 1.923-1.12 0-2.013-.877-2-1.923V11.23a2.036 2.036 0 00-2-2c-1.062.024-1.922.822-2 1.847-.003.025-.003 4.275 0 12.75 0 1.045-.895 1.923-2 1.923s-2-.878-2-1.923V6h20z" opacity=".8"/><path d="M6 6v10.77c2.135-.006 3.878-1.648 4-3.693V11.23a.702.702 0 010-.153c.078-1.025.938-1.823 2-1.846 1.092.024 1.986.902 2 2v7.693c-.013 1.046.88 1.923 2 1.923 1.085 0 1.98-.877 2-1.923v-5.23C17.98 9.458 21.502 6 25.846 6H6"/></svg>',
  link: '//mix.com/add?url={u}',
  name: 'mix',
  title: 'MIX'
};
ESLShareConfig.append(mix);
