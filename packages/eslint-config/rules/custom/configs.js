/**
 * Version-scoped raw deprecation data.
 * min: inclusive lower bound
 * max: exclusive upper bound (omit if open-ended)
 *
 * @type DeprecationConfigBlock[]
 */
export const configs = [
  {
    min: '5.0.0',
    max: '6.0.0',
    aliases: {
      AlertActionParams: 'ESLAlertActionParams',
      PanelActionParams: 'ESLPanelActionParams',
      PopupActionParams: 'ESLPopupActionParams',
      TooltipActionParams: 'ESLTooltipActionParams',
      ESLEnvShortcuts: 'ESLMediaShortcuts'
    },
    staticMembers: {
      ESLAlert: {
        defaultConfig: 'DEFAULT_PARAMS'
      },
      ESLIntersectionEvent: {
        type: 'TYPE'
      },
      ESLElementResizeEvent: {
        type: 'TYPE'
      },
      ESLSwipeGestureEvent: {
        type: 'TYPE'
      },
      ESLWheelEvent: {
        type: 'TYPE'
      },
      ESLMediaShortcuts: {
        add: 'set',
        remove: 'set'
      }
    }
  },
  {
    min: '5.13.0',
    max: '7.0.0',
    aliases: {
      ESLAlertShape: 'ESLAlertTagShape',
      ESLAnimateShape: 'ESLAnimateTagShape',
      ESLCarouselShape: 'ESLCarouselTagShape',
      ESLCarouselNavDotsShape: 'ESLCarouselNavDotsTagShape',
      ESLRandomTextShape: 'ESLRandomTextTagShape'
    }
  }
];
