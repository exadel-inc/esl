// Views
import {ESLCarouselViewRegistry} from './view/esl-carousel-view';
import {ESLMultiCarouselView} from './view/esl-multi-carousel-view';
import {ESLSingleCarouselView} from './view/esl-single-carousel-view';

ESLCarouselViewRegistry.instance.registerView('multiple', ESLMultiCarouselView);
ESLCarouselViewRegistry.instance.registerView('single', ESLSingleCarouselView);
