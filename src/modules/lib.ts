import type {DeviceDetector} from './esl-utils/environment/device-detector';

import type {ESLMediaBreakpoints} from './esl-media-query/core';

import type {ESLImage} from './esl-image/core/esl-image';
import type {ESLMedia} from './esl-media/core/esl-media';

import type {ESLScrollbar} from './esl-scrollbar/core/esl-scrollbar';

import type {ESLBasePopup} from './esl-base-popup/core/esl-base-popup';
import type {ESLPopup} from './esl-popup/core/esl-popup';
import type {ESLTrigger} from './esl-trigger/core/esl-trigger';
import type {ESLTab} from './esl-tab/core/esl-tab';
import type {ESLTriggersContainer} from './esl-trigger/core/esl-triggers-container';
import type {ESLPanel} from './esl-panel/core/esl-panel';
import type {ESLPanelStack} from './esl-panel/core/esl-panel-stack';
import type {ESLTabsContainer} from './esl-tab/core/esl-tabs-container';
import type {ESLScrollableTabs} from './esl-scrollable-tabs/core/esl-scrollable-tabs';

import type {ESLCarousel} from './draft/esl-carousel/core/esl-carousel';
import type {ESLCarouselDotsPlugin} from './draft/esl-carousel/plugin/esl-carousel-dots.plugin';
import type {ESLCarouselLinkPlugin} from './draft/esl-carousel/plugin/esl-carousel-link.plugin';
import type {ESLCarouselTouchPlugin} from './draft/esl-carousel/plugin/esl-carousel-touch.plugin';
import type {ESLCarouselAutoplayPlugin} from './draft/esl-carousel/plugin/esl-carousel-autoplay.plugin';

// Define global namespace
if (!('ESL' in window)) {
  Object.defineProperty(window, 'ESL', {value: {}});
}

declare global {
  const ESL: ESLLibrary;

  export interface ESLLibrary {
    DeviceDetector?: typeof DeviceDetector;

    MediaBreakpoints?: typeof ESLMediaBreakpoints;

    Image?: typeof ESLImage;
    Media?: typeof ESLMedia;

    BasePopup?: typeof ESLBasePopup;
    Popup?: typeof ESLPopup;
    Trigger?: typeof ESLTrigger;
    Tab?: typeof ESLTab;
    Panel?: typeof ESLPanel;
    PanelStack?: typeof ESLPanelStack;
    TriggersContainer?: typeof ESLTriggersContainer;
    TabsContainer?: typeof ESLTabsContainer;
    ScrollableTabs?: typeof ESLScrollableTabs;

    Scrollbar?: typeof ESLScrollbar;

    Carousel?: typeof ESLCarousel;
    CarouselPlugins: {
      Dots?: typeof ESLCarouselDotsPlugin;
      Link?: typeof ESLCarouselLinkPlugin;
      Touch?: typeof ESLCarouselTouchPlugin;
      Autoplay?: typeof ESLCarouselAutoplayPlugin;
    };
  }
}
