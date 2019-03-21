// HTMLElement ES6 extends shim
import '../helpers/es5-support/es6-htmlelement-shim';

// Builtin polyfills
import '../helpers/builtin-polyfils/closest-polyfill';

import * as SmartQuery from '../components/smart-query/smart-query';
import {SmartMulticarousel, SmartMulticarouselDots} from '../components/smart-multicarousel/smart-multicarousel';

export {
    SmartQuery,
    SmartMulticarousel,
    SmartMulticarouselDots
};
