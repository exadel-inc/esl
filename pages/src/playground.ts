import {ESLScrollbar} from '@exadel/esl/modules/esl-scrollbar/core';
import {ESLSelect} from '@exadel/esl/modules/esl-forms/esl-select/core';
import {ESLTrigger} from '@exadel/esl/modules/esl-trigger/core';
import {ESLToggleable} from '@exadel/esl/modules/esl-toggleable/core';

import {init} from '../../src/registration';

ESLSelect.register();
ESLScrollbar.register();
ESLTrigger.register();
ESLToggleable.register();
init();
