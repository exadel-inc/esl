import {buildRule} from '../../core/deprecated-alias';

/**
 * Rule for deprecated aliases
 */
export default buildRule([
  {
    alias: 'ESLAlertActionParams',
    deprecation: 'AlertActionParams'
  }, {
    alias: 'ESLPanelActionParams',
    deprecation: 'PanelActionParams'
  }, {
    alias: 'ESLPopupActionParams',
    deprecation: 'PopupActionParams'
  }, {
    alias: 'ESLTooltipActionParams',
    deprecation: 'TooltipActionParams'
  }
]);
