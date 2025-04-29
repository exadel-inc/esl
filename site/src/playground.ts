import {ESLSelect} from '@exadel/esl/modules/esl-forms/esl-select/core';
import {ESLImage} from '@exadel/esl/modules/esl-image/core';
import {ESLScrollbar} from '@exadel/esl/modules/esl-scrollbar/core';
import {ESLTrigger} from '@exadel/esl/modules/esl-trigger/core';
import {ESLToggleable} from '@exadel/esl/modules/esl-toggleable/core';
import {ESLAlert} from '@exadel/esl/modules/esl-alert/core';

ESLSelect.register();
ESLImage.register();
ESLScrollbar.register();
ESLTrigger.register();
ESLToggleable.register();
ESLAlert.register();
ESLAlert.init();

import {init} from '@exadel/ui-playground/esm/registration.js';
init();
