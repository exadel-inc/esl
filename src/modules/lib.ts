import type {DeviceDetector} from './esl-utils/environment/device-detector';

import type {ESLMediaBreakpoints} from './esl-media-query/core';

import type {ESLImage} from './esl-image/core/esl-image';
import type {ESLMedia} from './esl-media/core/esl-media';

import type {ESLScrollbar} from './esl-scrollbar/core/esl-scrollbar';

import type {ESLA11yGroup} from './esl-a11y-group/core/esl-a11y-group';
import type {ESLToggleableDispatcher} from './esl-toggleable/core/esl-toggleable-dispatcher';
import type {ESLToggleable} from './esl-toggleable/core/esl-toggleable';
import type {ESLPopup} from './esl-popup/core/esl-popup';
import type {ESLTrigger} from './esl-trigger/core/esl-trigger';
import type {ESLTab} from './esl-tab/core/esl-tab';
import type {ESLPanel} from './esl-panel/core/esl-panel';
import type {ESLPanelGroup} from './esl-panel/core/esl-panel-group';
import type {ESLTabs} from './esl-tab/core/esl-tabs';
import type {ESLNote} from './esl-note/core/esl-note';
import type {ESLFootnotes} from './esl-footnotes/core/esl-footnotes';

import type {ESLSelect, ESLSelectList, ESLSelectItem} from './esl-forms/all';

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
    Scrollbar?: typeof ESLScrollbar;

    A11yGroup?: typeof ESLA11yGroup;
    ToggleableGroupDispatcher?: typeof ESLToggleableDispatcher;
    Toggleable?: typeof ESLToggleable;
    Popup?: typeof ESLPopup;
    Trigger?: typeof ESLTrigger;
    Tab?: typeof ESLTab;
    Panel?: typeof ESLPanel;
    PanelGroup?: typeof ESLPanelGroup;
    TabsContainer?: typeof ESLTabs;

    Select?: typeof ESLSelect;
    SelectList?: typeof ESLSelectList;
    SelectItem?: typeof ESLSelectItem;

    Carousel?: typeof ESLCarousel;
    CarouselPlugins: {
      Dots?: typeof ESLCarouselDotsPlugin;
      Link?: typeof ESLCarouselLinkPlugin;
      Touch?: typeof ESLCarouselTouchPlugin;
      Autoplay?: typeof ESLCarouselAutoplayPlugin;
    };

    Note?: typeof ESLNote;
    Footnotes?: typeof ESLFootnotes;
  }
}
