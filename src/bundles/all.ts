// HTMLElement ES6 extends shim
import '../helpers/es5-support/es6-htmlelement-shim';

// Builtin polyfills
import '../helpers/builtin-polyfils/closest-polyfill';

import * as SmartQuery from '../components/smart-query/smart-query';
import {SmartMultiCarousel, SmartCarouselDots} from '../components/smart-multi-carousel/smart-multi-carousel';

export {
    SmartQuery,
    SmartMultiCarousel,
    SmartCarouselDots
};
