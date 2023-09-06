import {referenceButtons} from '../config/reference-buttons';
import {createButtonTestPlan} from './button-test-plan-factory';
import '../../buttons/kakao';

describe(
  'ESLShare: kakao button configuration',
  createButtonTestPlan('kakao', referenceButtons.kakao, 'media')
);
