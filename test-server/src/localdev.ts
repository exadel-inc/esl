// Support for ES5 bundle target
import './../../polyfills/es5-target-shim';
// Builtin polyfills
import './../../polyfills/polyfills.es6';
// Validate environment
import './../../polyfills/polyfills.validate';
// ESL
import * as ESL from './../../components/all';

import './common/back-button';
import './common/test-media';
import './common/test-media-source';

ESL.Image.register();
ESL.Media.register();

ESL.Popup.register();
ESL.Panel.register();
ESL.PanelStack.register();

ESL.Trigger.register();
ESL.Tab.register();

ESL.TriggersContainer.register();
ESL.TabsContainer.register();
ESL.ScrollableTabs.register();

ESL.Scrollbar.register();

ESL.Carousel.register();
ESL.CarouselPlugins.Dots.register();
ESL.CarouselPlugins.Link.register();
ESL.CarouselPlugins.Touch.register();
ESL.CarouselPlugins.Autoplay.register();
