import {ESLToggleable} from '@exadel/esl/modules/esl-toggleable/core';
import {ESLTrigger} from '@exadel/esl/modules/esl-trigger/core';
import {ESLAlert} from '@exadel/esl/modules/esl-alert/core';
import {ESLScrollbar} from '@exadel/esl/modules/esl-scrollbar/core';

import {init} from './registration';

export * from './registration';

export function initWithESL(): void {
  ESLAlert.register();
  ESLTrigger.register();
  ESLToggleable.register();
  ESLScrollbar.register();

  init();
}
