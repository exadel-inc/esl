// HTMLElement ES6 extends shim
import '../helpers/es5-support/es6-htmlelement-shim';

// Builtin polyfills
import
	'../helpers/builtin-polyfils/closest-polyfill';

import {SmartQuery, SmartRuleList} from '../components/smart-query/smart-query';
import {SmartMulticarousel, SmartMulticarouselDots} from '../components/smart-multicarousel/smart-multicarousel';
import {SmartImage} from '../components/smart-image/smart-image';
import {SmartPopup} from '../components/smart-popup/smart-popup';

export {
	SmartQuery,
	SmartRuleList,
	SmartMulticarousel,
	SmartMulticarouselDots,
	SmartImage,
    SmartPopup
};
