import '@exadel/esl/modules/esl-share/buttons/all';
import {ESLShare, ESLShareList, ESLShareConfig} from '@exadel/esl/modules/esl-share/core';

ESLShareConfig.append({name: 'site', 'list': 'facebook twitter linkedin telegram copy'});
ESLShare.register();
ESLShareList.register();

ESLShareConfig.set(
  fetch('/assets/share/config.json').then((response) => response.json())
).catch(
  () => console.error('ESLShare: failed to load config')
);
