import {referenceButtons} from '../config/reference-buttons';
import {createButtonTestPlan} from './button-test-plan-factory';
import '../../buttons/native-share';

describe(
  'ESLShare: native-share button configuration',
  createButtonTestPlan('native-share', referenceButtons['native-share'], 'native')
);
