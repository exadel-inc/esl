import type {DeviceDetector} from './esl-utils/enviroment/device-detector';
import type {BreakpointRegistry} from './esl-utils/enviroment/breakpoints';

import type {ESLImage} from './esl-image/ts/esl-image';
import type {ESLMedia} from './esl-media/ts/esl-media';
import type {ESLScrollbar} from './esl-scrollbar/ts/esl-scrollbar';
import type {ESLPopup} from './esl-popup/ts/esl-popup';
import type {ESLTrigger} from './esl-trigger/ts/esl-trigger';
import type {ESLCollapsible} from './esl-collapsible/ts/esl-collapsible';
import type {ESLTabPanel} from './esl-tab-panel/ts/esl-tab-panel';
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

		Popup?: typeof ESLPopup;
		Trigger?: typeof ESLTrigger;
		Collapsible?: typeof ESLCollapsible;
		TabPanel?: typeof ESLTabPanel;

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