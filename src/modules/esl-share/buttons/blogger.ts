/* TODO change after migration  eslint-disable max-len */
import '../actions/media-action';
import {ESLShareConfig} from '../core/esl-share-config';

import type {ESLShareButtonConfig} from '../core/esl-share-config';

export const blogger: ESLShareButtonConfig = {
  action: 'media',
  icon: '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" fill="#fff" focusable="false" role="presentation" style="background: #f57d00;" viewBox="0 0 32 32"><path d="M19.864 21.38H11.84a1.712 1.712 0 010-3.425h8.024a1.712 1.712 0 010 3.425zm-7.542-11.27l4.012.063a1.712 1.712 0 01-.054 3.424l-4.012-.064a1.712 1.712 0 01.054-3.424zm13.4 9.404c-.007-.374-.008-.71-.01-1.014-.006-1.58-.012-2.83-1.016-3.803-.716-.694-1.565-.914-2.855-.962.176-.747.226-1.575.145-2.47-.02-2.973-2.234-5.18-5.304-5.264h-.043l-4.692.072c-1.844-.007-3.3.53-4.332 1.606-.638.666-1.362 1.83-1.45 3.72H6.16v.057a8.6 8.6 0 00-.006.393l-.12 7.125c-.008.143-.015.288-.016.437-.12 2.088.372 3.728 1.463 4.876 1.078 1.132 2.664 1.706 4.715 1.706h7.32c1.84-.017 3.393-.624 4.494-1.757 1.1-1.132 1.692-2.743 1.713-4.66v-.06z" fill-rule="evenodd"/></svg>',
  link: '//blogger.com/blog-this.g?n={t}&u={u}',
  name: 'blogger',
  title: 'Blogger'
};
ESLShareConfig.append(blogger);
