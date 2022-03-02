import {ESLSelect} from '@exadel/esl/modules/esl-forms/esl-select/core';
import {ESLImage} from '@exadel/esl/modules/esl-image/core';
import {ESLScrollbar} from '@exadel/esl/modules/esl-scrollbar/core';

import {init} from '../../src/registration';

ESLSelect.register();
ESLImage.register();
ESLScrollbar.register();
init();
