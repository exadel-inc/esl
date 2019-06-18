// HTMLElement ES6 extends shim
import '../helpers/es5-support/es6-htmlelement-shim';

// Builtin polyfills
import '../helpers/builtin-polyfils/closest-polyfill';

import {BreakpointRegistry, SmartQuery, SmartRuleList} from '../components/smart-query/smart-query';
import {SmartImage} from '../components/smart-image/smart-image';
import {SmartVideoEmbedded} from '../components/smart-video-embedded/smart-video-embedded';


// BreakpointRegistry.addCustomBreakpoint('xxs', 300, 600); // Definition
// BreakpointRegistry.addCustomBreakpoint('xl', 1600, 2000); // Redefinition

// Default definition
SmartImage.register('smart-image');

export {
    BreakpointRegistry,
	SmartQuery,
	SmartRuleList,
	SmartImage,
	SmartVideoEmbedded
};
