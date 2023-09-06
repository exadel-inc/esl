import {referenceButtons} from '../config/reference-buttons';
import {createButtonTestPlan} from './button-test-plan-factory';
import '../../buttons/mail';

describe(
  'ESLShare: mail button configuration',
  createButtonTestPlan('mail', referenceButtons.mail, 'external')
);
