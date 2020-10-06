import type {DeviceDetector} from './esl-utils/enviroment/device-detector';
import type {BreakpointRegistry} from './esl-utils/enviroment/breakpoints';

import type {ESLImage} from './esl-image/ts/esl-image';
import type {ESLMedia} from './esl-media/ts/esl-media';

import type {ESLScrollbar} from './esl-scrollbar/ts/esl-scrollbar';

import type {ESLBasePopup} from './esl-base-popup/ts/esl-base-popup';
import type {ESLPopup} from './esl-popup/ts/esl-popup';
import type {ESLTrigger} from './esl-trigger/ts/esl-trigger';
import type {ESLTab} from './esl-tab/ts/esl-tab';
import type {ESLTriggersContainer} from './esl-trigger/ts/esl-triggers-container';
import type {ESLPanel} from './esl-panel/ts/esl-panel';
import type {ESLPanelStack} from './esl-panel/ts/esl-panel-stack';
import type {ESLTabsContainer} from './esl-tab/ts/esl-tabs-container';
import type {ESLScrollableTabs} from './esl-scrollable-tab/ts/esl-scrollable-tabs';

import type {ESLCarousel} from './esl-carousel/ts/esl-carousel';
import type {ESLCarouselDotsPlugin} from './esl-carousel/ts/plugin/esl-carousel-dots.plugin';
import type {ESLCarouselLinkPlugin} from './esl-carousel/ts/plugin/esl-carousel-link.plugin';
import type {ESLCarouselTouchPlugin} from './esl-carousel/ts/plugin/esl-carousel-touch.plugin';
import type {ESLCarouselAutoplayPlugin} from './esl-carousel/ts/plugin/esl-carousel-autoplay.plugin';

// Define global namespace
if (!('ESL' in window)) {
	Object.defineProperty(window, 'ESL', { value: {}});
}

declare global {
	const ESL: ESLLibrary;

	export interface ESLLibrary {
		DeviceDetector?: typeof DeviceDetector;
		BreakpointRegistry?: typeof BreakpointRegistry;

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