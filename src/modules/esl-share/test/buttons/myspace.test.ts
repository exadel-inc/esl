import {referenceButtons} from '../config/reference-buttons';
import {createButtonTestPlan} from './button-test-plan-factory';
import '../../buttons/myspace';

describe(
  'ESLShare: myspace button configuration',
  createButtonTestPlan('myspace', referenceButtons.myspace, 'media')
);
