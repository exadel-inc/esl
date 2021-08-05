import type {DeviceDetector} from './esl-utils/environment/device-detector';
import type {TraversingQuery} from './esl-traversing-query/core/esl-traversing-query';

import type {
  ESLScreenDPR,
  ESLScreenBreakpoint,
  ESLEnvShortcuts,
  ESLMediaQuery,
  ESLMediaRuleList
} from './esl-media-query/core';

import type {ESLImage} from './esl-image/core/esl-image';
import type {ESLMedia} from './esl-media/core/esl-media';
import type {ESLAlert} from './esl-alert/core/esl-alert';

import type {ESLScrollbar} from './esl-scrollbar/core/esl-scrollbar';

import type {ESLToggleableDispatcher} from './esl-toggleable/core/esl-toggleable-dispatcher';
import type {ESLToggleable} from './esl-toggleable/core/esl-toggleable';
import type {ESLPanel, ESLPanelGroup} from './esl-panel/core';
import type {ESLPopup} from './esl-popup/core/esl-popup';

import type {ESLA11yGroup} from './esl-a11y-group/core/esl-a11y-group';
import type {ESLTrigger} from './esl-trigger/core/esl-trigger';
import type {ESLTab, ESLTabs} from './esl-tab/core';

import type {ESLNote} from './esl-note/core/esl-note';
import type {ESLFootnotes} from './esl-footnotes/core/esl-footnotes';
import type {ESLTooltip} from './esl-tooltip/core/esl-tooltip';

import type {
  ESLSelect,
  ESLSelectList,
  ESLSelectItem
} from './esl-forms/all';

import type {ESLCarousel} from './draft/esl-carousel/core/esl-carousel';
import type {ESLCarouselDotsPlugin} from './draft/esl-carousel/plugin/esl-carousel-dots.plugin';
import type {ESLCarouselLinkPlugin} from './draft/esl-carousel/plugin/esl-carousel-link.plugin';
import type {ESLCarouselTouchPlugin} from './draft/esl-carousel/plugin/esl-carousel-touch.plugin';
import type {ESLCarouselAutoplayPlugin} from './draft/esl-carousel/plugin/esl-carousel-autoplay.plugin';

declare global {
  const ESL: ESLLibrary;

  export interface ESLLibrary {
    // ESL Utils
    DeviceDetector?: typeof DeviceDetector;
    TraversingQuery?: typeof TraversingQuery;
    ScreenDPR?: typeof ESLScreenDPR;
    ScreenBreakpoint?: typeof ESLScreenBreakpoint;
    EnvShortcuts?: typeof ESLEnvShortcuts;
    MediaQuery?: typeof ESLMediaQuery;
    MediaRuleList?: typeof ESLMediaRuleList;

    // ESL Components
    Image?: typeof ESLImage;
    Media?: typeof ESLMedia;
    Alert?: typeof ESLAlert;

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

    // ESL Forms
    Select?: typeof ESLSelect;
    SelectList?: typeof ESLSelectList;
    SelectItem?: typeof ESLSelectItem;

    // ESL Drafts
    Carousel?: typeof ESLCarousel;
    CarouselPlugins: {
      Dots?: typeof ESLCarouselDotsPlugin;
      Link?: typeof ESLCarouselLinkPlugin;
      Touch?: typeof ESLCarouselTouchPlugin;
      Autoplay?: typeof ESLCarouselAutoplayPlugin;
    };

    Note?: typeof ESLNote;
    Footnotes?: typeof ESLFootnotes;
    Tooltip?: typeof ESLTooltip;
  }

  export interface HTMLElementTagNameMap {
    'esl-carousel': ESLCarousel;
    'esl-carousel-autoplay-plugin': ESLCarouselAutoplayPlugin;
    'esl-carousel-dots': ESLCarouselDotsPlugin;
    'esl-carousel-link-plugin': ESLCarouselLinkPlugin;
    'esl-carousel-touch-plugin': ESLCarouselTouchPlugin;
    'esl-a11y-group': ESLA11yGroup;
    'esl-alert': ESLAlert;
    'esl-footnotes': ESLFootnotes;
    'esl-select': ESLSelect;
    'esl-select-list': ESLSelectList;
    'esl-select-item': ESLSelectItem;
    'esl-image': ESLImage;
    'esl-media': ESLMedia;
    'esl-note': ESLNote;
    'esl-panel': ESLPanel;
    'esl-panel-group': ESLPanelGroup;
    'esl-popup': ESLPopup;
    'esl-scrollbar': ESLScrollbar;
    'esl-tabs': ESLTabs;
    'esl-tab': ESLTab;
    'esl-toggleable': ESLToggleable;
    'esl-toggleable-dispatcher': ESLToggleableDispatcher;
    'esl-tooltip': ESLTooltip;
    'esl-trigger': ESLTrigger;
  }
}
