import './playground.less';

import {ESLScrollbar} from '@exadel/esl/modules/esl-scrollbar/core';
import {ESLSelect} from '@exadel/esl/modules/esl-forms/esl-select/core';

import {init} from './playground';

ESLSelect.register();
ESLScrollbar.register();
init();
