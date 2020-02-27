import type {SmartLibrary} from '../../src/bundles/lib';

import './common/back-button';
import './common/test-media';

SmartLibrary.SmartImage.register();
SmartLibrary.SmartMedia.register();

SmartLibrary.SmartCarousel.register();
SmartLibrary.SmartCarouselDots.register();
SmartLibrary.SmartCarouselLinkPlugin.register();
SmartLibrary.SmartCarouselAutoplayPlugin.register();

SmartLibrary.SmartPopup.register();
SmartLibrary.SmartPopupTrigger.register();