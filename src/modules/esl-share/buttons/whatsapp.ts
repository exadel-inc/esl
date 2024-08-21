/*  TODO change after migration eslint-disable max-len */
import '../actions/media-action';
import {ESLShareConfig} from '../core/esl-share-config';

import type {ESLShareButtonConfig} from '../core/esl-share-config';

export const whatsapp: ESLShareButtonConfig = {
  action: 'media',
  icon: '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" fill="#fff" focusable="false" role="presentation" style="background: #25D366;" viewBox="0 0 128 128"><path d="M92.35 35.49a39.58 39.58 0 0 0-28.18-11.68 39.89 39.89 0 0 0-34.52 59.74L24 104.2l21.11-5.54a39.84 39.84 0 0 0 19.04 4.85h.02A39.9 39.9 0 0 0 104 63.67a39.6 39.6 0 0 0-11.65-28.18M64.17 96.77h-.01c-5.95 0-11.77-1.6-16.86-4.61l-1.2-.72-12.54 3.29 3.35-12.22-.8-1.25a33.15 33.15 0 0 1 28.06-50.72c8.85 0 17.16 3.44 23.41 9.7a32.91 32.91 0 0 1 9.7 23.43 33.15 33.15 0 0 1-33.11 33.1m18.16-24.8c-1-.49-5.9-2.9-6.8-3.23-.92-.33-1.58-.5-2.24.5s-2.57 3.24-3.15 3.9c-.58.67-1.16.75-2.16.25s-4.2-1.55-8-4.94c-2.96-2.64-4.96-5.9-5.54-6.9s-.06-1.53.44-2.03c.44-.44 1-1.16 1.49-1.74.5-.58.66-1 1-1.66.33-.66.16-1.24-.09-1.74s-2.24-5.4-3.07-7.4c-.8-1.93-1.63-1.67-2.24-1.7-.58-.03-1.24-.04-1.9-.04-.67 0-1.75.25-2.66 1.25-.9 1-3.48 3.4-3.48 8.3s3.57 9.63 4.06 10.3c.5.66 7.02 10.72 17 15.03a57.94 57.94 0 0 0 5.68 2.1c2.38.75 4.55.64 6.27.39 1.91-.29 5.89-2.4 6.72-4.73.83-2.33.83-4.32.58-4.74-.25-.41-.92-.66-1.91-1.16"/></svg>',
  link: '//api.whatsapp.com/send?text={t}&url={u}',
  name: 'whatsapp',
  title: 'WhatsApp'
};
ESLShareConfig.append(whatsapp);
