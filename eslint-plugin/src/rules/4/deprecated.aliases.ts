import {buildRule} from '../../core/deprecated-alias';

/**
 * Rule for deprecated aliases
 */
export default buildRule([
  {
    alias: 'ESLEventUtils',
    deprecation: 'EventUtils'
  }, {
    alias: 'isEqual',
    deprecation: 'deepCompare'
  }, {
    alias: 'ESLToggleableActionParams',
    deprecation: 'ToggleableActionParams'
  }, {
    alias: 'randUID',
    deprecation: 'generateUId'
  }, {
    alias: 'ESLTraversingQuery',
    deprecation: 'TraversingQuery'
  }
]);
