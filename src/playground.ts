import './registration.less';

import {ESLScrollbar} from '@exadel/esl/modules/esl-scrollbar/core';
import {ESLSelect} from '@exadel/esl/modules/esl-forms/esl-select/core';

import {init} from './registration';

ESLSelect.register();
ESLScrollbar.register();
init();
