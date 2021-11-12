import {ESLAnimateService} from '../../../src/modules/esl-animate/core';
import {TraversingQuery} from '../../../src/modules/esl-traversing-query/core';

interface Iconfig{
  group?: number | false;
  repeat?: boolean;
}

function animate(className: string, config?: Iconfig): void {
  ESLAnimateService.observe(TraversingQuery.all(className), config);
}

animate('.animate-ul-group', {group: 100, repeat: true});
animate('.animate-ul-single');
