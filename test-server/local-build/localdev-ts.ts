import type {SmartLibrary} from '../../src/bundles/lib';

import './common/back-button';
import './common/test-media';
import './common/test-media-source';

SmartLibrary.SmartImage.register();
SmartLibrary.SmartMedia.register();

SmartLibrary.SmartCarousel.register();
SmartLibrary.SmartCarouselDots.register();
SmartLibrary.SmartCarouselLinkPlugin.register();
SmartLibrary.SmartCarouselTouchPlugin.register();
SmartLibrary.SmartCarouselAutoplayPlugin.register();

SmartLibrary.SmartPopup.register();
SmartLibrary.SmartPopupTrigger.register();